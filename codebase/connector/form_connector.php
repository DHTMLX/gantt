<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");

/*! DataItem class for dhxForm component
**/
class FormDataItem extends DataItem{
	/*! return self as XML string
	*/
	function to_xml(){
		if ($this->skip) return "";
		$str="";
		for ($i = 0; $i < count($this->config->data); $i++) {
			$str .= "<".$this->config->data[$i]['name']."><![CDATA[".$this->data[$this->config->data[$i]['name']]."]]></".$this->config->data[$i]['name'].">";
		}
		return $str;
	}
}


/*! Connector class for dhtmlxForm
**/
class FormConnector extends Connector{
	
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
	public function __construct($res,$type=false,$item_type=false,$data_type=false){
		if (!$item_type) $item_type="FormDataItem";
		if (!$data_type) $data_type="FormDataProcessor";
		parent::__construct($res,$type,$item_type,$data_type);
	}

	//parse GET scoope, all operations with incoming request must be done here
	function parse_request(){
		parent::parse_request();
		if (isset($_GET["id"]))
			$this->request->set_filter($this->config->id["name"],$_GET["id"],"=");
		else if (!$_POST["ids"])
			throw new Exception("ID parameter is missed");
	}

}

/*! DataProcessor class for dhxForm component
**/
class FormDataProcessor extends DataProcessor{

}
?>