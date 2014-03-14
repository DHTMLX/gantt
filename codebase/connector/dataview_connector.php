<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");

/*! DataItem class for DataView component
**/
class DataViewDataItem extends DataItem{
	/*! return self as XML string
	*/
	function to_xml(){
		if ($this->skip) return "";
		
		$str="<item id='".$this->get_id()."' >";
		for ($i=0; $i<sizeof($this->config->text); $i++){
			$extra = $this->config->text[$i]["name"];
			$str.="<".$extra."><![CDATA[".$this->data[$extra]."]]></".$extra.">";
		}
		return $str."</item>";
	}
}


/*! Connector class for DataView
**/
class DataViewConnector extends Connector{
	
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
		if (!$item_type) $item_type="DataViewDataItem";
		if (!$data_type) $data_type="DataProcessor";
		parent::__construct($res,$type,$item_type,$data_type);
	}

	//parse GET scoope, all operations with incoming request must be done here
	function parse_request(){
		parent::parse_request();

		if (isset($_GET["posStart"]) && isset($_GET["count"]))
			$this->request->set_limit($_GET["posStart"],$_GET["count"]);
	}
	
	/*! renders self as  xml, starting part
	*/
	protected function xml_start(){
		$attributes = "";
		foreach($this->attributes as $k=>$v)
			$attributes .= " ".$k."='".$v."'";

		if ($this->dload){
			if ($pos=$this->request->get_start())
				return "<data pos='".$pos."'".$attributes.">";
			else
				return "<data total_count='".$this->sql->get_size($this->request)."'".$attributes.">";
		}
		else
			return "<data".$attributes.">";
	}	
}
?>