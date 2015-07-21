<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");
require_once("data_connector.php");

/*! DataItem class for Scheduler component
**/
class SchedulerDataItem extends DataItem{
	/*! return self as XML string
	*/
	function to_xml(){
		if ($this->skip) return "";
		
		$str="<event id='".$this->get_id()."' >";
		$str.="<start_date><![CDATA[".$this->data[$this->config->text[0]["name"]]."]]></start_date>";
		$str.="<end_date><![CDATA[".$this->data[$this->config->text[1]["name"]]."]]></end_date>";
		$str.="<text><![CDATA[".$this->data[$this->config->text[2]["name"]]."]]></text>";
		for ($i=3; $i<sizeof($this->config->text); $i++){
			$extra = $this->config->text[$i]["name"];
			$str.="<".$extra."><![CDATA[".$this->data[$extra]."]]></".$extra.">";
		}
		if ($this->userdata !== false)
			foreach ($this->userdata as $key => $value)
				$str.="<".$key."><![CDATA[".$value."]]></".$key.">";

		return $str."</event>";
	}
}


/*! Connector class for dhtmlxScheduler
**/
class SchedulerConnector extends Connector{
	
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
		if (!$item_type) $item_type="SchedulerDataItem";
		if (!$data_type) $data_type="SchedulerDataProcessor";
		if (!$render_type) $render_type="RenderStrategy";
		parent::__construct($res,$type,$item_type,$data_type,$render_type);
	}

	//parse GET scoope, all operations with incoming request must be done here
	function parse_request(){
		parent::parse_request();
		if (count($this->config->text)){
			if (isset($_GET["to"]))
				$this->request->set_filter($this->config->text[0]["name"],$_GET["to"],"<");
			if (isset($_GET["from"]))
				$this->request->set_filter($this->config->text[1]["name"],$_GET["from"],">");
		}
	}
}

/*! DataProcessor class for Scheduler component
**/
class SchedulerDataProcessor extends DataProcessor{
	function name_data($data){
		if ($data=="start_date")
			return $this->config->text[0]["db_name"];
		if ($data=="id")
			return $this->config->id["db_name"];
		if ($data=="end_date")
			return $this->config->text[1]["db_name"];
		if ($data=="text")
			return $this->config->text[2]["db_name"];
			
		return $data;
	}
}


class JSONSchedulerDataItem extends SchedulerDataItem{
	/*! return self as XML string
	*/
	function to_xml(){
		if ($this->skip) return "";
		
		$obj = array();
		$obj['id'] = $this->get_id();
		$obj['start_date'] = $this->data[$this->config->text[0]["name"]];
		$obj['end_date'] = $this->data[$this->config->text[1]["name"]];
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


class JSONSchedulerConnector extends SchedulerConnector {
	
	protected $data_separator = ",";
    protected $live_update_data_type = "JSONDataUpdate";

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
		if (!$item_type) $item_type="JSONSchedulerDataItem";
		if (!$data_type) $data_type="SchedulerDataProcessor";
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
}
?>