<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("tree_connector.php");

class TreeMultitableConnector extends TreeConnector{

	protected $parent_name = 'id';

	public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
		if (!$data_type) $data_type="TreeDataProcessor";
		if (!$render_type) $render_type="MultitableTreeRenderStrategy";
		parent::__construct($res,$type,$item_type,$data_type,$render_type);
	}

	public function render(){
		$this->dload = true;
		return parent::render();
	}

	/*! sets relation for rendering */
	protected function set_relation() {
		if (!isset($_GET[$this->parent_name]))
			$this->request->set_relation(false);
	}

	public function xml_start(){
		if (isset($_GET[$this->parent_name])) {
			return "<tree id='".$this->xmlentities($this->render->level_id($_GET[$this->parent_name], $this->get_level() - 1))."'>";
		} else {
			return "<tree id='0'>";
		}
	}

	/*! set maximum level of tree
		@param max_level
			maximum level
	*/
	public function setMaxLevel($max_level) {
		$this->render->set_max_level($max_level);
	}

	public function get_level() {
		return $this->render->get_level($this->parent_name);
	}
	
}

?>