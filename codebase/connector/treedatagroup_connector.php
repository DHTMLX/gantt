<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("data_connector.php");

class TreeDataGroupConnector extends TreeDataConnector{

	public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
		if (!$render_type) $render_type="GroupRenderStrategy";
		parent::__construct($res,$type,$item_type,$data_type,$render_type);
	}

	/*! if not isset $_GET[id] then it's top level
	 */
	protected function set_relation() {
		if (!isset($_GET[$this->parent_name])) $this->request->set_relation(false);
	}

	/*! if it's first level then distinct level
	 *  else select by parent
	 */
	protected function get_resource() {
		$resource = null;
		if (isset($_GET[$this->parent_name]))
			$resource = $this->sql->select($this->request);
		else
			$resource = $this->sql->get_variants($this->config->relation_id['name'], $this->request);
		return $resource;
	}


	/*! renders self as xml, starting part
	*/
	public function xml_start(){
		if (isset($_GET[$this->parent_name])) {
			return "<data parent='".$_GET[$this->parent_name].$this->render->get_postfix()."'>";
		} else {
			return "<data parent='0'>";
		}
	}

}




class JSONTreeDataGroupConnector extends JSONTreeDataConnector{

	public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
		if (!$render_type) $render_type="JSONGroupRenderStrategy";
		parent::__construct($res,$type,$item_type,$data_type,$render_type);
	}

	/*! if not isset $_GET[id] then it's top level
	 */
	protected function set_relation() {
		if (!isset($_GET[$this->parent_name])) $this->request->set_relation(false);
	}

	/*! if it's first level then distinct level
	 *  else select by parent
	 */
	protected function get_resource() {
		$resource = null;
		if (isset($_GET[$this->parent_name]))
			$resource = $this->sql->select($this->request);
		else
			$resource = $this->sql->get_variants($this->config->relation_id['name'], $this->request);
		return $resource;
	}


	/*! renders self as xml, starting part
	*/
	public function xml_start(){
		if (isset($_GET[$this->parent_name])) {
			return "<data parent='".$_GET[$this->parent_name].$this->render->get_postfix()."'>";
		} else {
			return "<data parent='0'>";
		}
	}

}



?>