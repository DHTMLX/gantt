<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");
require_once("data_connector.php");

/*! DataItem class for Gantt component
**/
class GanttDataItem extends DataItem{

    /*! return self as XML string
    */
    function to_xml(){
        if ($this->skip) return "";

        $str="<task id='".$this->get_id()."' >";
        $str.="<start_date><![CDATA[".$this->data[$this->config->text[0]["name"]]."]]></start_date>";
        $str.="<".$this->config->text[1]["name"]."><![CDATA[".$this->data[$this->config->text[1]["name"]]."]]></".$this->config->text[1]["name"].">";
        $str.="<text><![CDATA[".$this->data[$this->config->text[2]["name"]]."]]></text>";
        for ($i=3; $i<sizeof($this->config->text); $i++){
            $extra = $this->config->text[$i]["name"];
            $str.="<".$extra."><![CDATA[".$this->data[$extra]."]]></".$extra.">";
        }
        if ($this->userdata !== false)
            foreach ($this->userdata as $key => $value)
                $str.="<".$key."><![CDATA[".$value."]]></".$key.">";

        return $str."</task>";
    }
}

class GanttLinkDataItem extends DataItem {

    public function to_xml_start(){
        $str="<item id='".$this->xmlentities($this->get_id())."'";
        for ($i=0; $i < sizeof($this->config->data); $i++){
            $name=$this->config->data[$i]["name"];
            $db_name=$this->config->data[$i]["db_name"];
            $str.=" ".$name."='".$this->xmlentities($this->data[$name])."'";
        }
        //output custom data
        if ($this->userdata !== false)
            foreach ($this->userdata as $key => $value){
                $str.=" ".$key."='".$this->xmlentities($value)."'";
            }

        return $str.">";
    }

}

/*! Connector class for dhtmlxGantt
**/
class GanttConnector extends Connector{

    private $action_mode = "";
    public $links_table = "";

    protected $live_update_data_type = "GanttDataUpdate";
    protected $extra_output="";//!< extra info which need to be sent to client side
    protected $options=array();//!< hash of OptionsConnector

    /*! assign options collection to the column

        @param name
            name of the column
        @param options
            array or connector object
    */
    public function set_options($name,$options){
        if (is_array($options)){
            $str="";
            foreach($options as $k => $v)
                $str.="<item value='".$this->xmlentities($k)."' label='".$this->xmlentities($v)."' />";
            $options=$str;
        }
        $this->options[$name]=$options;
    }


    /*! constructor

        Here initilization of all Masters occurs, execution timer initialized
        @param res
            db connection resource
        @param type
            string , which hold type of database ( MySQL or Postgre ), optional, instead of short DB name, full name of DataWrapper-based class can be provided
        @param item_type
            name of class, which will be used for item rendering, optional, DataItem will be used by default
        @param data_type
            name of class which will be used for dataprocessor calls handling, optional, DataProcessor class will be used by default.
     * @param render_type
            name of class which will be used for rendering.
    */
    public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
        if (!$item_type) $item_type="GanttDataItem";
        if (!$data_type) $data_type="GanttDataProcessor";
        if (!$render_type) $render_type="RenderStrategy";
        parent::__construct($res,$type,$item_type,$data_type,$render_type);

