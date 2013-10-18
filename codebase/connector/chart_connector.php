<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/

	require_once("dataview_connector.php");
	

/*! Connector class for DataView
**/
class ChartConnector extends DataViewConnector{
	public function __construct($res,$type=false,$item_type=false,$data_type=false){
		parent::__construct($res,$type,$item_type,$data_type);
	}
}

?>