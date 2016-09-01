<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("tools.php");
require_once("db_common.php");
require_once("dataprocessor.php");
require_once("strategy.php");
require_once("update.php");

//enable buffering to catch and ignore any custom output before XML generation
//because of this command, it strongly recommended to include connector's file before any other libs
//in such case it will handle any extra output from not well formed code of other libs
ini_set("output_buffering","On");
ob_start();

class OutputWriter{
	private $start;
	private $end;
	private $type;

	public function __construct($start, $end = ""){
		$this->start = $start;
		$this->end = $end;
		$this->type = "xml";
	}
	public function add($add){
		$this->start.=$add;
	}
	public function reset(){
		$this->start="";
		$this->end="";
	}
	public function set_type($add){
		$this->type=$add;
	}
	public function output($name="", $inline=true, $encoding=""){
		ob_clean();
		
		if ($this->type == "xml"){
			$header = "Content-type: text/xml";
			if ("" != $encoding)
				$header.="; charset=".$encoding;
			header($header);
		}
			
		echo $this->__toString();
	}
	public function __toString(){
		return $this->start.$this->end;
	}
}

/*! EventInterface
	Base class , for iterable collections, which are used in event
**/
class EventInterface{ 
	protected $request; ////!< DataRequestConfig instance
	public $rules=array(); //!< array of sorting rules
	
	/*! constructor
		creates a new interface based on existing request
		@param request 
			DataRequestConfig object
	*/
	public function __construct($request){
		$this->request = $request;
	}

	/*! remove all elements from collection
		*/	
	public function clear(){
		array_splice($rules,0);
	}
	/*! get index by name
		
		@param name 
			name of field
		@return 
			index of named field
	*/
	public function index($name){
		$len = sizeof($this->rules);
		for ($i=0; $i < $len; $i++) { 
			if ($this->rules[$i]["name"]==$name)
				return $i;
		}
		return false;
	}
}
/*! Wrapper for collection of sorting rules
**/
class SortInterface extends EventInterface{
	/*! constructor
		creates a new interface based on existing request
		@param request 
			DataRequestConfig object
	*/
	public function __construct($request){
		parent::__construct($request);
		$this->rules = &$request->get_sort_by_ref();
	}
	/*! add new sorting rule
		
		@param name 
			name of field
		@param dir
			direction of sorting
	*/
	public function add($name,$dir){
		if ($dir === false)
			$this->request->set_sort($name);
		else
			$this->request->set_sort($name,$dir);
	}
	public function store(){
		$this->request->set_sort_by($this->rules);
	}
}
/*! Wrapper for collection of filtering rules
**/
class FilterInterface extends EventInterface{
	/*! constructor
		creates a new interface based on existing request
		@param request 
			DataRequestConfig object
	*/	
	public function __construct($request){
		$this->request = $request;
		$this->rules = &$request->get_filters_ref();
	}
	/*! add new filatering rule
		
		@param name 
			name of field
		@param value
			value to filter by
		@param rule
			filtering rule
	*/
	public function add($name,$value,$rule){
		$this->request->set_filter($name,$value,$rule);
	}
	public function store(){
		$this->request->set_filters($this->rules);
	}
}

/*! base class for component item representation	
**/
class DataItem{
	protected $data; //!< hash of data
	protected $config;//!< DataConfig instance
	protected $index;//!< index of element
	protected $skip;//!< flag , which set if element need to be skiped during rendering
	protected $userdata;

	/*! constructor
		
		@param data
			hash of data
		@param config
			DataConfig object
		@param index
			index of element
	*/
	function __construct($data,$config,$index){
		$this->config=$config;
		$this->data=$data;
		$this->index=$index;
		$this->skip=false;
		$this->userdata=false;
	}

