<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("treegrid_connector.php");

class TreeGridMultitableConnector extends TreeGridConnector{

	public function __construct($res,$type=false,$item_type=false,$data_type=false,$render_type=false){
		$data_type="TreeGridMultitableDataProcessor";
		if (!$render_type) $render_type="MultitableTreeRenderStrategy";
		parent::__construct($res,$type,$item_type,$data_type,$render_type);
	}

	public function render(){
		$this->dload = true;
		return parent::render();
	}

	/*! sets relation for rendering */
	protected function set_relation() {
		if (!isset($_GET['id']))
			$this->request->set_relation(false);
	}

	public function xml_start(){
		if (isset($_GET['id'])) {
			return "<rows parent='".$this->xmlentities($this->render->level_id($_GET['id'], $this->get_level() - 1))."'>";
		} else {
			return "<rows parent='0'>";
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


class TreeGridMultitableDataProcessor extends DataProcessor {

	function name_data($data){
		if ($data=="gr_pid")
			return $this->config->relation_id["name"];
		if ($data=="gr_id")
			return $this->config->id["name"];
		preg_match('/^c([%\d]+)$/', $data, $data_num);
		if (!isset($data_num[1])) return $data;
		$data_num = $data_num[1];
		if (isset($this->config->data[$data_num]["db_name"])) {
			return $this->config->data[$data_num]["db_name"];
		}
		return $data;
	}

}

?>