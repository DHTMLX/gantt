<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("grid_connector.php");
class KeyGridConnector extends GridConnector{
	public function __construct($res,$type=false,$item_type=false,$data_type=false){
		if (!$item_type) $item_type="GridDataItem";
		if (!$data_type) $data_type="KeyGridDataProcessor";
		parent::__construct($res,$type,$item_type,$data_type);
		
		$this->event->attach("beforeProcessing",array($this,"before_check_key"));	
		$this->event->attach("afterProcessing",array($this,"after_check_key"));	
	}

	public function before_check_key($action){
		if ($action->get_value($this->config->id["name"])=="")
			$action->error();
	}
	public function after_check_key($action){
		if ($action->get_status()=="inserted" || $action->get_status()=="updated"){
			$action->success($action->get_value($this->config->id["name"]));
			$action->set_status("inserted");
		}
	}
};

class KeyGridDataProcessor extends DataProcessor{
	
	/*! convert incoming data name to valid db name
		converts c0..cN to valid field names
		@param data 
			data name from incoming request
		@return 
			related db_name
	*/
	function name_data($data){
		if ($data == "gr_id") return "__dummy__id__"; //ignore ID
		$parts=explode("c",$data);
		if ($parts[0]=="" && intval($parts[1])==$parts[1])
			return $this->config->text[intval($parts[1])]["name"];
		return $data;
	}
}

	
?>