        $this->event->attach("afterDelete", array($this, "delete_related_links"));
        $this->event->attach("afterOrder", array($this, "order_set_parent"));
    }

    //parse GET scoope, all operations with incoming request must be done here
    function parse_request(){
        parent::parse_request();

        $action_links = "links";
        if(isset($_GET["gantt_mode"]) && $_GET["gantt_mode"] == $action_links) {
            $this->action_mode = $action_links;
            $this->request->set_action_mode($action_links);
            $this->options[$action_links]->request->set_action_mode($action_links);
            $this->options[$action_links]->request->set_user($this->request->get_user());
        }


        if (count($this->config->text)){
            if (isset($_GET["to"]))
                $this->request->set_filter($this->config->text[0]["name"],$_GET["to"],"<");
            if (isset($_GET["from"]))
                $this->request->set_filter($this->config->text[1]["name"],$_GET["from"],">");
        }
    }

    function order_set_parent($action){
        $value  = $action->get_id();
        $parent = $action->get_value("parent");

        $table = $this->request->get_source();
        $id    = $this->config->id["db_name"];

        $this->sql->query("UPDATE $table SET parent = $parent WHERE $id = $value");
    }

    function delete_related_links($action){
        if (isset($this->options["links"])){
            $links = $this->options["links"];
            $value = $this->sql->escape($action->get_new_id());
            $table = $links->get_request()->get_source();
            
            $this->sql->query("DELETE FROM $table WHERE source = '$value'");
            $this->sql->query("DELETE FROM $table WHERE target = '$value'");
        }
    }

    public function render_links($table,$id="",$fields=false,$extra=false) {
        $links = new GanttLinksConnector($this->get_connection(),$this->names["db_class"]);

        if($this->live_update)
            $links->enable_live_update($this->live_update->get_table());

        $links->render_table($table,$id,$fields,$extra);
        $this->set_options("links", $links);
        $this->links_table = $table;
    }


    /*! render self
		process commands, output requested data as XML
	*/
    public function render(){
        $this->event->trigger("onInit", $this);
        EventMaster::trigger_static("connectorInit",$this);

        if (!$this->as_string)
            $this->parse_request();
        $this->set_relation();

        if ($this->live_update !== false && $this->updating!==false) {
                $this->live_update->get_updates();
        } else {
            if ($this->editing){
                if (($this->action_mode == "links") && isset($this->options["links"])) {
                    $this->options["links"]->save();
                } else {
                    $dp = new $this->names["data_class"]($this,$this->config,$this->request);
                    $dp->process($this->config,$this->request);
                }
            } else {
                if (!$this->access->check("read")){
                    LogMaster::log("Access control: read operation blocked");
                    echo "Access denied";
                    die();
                }
                $wrap = new SortInterface($this->request);
                $this->apply_sorts($wrap);
                $this->event->trigger("beforeSort",$wrap);
                $wrap->store();

                $wrap = new FilterInterface($this->request);
                $this->apply_filters($wrap);
                $this->event->trigger("beforeFilter",$wrap);
                $wrap->store();

                if ($this->model && method_exists($this->model, "get")){
                    $this->sql = new ArrayDBDataWrapper();
                    $result = new ArrayQueryWrapper(call_user_func(array($this->model, "get"), $this->request));
                    $out = $this->output_as_xml($result);
                } else {
                    $out = $this->output_as_xml($this->get_resource());

                    if ($out !== null) return $out;
                }

            }
        }
        $this->end_run();
    }

}

/*! DataProcessor class for Gantt component
**/
class GanttDataProcessor extends DataProcessor{
    function name_data($data){
        if ($data=="start_date")
            return $this->config->text[0]["name"];
        if ($data=="id")
            return $this->config->id["name"];
        if ($data=="duration" && $this->config->text[1]["name"] == "duration")
            return $this->config->text[1]["name"];
        if ($data=="end_date" && $this->config->text[1]["name"] == "end_date")
            return $this->config->text[1]["name"];
        if ($data=="text")
            return $this->config->text[2]["name"];

        return $data;
    }
}


class JSONGanttDataItem extends GanttDataItem{
    /*! return self as XML string
    */
    function to_xml(){
        if ($this->skip) return "";

        $obj = array();
        $obj['id'] = $this->get_id();
        $obj['start_date'] = $this->data[$this->config->text[0]["name"]];
        $obj[$this->config->text[1]["name"]] = $this->data[$this->config->text[1]["name"]];
        $obj['text'] = $this->data[$this->config->text[2]["name"]];
        for ($i=3; $i<sizeof($this->config->text); $i++){
            $extra = $this->config->text[$i]["name"];
            $obj[$extra]=$this->data[$extra];
        }
        
        if ($this->userdata !== false)
            foreach ($this->userdata as $key => $value)
                $obj[$key]=$value;

        return $obj;
    }
}


class JSONGanttConnector extends GanttConnector {

    protected $data_separator = ",";
    protected $live_update_data_type = "JSONGanttDataUpdate";