	//set userdata for the item
	function set_userdata($name, $value){
		if ($this->userdata === false)
			$this->userdata = array();

		$this->userdata[$name]=$value;
	}
	/*! get named value
		
		@param name 
			name or alias of field
		@return 
			value from field with provided name or alias
	*/
	public function get_value($name){
		return $this->data[$name];
	}
	/*! set named value
		
		@param name 
			name or alias of field
		@param value
			value for field with provided name or alias
	*/
	public function set_value($name,$value){
		return $this->data[$name]=$value;
	}
	/*! get id of element
		@return 
			id of element
	*/
	public function get_id(){
		$id = $this->config->id["name"];
		if (array_key_exists($id,$this->data))
			return $this->data[$id];
		return false;
	}
	/*! change id of element
		
		@param value 
			new id value
	*/
	public function set_id($value){
		$this->data[$this->config->id["name"]]=$value;
	}
	/*! get index of element
		
		@return 
			index of element
	*/
	public function get_index(){
		return $this->index;
	}
	/*! mark element for skiping ( such element will not be rendered )
	*/
	public function skip(){
		$this->skip=true;
	}
	
	/*! return self as XML string
	*/
	public function to_xml(){
		return $this->to_xml_start().$this->to_xml_end();
	}
	
	/*! replace xml unsafe characters
		
		@param string 
			string to be escaped
		@return 
			escaped string
	*/
	public function xmlentities($string) { 
   		return str_replace( array( '&', '"', "'", '<', '>', '’' ), array( '&amp;' , '&quot;', '&apos;' , '&lt;' , '&gt;', '&apos;' ), $string);
	}
	
	/*! return starting tag for self as XML string 
	*/
	public function to_xml_start(){
		$str="<item";
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
	/*! return ending tag for XML string
	*/
	public function to_xml_end(){
		return "</item>";
	}
}





/*! Base connector class
	This class used as a base for all component specific connectors. 
	Can be used on its own to provide raw data.	
**/
class Connector {

    private $id_seed=0; //!< default value, used to generate auto-IDs
    private $db; //!< db connection resource

	protected $config;//DataConfig instance
	protected $request;//DataRequestConfig instance
	protected $names;//!< hash of names for used classes
	protected $encoding="utf-8";//!< assigned encoding (UTF-8 by default) 
	protected $editing=false;//!< flag of edit mode ( response for dataprocessor )
    protected $updating=false;//!< flag of update mode ( response for data-update )
    protected $dload;//!< flag of dyn. loading mode
    protected $data_separator = "\n";
    protected $live_update = false; // actions table name for autoupdating
    protected $live_update_data_type = "DataUpdate";
    protected $extra_output="";//!< extra info which need to be sent to client side
    protected $options=array();//!< hash of OptionsConnector
    protected $as_string = false; // render() returns string, don't send result in response
    protected $simple = false; // render only data without any other info
    protected $filters;
    protected $sorts;
    protected $mix;
    protected $order = false;

	public static $filter_var="dhx_filter";
	public static $sort_var="dhx_sort";
	public static $kids_var="dhx_kids";

    public $model=false;
    public $access;  //!< AccessMaster instance
    public $sql;	//DataWrapper instance
    public $event;	//EventMaster instance
    public $limit=false;

