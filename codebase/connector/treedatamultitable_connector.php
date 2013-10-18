<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("data_connector.php");

class TreeDataMultitableConnector extends TreeDataConnector{

	protected $parent_name = 'parent';

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
			return "<data parent='".$this->render->level_id($_GET[$this->parent_name], $this->render->get_level() - 1)."'>";
		} else {
			return "<data parent='0'>";
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






class JSONTreeDataMultitableConnector extends TreeDataMultitableConnector{

	public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
		if (!$item_type) $item_type="JSONTreeCommonDataItem";
		if (!$data_type) $data_type="CommonDataProcessor";
		if (!$render_type) $render_type="JSONMultitableTreeRenderStrategy";
		parent::__construct($res,$type,$item_type,$data_type,$render_type);
	}

	protected function output_as_xml($res){
		$result = $this->render_set($res);
		if ($this->simple) return $result;

		$data = array();
		if (isset($_GET['parent']))
			$data["parent"] = $this->render->level_id($_GET[$this->parent_name], $this->render->get_level() - 1);
		else
			$data["parent"] = "0";
		$data["data"] = $result;

		$result = json_encode($data);
		if ($this->as_string) return $result;

		$out = new OutputWriter($result, "");
		$out->set_type("json");
		$this->event->trigger("beforeOutput", $this, $out);
		$out->output("", true, $this->encoding);
	}

	public function xml_start(){
		return '';
	}
}


?>