    /*! constructor

        Here initilization of all Masters occurs, execution timer initialized
        @param res
            db connection resource
        @param type
            string , which hold type of database ( MySQL or Postgre ), optional, instead of short DB name, full name of DataWrapper-based class can be provided
        @param item_type
            name of class, which will be used for item rendering, optional, DataItem will be used by default
        @param data_type
            name of class which will be used for dataprocessor calls handling, optional, DataProcessor class will be used by default.
    */
    public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
        if (!$item_type) $item_type="JSONGanttDataItem";
        if (!$data_type) $data_type="GanttDataProcessor";
        if (!$render_type) $render_type="JSONRenderStrategy";
        parent::__construct($res,$type,$item_type,$data_type,$render_type);
    }

    protected function xml_start() {
        return '{ "data":';
    }

    protected function xml_end() {
        $this->fill_collections();
        $end = (!empty($this->extra_output)) ? ', "collections": {'.$this->extra_output.'}' : '';
        foreach ($this->attributes as $k => $v)
            $end.=", \"".$k."\":\"".$v."\"";
        $end .= '}';
        return $end;
    }

    /*! assign options collection to the column

        @param name
            name of the column
        @param options
            array or connector object
    */
    public function set_options($name,$options){
        if (is_array($options)){
            $str=array();
            foreach($options as $k => $v)
                $str[]='{"id":"'.$this->xmlentities($k).'", "value":"'.$this->xmlentities($v).'"}';
            $options=implode(",",$str);
        }
        $this->options[$name]=$options;
    }


    /*! generates xml description for options collections

        @param list
            comma separated list of column names, for which options need to be generated
    */
    protected function fill_collections($list=""){
        $options = array();
        foreach ($this->options as $k=>$v) {
            $name = $k;
            $option="\"{$name}\":[";
            if (!is_string($this->options[$name])){
                $data = json_encode($this->options[$name]->render());
                $option.=substr($data,1,-1);
            } else
                $option.=$this->options[$name];
            $option.="]";
            $options[] = $option;
        }
        $this->extra_output .= implode($this->data_separator, $options);
    }


    /*! output fetched data as XML
        @param res
            DB resultset
    */
    protected function output_as_xml($res){
        $result = $this->render_set($res);
        if ($this->simple) return $result;

        $data=$this->xml_start().json_encode($result).$this->xml_end();

        if ($this->as_string) return $data;

        $out = new OutputWriter($data, "");
        $out->set_type("json");
        $this->event->trigger("beforeOutput", $this, $out);
        $out->output("", true, $this->encoding);
    }

    public function render_links($table,$id="",$fields=false,$extra=false,$relation_id=false) {
        $links = new JSONGanttLinksConnector($this->get_connection(),$this->names["db_class"]);

        if($this->live_update)
            $links->enable_live_update($this->live_update->get_table());

        $links->render_table($table,$id,$fields,$extra);
        $this->set_options("links", $links);
    }

}


class GanttLinksConnector extends OptionsConnector {
    protected $live_update_data_type = "GanttDataUpdate";

    public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
        if (!$item_type) $item_type="GanttLinkDataItem";
        parent::__construct($res,$type,$item_type,$data_type,$render_type);
    }

    public function render(){
        if (!$this->init_flag){
            $this->init_flag=true;
            return "";
        }

        $res = $this->sql->select($this->request);
        return $this->render_set($res);
    }

    public function save() {
        $dp = new $this->names["data_class"]($this,$this->config,$this->request);
        $dp->process($this->config,$this->request);
    }
}


class JSONGanttLinksConnector extends JSONOptionsConnector {
    protected $live_update_data_type = "JSONGanttDataUpdate";
    public function render(){
        if (!$this->init_flag){
            $this->init_flag=true;
            return "";
        }

        $res = $this->sql->select($this->request);
        return $this->render_set($res);
    }

    public function save() {
        $dp = new $this->names["data_class"]($this,$this->config,$this->request);
        $dp->process($this->config,$this->request);
    }
}

class JSONGanttDataUpdate extends JSONDataUpdate {

    public function get_updates() {
        $updates = $this->get_data_updates();
        //ToDo: Add rendering for data.
    }


    private function get_data_updates() {
        $actions_table = $this->table;
        $version = $this->request->get_version();
        $user = $this->request->get_user();

        $select_actions = "SELECT DATAID, TYPE, USER FROM {$actions_table}";
        $select_actions .= " WHERE {$actions_table}.ID > '{$version}' AND {$actions_table}.USER <> '{$user}'";


        $output = array();
        $index = 0;
        $actions_query = $this->sql->query($select_actions);
        while($action_data=$this->sql->get_next($actions_query)){
            $action_type = $action_data["TYPE"];
            $type_parts = explode("#", $action_type);
            $action_mode = $type_parts[1];
            if($action_mode == "links") {
                $data = $this->select_links_for_action($action_data["DATAID"]);
                $data = new DataItemUpdate($data, $this->config, $index, $this->item_class);
            }
            else {
                $data = $this->select_task_for_action($action_data["DATAID"]);
                $data = new DataItemUpdate($data, $this->config, $index, $this->item_class);
            }

            array_push($output, $data);
            $index++;
        }

        return $output;
    }

    protected function select_task_for_action($taskId) {
        $tasks_table = $this->request->get_source();
        $field_task_id = $this->config->id['db_name'];
        $select_actions_tasks = "SELECT * FROM {$tasks_table} WHERE {$taskId} = {$tasks_table}.{$field_task_id}";
        return $this->sql->get_next($this->sql->query($select_actions_tasks));
    }

    protected function select_links_for_action($taskId) {
        $links_connector_options = $this->options["connector"]->get_options();
        $links_table = $links_connector_options["links"]->get_request()->get_source();
        $field_task_id = $this->config->id['db_name'];
        $select_actions_tasks = "SELECT * FROM {$links_table} WHERE {$taskId} = {$links_table}.{$field_task_id}";
        return $this->sql->get_next($this->sql->query($select_actions_tasks));
    }
}

?>