	/*! constructor
		
		Here initilization of all Masters occurs, execution timer initialized
		@param db 
			db connection resource
		@param type
			string , which hold type of database ( MySQL or Postgre ), optional, instead of short DB name, full name of DataWrapper-based class can be provided
		@param item_type
			name of class, which will be used for item rendering, optional, DataItem will be used by default
		@param data_type
			name of class which will be used for dataprocessor calls handling, optional, DataProcessor class will be used by default. 
	*/	
	public function __construct($db,$type=false, $item_type=false, $data_type=false, $render_type = false){
		$this->exec_time=microtime(true);

		if (!$type) $type="MySQL";
		if (class_exists($type."DBDataWrapper",false)) $type.="DBDataWrapper";
		if (!$item_type) $item_type="DataItem";
		if (!$data_type) $data_type="DataProcessor";
		if (!$render_type) $render_type="RenderStrategy";
		
		$this->names=array(
			"db_class"=>$type,
			"item_class"=>$item_type,
			"data_class"=>$data_type,
			"render_class"=>$render_type
		);
		$this->attributes = array();
		$this->filters = array();
		$this->sorts = array();
		$this->mix = array();
		
		$this->config = new DataConfig();
		$this->request = new DataRequestConfig();
		$this->event = new EventMaster();
		$this->access = new AccessMaster();

		if (!class_exists($this->names["db_class"],false))
			throw new Exception("DB class not found: ".$this->names["db_class"]);
		$this->sql = new $this->names["db_class"]($db,$this->config);
		$this->render = new $this->names["render_class"]($this);
		
		$this->db=$db;//saved for options connectors, if any
		
		EventMaster::trigger_static("connectorCreate",$this);
	}

	/*! return db connection resource
		nested class may neeed to access live connection object
		@return 
			DB connection resource
	*/
	protected function get_connection(){
		return $this->db;
	}

	public function get_config(){
		return new DataConfig($this->config);
	}
	
	public function get_request(){
		return new DataRequestConfig($this->request);
	}


	protected $attributes;
	public function add_top_attribute($name, $string){
		$this->attributes[$name] = $string;
	}

	//model is a class, which will be used for all data operations
	//we expect that it has next methods get, update, insert, delete
	//if method was not defined - we will use default logic
	public function useModel($model){
		$this->model = $model;
	}


	/*! config connector based on table
		
		@param table 
			name of table in DB
		@param id 
			name of id field
		@param fields
			list of fields names
		@param extra
			list of extra fields, optional, such fields will not be included in data rendering, but will be accessible in all inner events
		@param relation_id
			name of field used to define relations for hierarchical data organization, optional
	*/
	public function render_table($table,$id="",$fields=false,$extra=false,$relation_id=false){
		$this->configure($table,$id,$fields,$extra,$relation_id);
		return $this->render();
	}
	public function configure($table,$id="",$fields=false,$extra=false,$relation_id=false){
        if ($fields === false){
            //auto-config
            $info = $this->sql->fields_list($table);
            $fields = implode(",",$info["fields"]);
            if ($info["key"])
                $id = $info["key"];
        }
		$this->config->init($id,$fields,$extra,$relation_id);
		if (is_string($table) && strpos(trim($table), " ")!==false)
			$this->request->parse_sql($table);
		else
			$this->request->set_source($table);
	}
	
	public function uuid(){
		return time()."x".$this->id_seed++;
	}
	
	/*! config connector based on sql
		
		@param sql 
			sql query used as base of configuration
		@param id 
			name of id field
		@param fields
			list of fields names
		@param extra
			list of extra fields, optional, such fields will not be included in data rendering, but will be accessible in all inner events
		@param relation_id
			name of field used to define relations for hierarchical data organization, optional
	*/
	public function render_sql($sql,$id,$fields,$extra=false,$relation_id=false){
		$this->config->init($id,$fields,$extra,$relation_id);
		$this->request->parse_sql($sql);
		return $this->render();
	}

	public function render_array($data, $id, $fields, $extra=false, $relation_id=false){
		$this->configure("-",$id,$fields,$extra,$relation_id);
		$this->sql = new ArrayDBDataWrapper($data, $this->config);
		return $this->render();
	}

	public function render_complex_sql($sql,$id,$fields,$extra=false,$relation_id=false){
		$this->config->init($id,$fields,$extra,$relation_id);
		$this->request->parse_sql($sql, true);
		return $this->render();
	}	
	
