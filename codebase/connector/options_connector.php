<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");

/*! DataItem class for dhxForm:options
**/
class OptionsDataItem extends DataItem{
	/*! return self as XML string
	*/
	function to_xml(){
		if ($this->skip) return "";
		$str ="";
		
		$str .= "<item value=\"".$this->xmlentities($this->data[$this->config->data[0]['db_name']])."\" label=\"".$this->xmlentities($this->data[$this->config->data[1]['db_name']])."\" />";
		return $str;
	}
}

/*! Connector class for dhtmlxForm:options
**/
class SelectOptionsConnector extends Connector{

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
		if (!$item_type) $item_type="OptionsDataItem";
		parent::__construct($res,$type,$item_type,$data_type);
	}

}

?>