	/*! render already configured connector
		
		@param config
			configuration of data
		@param request
			configuraton of request
	*/
	public function render_connector($config,$request){
		$this->config->copy($config);
		$this->request->copy($request);
		return $this->render();
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
				$dp = new $this->names["data_class"]($this,$this->config,$this->request);
				$dp->process($this->config,$this->request);
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


	/*! empty call which used for tree-logic
	 *  to prevent code duplicating
	 */
	protected function set_relation() {}

	/*! gets resource for rendering
	 */
	protected function get_resource() {
		return $this->sql->select($this->request);
	}


	/*! prevent SQL injection through column names
		replace dangerous chars in field names
		@param str 
			incoming field name
		@return 
			safe field name
	*/
	protected function safe_field_name($str){
		return strtok($str, " \n\t;',");
	}
	
	/*! limit max count of records
		connector will ignore any records after outputing max count
		@param limit 
			max count of records
		@return 
			none
	*/
	public function set_limit($limit){
		$this->limit = $limit;
	}
	

	public function limit($start, $count, $sort_field=false, $sort_dir=false){
		$this->request->set_limit($start, $count);
		if ($sort_field)
			$this->request->set_sort($sort_field, $sort_dir);
	}
	
	protected function parse_request_mode(){
		//detect edit mode
        if (isset($_GET["editing"])){
			$this->editing=true;
        } else if (isset($_POST["ids"])){
			$this->editing=true;
			LogMaster::log('While there is no edit mode mark, POST parameters similar to edit mode detected. \n Switching to edit mode ( to disable behavior remove POST[ids]');
		} else if (isset($_GET['dhx_version'])){
			$this->updating = true;
        }
	}
	
	/*! parse incoming request, detects commands and modes
	*/
	protected function parse_request(){
		//set default dyn. loading params, can be reset in child classes
		if ($this->dload)
            $this->request->set_limit(0,$this->dload);
		else if ($this->limit)
			$this->request->set_limit(0,$this->limit);

        if (isset($_GET["posStart"]) && isset($_GET["count"])) {
            $this->request->set_limit($_GET["posStart"],$_GET["count"]);
        }

		$this->parse_request_mode();

        if ($this->live_update && ($this->updating || $this->editing)){
            $this->request->set_version($_GET["dhx_version"]);
            $this->request->set_user($_GET["dhx_user"]);
        }
		
		if (isset($_GET[Connector::$sort_var]))
			foreach($_GET[Connector::$sort_var] as $k => $v){
				$k = $this->safe_field_name($k);
				$this->request->set_sort($this->resolve_parameter($k),$v);
			}
				
		if (isset($_GET[Connector::$filter_var]))
			foreach($_GET[Connector::$filter_var] as $k => $v){
				$k = $this->safe_field_name($k);
				if ($v !== "")
					$this->request->set_filter($this->resolve_parameter($k),$v);
			}
			
		$this->check_csrf();
	}

	protected function check_csrf(){
		$key = ConnectorSecurity::checkCSRF($this->editing);
		if ($key !== "")
			$this->add_top_attribute(ConnectorSecurity::$security_var, $key);
	}

	/*! convert incoming request name to the actual DB name
		@param name 
			incoming parameter name
		@return 
			name of related DB field
	*/
	protected function resolve_parameter($name){
		return $name;
	}


	/*! replace xml unsafe characters

		@param string
			string to be escaped
		@return
			escaped string
	*/
	protected function xmlentities($string) {
   		return str_replace( array( '&', '"', "'", '<', '>', '’' ), array( '&amp;' , '&quot;', '&apos;' , '&lt;' , '&gt;', '&apos;' ), $string);
	}
    
	public function getRecord($id){
		LogMaster::log("Retreiving data for record: ".$id);
		$source = new DataRequestConfig($this->request);
		$source->set_filter($this->config->id["name"],$id, "=");
		
		$res = $this->sql->select($source);
		
		$temp = $this->data_separator;
		$this->data_separator="";
		$output = $this->render_set($res);
		$this->data_separato=$temp;
		
		return $output;
	}
	
	/*! render from DB resultset
		@param res
			DB resultset 
		process commands, output requested data as XML
	*/
	protected function render_set($res){
		return $this->render->render_set($res, $this->names["item_class"], $this->dload, $this->data_separator, $this->config, $this->mix);
	}
	
	/*! output fetched data as XML
		@param res
			DB resultset 
	*/
	protected function output_as_xml($res){
		$result = $this->render_set($res);
		if ($this->simple) return $result;

		$start="<?xml version='1.0' encoding='".$this->encoding."' ?>".$this->xml_start();
		$end=$result.$this->xml_end();

		if ($this->as_string) return $start.$end;

		$out = new OutputWriter($start, $end);
		$this->event->trigger("beforeOutput", $this, $out);
		$out->output("", true, $this->encoding);
	}


	/*! end processing
		stop execution timer, kill the process
	*/
	protected function end_run(){
		$time=microtime(true)-$this->exec_time;
		LogMaster::log("Done in {$time}s");
		flush();
		die();
	}
	
	/*! set xml encoding
		
		methods sets only attribute in XML, no real encoding conversion occurs	
		@param encoding 
			value which will be used as XML encoding
	*/
	public function set_encoding($encoding){
		$this->encoding=$encoding;
		if ($this->live_update !== false) {
			$this->live_update->set_encoding($this->encoding);
		}
	}

	/*! enable or disable dynamic loading mode
		
		@param count 
			count of rows loaded from server, actual only for grid-connector, can be skiped in other cases. 
			If value is a false or 0 - dyn. loading will be disabled
	*/
	public function dynamic_loading($count){
		$this->dload=$count;
	}

	/*! enable or disable data reordering
		
		@param name 
			name of field, which will be used for order storing, optional
			by default 'sortorder' field will be used
	*/
	public function enable_order($name = true){
		if ($name === true)
			$name = "sortorder";

		$this->sort($name);
		$this->access->allow("order");
		$this->request->set_order($name);
		$this->order = $name;
	}
		
	/*! enable logging
		
		@param path 
			path to the log file. If set as false or empty strig - logging will be disabled
		@param client_log
			enable output of log data to the client side
	*/
	public function enable_log($path=true,$client_log=false){
		LogMaster::enable_log($path,$client_log);
	}
	
	/*! provides infor about current processing mode
		@return 
			true if processing dataprocessor command, false otherwise
	*/
	public function is_select_mode(){
		$this->parse_request_mode();
		return !$this->editing;
	}
	
	public function is_first_call(){
		$this->parse_request_mode();
		return !($this->editing || $this->updating || $this->request->get_start() || isset($_GET['dhx_no_header']));
		
	}
	
	/*! renders self as  xml, starting part
	*/
	protected function xml_start(){
		$attributes = "";

        if ($this->dload){
            //info for dyn. loadin
            if ($pos=$this->request->get_start())
                $attributes .= " pos='".$pos."'";
            else
                $attributes .= " total_count='".$this->sql->get_size($this->request)."'";
        }
		foreach($this->attributes as $k=>$v)
			$attributes .= " ".$k."='".$v."'";

		return "<data".$attributes.">";
	}
	/*! renders self as  xml, ending part
	*/
	protected function xml_end(){
		$this->fill_collections();
		if (isset($this->extra_output))
			return $this->extra_output."</data>";
		else
			return "</data>";
	}

	protected function fill_collections($list=""){
		foreach ($this->options as $k=>$v) { 
			$name = $k;
			$this->extra_output.="<coll_options for='{$name}'>";
			if (!is_string($this->options[$name]))
				$this->extra_output.=$this->options[$name]->render();
			else
				$this->extra_output.=$this->options[$name];
			$this->extra_output.="</coll_options>";
		}
	}

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

    public function get_options() {
        return $this->options;
    }


	public function insert($data) {
		$action = new DataAction('inserted', false, $data);
		$request = new DataRequestConfig();
		$request->set_source($this->request->get_source());
		
		$this->config->limit_fields($data);
		$this->sql->insert($action,$request);
		$this->config->restore_fields($data);
		
		return $action->get_new_id();
	}
	
	public function delete($id) {
		$action = new DataAction('deleted', $id, array());
		$request = new DataRequestConfig();
		$request->set_source($this->request->get_source());
		
		$this->sql->delete($action,$request);
		return $action->get_status();
}

	public function update($data) {
		$action = new DataAction('updated', $data[$this->config->id["name"]], $data);
		$request = new DataRequestConfig();
		$request->set_source($this->request->get_source());

		$this->config->limit_fields($data);
		$this->sql->update($action,$request);
		$this->config->restore_fields($data);
		
		return $action->get_status();
	}

	/*! sets actions_table for Optimistic concurrency control mode and start it
		@param table_name
			name of database table which will used for saving actions
		@param url
			url used for update notifications
	*/	
	public function enable_live_update($table, $url=false, $origin_table = false){
        $this->live_update = new $this->live_update_data_type($this->sql, $this->config, $this->request, $table,$url, array("connector" => $this, "table" => $origin_table));
        $this->live_update->set_event($this->event,$this->names["item_class"]);
		$this->live_update->set_encoding($this->encoding);
		$this->event->attach("beforeOutput", 		Array($this->live_update, "version_output"));
		$this->event->attach("beforeFiltering", 	Array($this->live_update, "get_updates"));
		$this->event->attach("beforeProcessing", 	Array($this->live_update, "check_collision"));
		$this->event->attach("afterProcessing", 	Array($this->live_update, "log_operations"));
	}

	/*! render() returns result as string or send to response
	 */
	public function asString($as_string) {
		$this->as_string = $as_string;
	}

	public function simple_render() {
		$this->simple = true;
		return $this->render();
	}

	public function filter($name, $value = false, $operation = '=') {
		$this->filters[] = array('name' => $name, 'value' => $value, 'operation' => $operation);
	}

	public function clear_filter() {
		$this->filters = array();
		$this->request->set_filters(array());
	}

	protected function apply_filters($wrap) {
		for ($i = 0; $i < count($this->filters); $i++) {
			$f = $this->filters[$i];
			$wrap->add($f['name'], $f['value'], $f['operation']);
		}
	}

	public function sort($name, $direction = false) {
		$this->sorts[] = array('name' => $name, 'direction' => $direction);
	}

	protected function apply_sorts($wrap) {
		for ($i = 0; $i < count($this->sorts); $i++) {
			$s = $this->sorts[$i];
			$wrap->add($s['name'], $s['direction']);
		}
	}

	public function mix($name, $value, $filter=false) {
		$this->mix[] = Array('name'=>$name, 'value'=>$value, 'filter'=>$filter);
	}
}


/*! wrapper around options collection, used for comboboxes and filters
**/
class OptionsConnector extends Connector{
	protected $init_flag=false;//!< used to prevent rendering while initialization
	public function __construct($res,$type=false,$item_type=false,$data_type=false){
		if (!$item_type) $item_type="DataItem";
		if (!$data_type) $data_type=""; //has not sense, options not editable
		parent::__construct($res,$type,$item_type,$data_type);
	}
	/*! render self
		process commands, return data as XML, not output data to stdout, ignore parameters in incoming request
		@return
			data as XML string
	*/	
	public function render(){
		if (!$this->init_flag){
			$this->init_flag=true;
			return "";
		}
		$res = $this->sql->select($this->request);
		return $this->render_set($res);
	}
}



class DistinctOptionsConnector extends OptionsConnector{
	/*! render self
		process commands, return data as XML, not output data to stdout, ignore parameters in incoming request
		@return
			data as XML string
	*/	
	public function render(){
		if (!$this->init_flag){
			$this->init_flag=true;
			return "";
		}
		$res = $this->sql->get_variants($this->config->text[0]["db_name"],$this->request);
		return $this->render_set($res);
	}
}

?>