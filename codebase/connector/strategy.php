<?php

class RenderStrategy {

	protected $conn = null;

	public function __construct($conn) {
		$this->conn = $conn;
	}

	/*! adds mix fields into DataConfig
	 *	@param config
	 *		DataConfig object
	 *	@param mix
	 *		mix structure
	 */
	protected function mix($config, $mix) {
		for ($i = 0; $i < count($mix); $i++) {
			if ($config->is_field($mix[$i]['name'])===-1) {
				$config->add_field($mix[$i]['name']);
			}
		}
	}

	/*! remove mix fields from DataConfig
	 *	@param config
	 *		DataConfig object
	 *	@param mix
	 *		mix structure
	 */
	protected function unmix($config, $mix) {
		for ($i = 0; $i < count($mix); $i++) {
			if ($config->is_field($mix[$i]['name'])!==-1) {
				$config->remove_field_full($mix[$i]['name']);
			}
		}
	}

	/*! adds mix fields in item
	 *	simple mix adds only strings specified by user
	 *	@param mix
	 *		mix structure
	 *	@param data
	 *		array of selected data
	 */
	protected function simple_mix($mix, $data) {
		// get mix details
		for ($i = 0; $i < count($mix); $i++)
			$data[$mix[$i]["name"]] = is_object($mix[$i]["value"]) ? "" : $mix[$i]["value"];
		return $data;
	}

	/*! adds mix fields in item
	 *	complex mix adds strings specified by user and results of subrequests
	 *	@param mix
	 *		mix structure
	 *	@param data
	 *		array of selected data
	 */
	protected function complex_mix($mix, $data) {
		// get mix details
		for ($i = 0; $i < count($mix); $i++) {
			$mixname = $mix[$i]["name"];
			if ($mix[$i]['filter'] !== false) {
				$subconn = $mix[$i]["value"];
				$filter = $mix[$i]["filter"];

				// setting relationships
				$subconn->clear_filter();
				foreach ($filter as $k => $v)
					if (isset($data[$v]))
						$subconn->filter($k, $data[$v], "=");
					else
						throw new Exception('There was no such data field registered as: '.$k);

				$subconn->asString(true);
				$data[$mixname]=$subconn->simple_render();
				if (is_array($data[$mixname]) && count($data[$mixname]) == 1)
					$data[$mixname] = $data[$mixname][0];
			} else {
				$data[$mixname] = $mix[$i]["value"];
			}
		}
		return $data;
	}

	/*! render from DB resultset
		@param res
			DB resultset 
		process commands, output requested data as XML
	*/
	public function render_set($res, $name, $dload, $sep, $config, $mix){
		$output="";
		$index=0;
		$conn = $this->conn;
		$this->mix($config, $mix);
		$conn->event->trigger("beforeRenderSet",$conn,$res,$config);
		while ($data=$conn->sql->get_next($res)){
			$data = $this->simple_mix($mix, $data);

			$data = new $name($data,$config,$index);
			if ($data->get_id()===false)
				$data->set_id($conn->uuid());
			$conn->event->trigger("beforeRender",$data);
			$output.=$data->to_xml().$sep;
			$index++;
		}
		$this->unmix($config, $mix);
		return $output;
	}

}

class JSONRenderStrategy extends RenderStrategy {

	/*! render from DB resultset
		@param res
			DB resultset 
		process commands, output requested data as json
	*/
	public function render_set($res, $name, $dload, $sep, $config, $mix){
		$output=array();
		$index=0;
		$conn = $this->conn;
		$this->mix($config, $mix);
		$conn->event->trigger("beforeRenderSet",$conn,$res,$config);
		while ($data=$conn->sql->get_next($res)){
			$data = $this->complex_mix($mix, $data);
			$data = new $name($data,$config,$index);
			if ($data->get_id()===false)
				$data->set_id($conn->uuid());
			$conn->event->trigger("beforeRender",$data);
            $item = $data->to_xml();
            if ($item !== false)
                $output[]=$item;
			$index++;
		}
		$this->unmix($config, $mix);
		return $output;
	}

}

class TreeRenderStrategy extends RenderStrategy {

	protected $id_swap = array();

	public function __construct($conn) {
		parent::__construct($conn);
		$conn->event->attach("afterInsert",array($this,"parent_id_correction_a"));
		$conn->event->attach("beforeProcessing",array($this,"parent_id_correction_b"));
	}

	public function render_set($res, $name, $dload, $sep, $config, $mix){
		$output="";
		$index=0;
		$conn = $this->conn;
        $config_copy = new DataConfig($config);
		$this->mix($config, $mix);
		while ($data=$conn->sql->get_next($res)){
			$data = $this->simple_mix($mix, $data);
			$data = new $name($data,$config,$index);
			$conn->event->trigger("beforeRender",$data);
			//there is no info about child elements,
			//if we are using dyn. loading - assume that it has,
			//in normal mode juse exec sub-render routine
			if ($data->has_kids()===-1 && $dload)
					$data->set_kids(true);
			$output.=$data->to_xml_start();
			if ($data->has_kids()===-1 || ( $data->has_kids()==true && !$dload)){
				$sub_request = new DataRequestConfig($conn->get_request());
                //$sub_request->set_fieldset(implode(",",$config_copy->db_names_list($conn->sql)));
				$sub_request->set_relation($data->get_id());
				$output.=$this->render_set($conn->sql->select($sub_request), $name, $dload, $sep, $config_copy, $mix);
			}
			$output.=$data->to_xml_end();
			$index++;
		}
		$this->unmix($config, $mix);
		return $output;
	}

	/*! store info about ID changes during insert operation
		@param dataAction 
			data action object during insert operation
	*/
	public function parent_id_correction_a($dataAction){
		$this->id_swap[$dataAction->get_id()]=$dataAction->get_new_id();
	}

	/*! update ID if it was affected by previous operation
		@param dataAction 
			data action object, before any processing operation
	*/
	public function parent_id_correction_b($dataAction){
		$relation = $this->conn->get_config()->relation_id["db_name"];
		$value = $dataAction->get_value($relation);

		if (array_key_exists($value,$this->id_swap))
			$dataAction->set_value($relation,$this->id_swap[$value]);
	}
}



class JSONTreeRenderStrategy extends TreeRenderStrategy {

	public function render_set($res, $name, $dload, $sep, $config,$mix){
		$output=array();
		$index=0;
		$conn = $this->conn;
        $config_copy = new DataConfig($config);
		$this->mix($config, $mix);
		while ($data=$conn->sql->get_next($res)){
			$data = $this->complex_mix($mix, $data);
			$data = new $name($data,$config,$index);
			$conn->event->trigger("beforeRender",$data);
			//there is no info about child elements, 
			//if we are using dyn. loading - assume that it has,
			//in normal mode just exec sub-render routine			
			if ($data->has_kids()===-1 && $dload)
					$data->set_kids(true);
			$record = $data->to_xml_start();
			if ($data->has_kids()===-1 || ( $data->has_kids()==true && !$dload)){
				$sub_request = new DataRequestConfig($conn->get_request());
                //$sub_request->set_fieldset(implode(",",$config_copy->db_names_list($conn->sql)));
				$sub_request->set_relation($data->get_id());
                //$sub_request->set_filters(array());
				$temp = $this->render_set($conn->sql->select($sub_request), $name, $dload, $sep, $config_copy, $mix);
				if (sizeof($temp))
					$record["data"] = $temp;
			}
            if ($record !== false)
			    $output[] = $record;
			$index++;
		}
		$this->unmix($config, $mix);
		return $output;
	}	

}


class MultitableTreeRenderStrategy extends TreeRenderStrategy {

	private $level = 0;
	private $max_level = null;
	protected $sep = "#";
	
	public function __construct($conn) {
		parent::__construct($conn);
		$conn->event->attach("beforeProcessing", Array($this, 'id_translate_before'));
		$conn->event->attach("afterProcessing", Array($this, 'id_translate_after'));
	}

	public function set_separator($sep) {
		$this->sep = $sep;
	}
	
	public function render_set($res, $name, $dload, $sep, $config, $mix){
		$output="";
		$index=0;
		$conn = $this->conn;
		$this->mix($config, $mix);
		while ($data=$conn->sql->get_next($res)){
			$data = $this->simple_mix($mix, $data);
			$data[$config->id['name']] = $this->level_id($data[$config->id['name']]);
			$data = new $name($data,$config,$index);
			$conn->event->trigger("beforeRender",$data);
			if (($this->max_level !== null)&&($conn->get_level() == $this->max_level)) {
				$data->set_kids(false);
			} else {
				if ($data->has_kids()===-1)
					$data->set_kids(true);
			}
			$output.=$data->to_xml_start();
			$output.=$data->to_xml_end();
			$index++;
		}
		$this->unmix($config, $mix);
		return $output;
	}


	public function level_id($id, $level = null) {
		return ($level === null ? $this->level : $level).$this->sep.$id;
	}


	/*! remove level prefix from id, parent id and set new id before processing
		@param action
			DataAction object
	*/
	public function id_translate_before($action) {
		$id = $action->get_id();
		$id = $this->parse_id($id, false);
		$action->set_id($id);
		$action->set_value('tr_id', $id);
		$action->set_new_id($id);
		$pid = $action->get_value($this->conn->get_config()->relation_id['db_name']);
		$pid = $this->parse_id($pid, false);
		$action->set_value($this->conn->get_config()->relation_id['db_name'], $pid);
	}


	/*! add level prefix in id and new id after processing
		@param action
			DataAction object
	*/
	public function id_translate_after($action) {
		$id = $action->get_id();
		$action->set_id($this->level_id($id));
		$id = $action->get_new_id();
		$action->success($this->level_id($id));
	}


	public function get_level($parent_name) {
		if ($this->level) return $this->level;
		if (!isset($_GET[$parent_name])) {
			if (isset($_POST['ids'])) {
				$ids = explode(",",$_POST["ids"]);
				$id = $this->parse_id($ids[0]);
				$this->level--;
			}
			$this->conn->get_request()->set_relation(false);
		} else {
			$id = $this->parse_id($_GET[$parent_name]);
			$_GET[$parent_name] = $id;
		}
		return $this->level;
	}


	public function is_max_level() {
		if (($this->max_level !== null) && ($this->level >= $this->max_level))
			return true;
		return false;
	}
	public function set_max_level($max_level) {
		$this->max_level = $max_level;
	}
	public function parse_id($id, $set_level = true) {
		$parts = explode('#', urldecode($id));
		if (count($parts) === 2) {
			$level = $parts[0] + 1;
			$id = $parts[1];
		} else {
			$level = 0;
			$id = '';
		}
		if ($set_level) $this->level = $level;
		return $id;
	}

}


class JSONMultitableTreeRenderStrategy extends MultitableTreeRenderStrategy {

	public function render_set($res, $name, $dload, $sep, $config, $mix){
		$output=array();
		$index=0;
		$conn = $this->conn;
		$this->mix($config, $mix);
		while ($data=$conn->sql->get_next($res)){
			$data = $this->complex_mix($mix, $data);
			$data[$config->id['name']] = $this->level_id($data[$config->id['name']]);
			$data = new $name($data,$config,$index);
			$conn->event->trigger("beforeRender",$data);

			if ($this->is_max_level()) {
				$data->set_kids(false);
			} else {
				if ($data->has_kids()===-1)
					$data->set_kids(true);
			}
			$record = $data->to_xml_start($output);
			$output[] = $record;
			$index++;
		}
		$this->unmix($config, $mix);
		return $output;
	}

}


class GroupRenderStrategy extends RenderStrategy {

	protected $id_postfix = '__{group_param}';

	public function __construct($conn) {
		parent::__construct($conn);
		$conn->event->attach("beforeProcessing", Array($this, 'check_id'));
		$conn->event->attach("onInit", Array($this, 'replace_postfix'));
	}

	public function render_set($res, $name, $dload, $sep, $config, $mix, $usemix = false){
		$output="";
		$index=0;
		$conn = $this->conn;
		if ($usemix) $this->mix($config, $mix);
		while ($data=$conn->sql->get_next($res)){
			if (isset($data[$config->id['name']])) {
				$this->simple_mix($mix, $data);
				$has_kids = false;
			} else {
				$data[$config->id['name']] = $data['value'].$this->id_postfix;
				$data[$config->text[0]['name']] = $data['value'];
				$has_kids = true;
			}
			$data = new $name($data,$config,$index);
			$conn->event->trigger("beforeRender",$data);
			if ($has_kids === false) {
				$data->set_kids(false);
			}

			if ($data->has_kids()===-1 && $dload)
				$data->set_kids(true);
			$output.=$data->to_xml_start();
			if (($data->has_kids()===-1 || ( $data->has_kids()==true && !$dload))&&($has_kids == true)){
				$sub_request = new DataRequestConfig($conn->get_request());
				$sub_request->set_relation(str_replace($this->id_postfix, "", $data->get_id()));
				$output.=$this->render_set($conn->sql->select($sub_request), $name, $dload, $sep, $config, $mix, true);
			}
			$output.=$data->to_xml_end();
			$index++;
		}
		if ($usemix) $this->unmix($config, $mix);
		return $output;
	}

	public function check_id($action) {
		if (isset($_GET['editing'])) {
			$config = $this->conn->get_config();
			$id = $action->get_id();
			$pid = $action->get_value($config->relation_id['name']);
			$pid = str_replace($this->id_postfix, "", $pid);
			$action->set_value($config->relation_id['name'], $pid);
			if (!empty($pid)) {
				return $action;
			} else {
				$action->error();
				$action->set_response_text("This record can't be updated!");
				return $action;
			}
		} else {
			return $action;
		}
	}

	public function replace_postfix() {
		if (isset($_GET['id'])) {
			$_GET['id'] = str_replace($this->id_postfix, "", $_GET['id']);
		}
	}

	public function get_postfix() {
		return $this->id_postfix;
	}

}


class JSONGroupRenderStrategy extends GroupRenderStrategy {

	public function render_set($res, $name, $dload, $sep, $config, $mix, $usemix = false){
		$output=array();
		$index=0;
		$conn = $this->conn;
		if ($usemix) $this->mix($config, $mix);
		while ($data=$conn->sql->get_next($res)){
			if (isset($data[$config->id['name']])) {
				$data = $this->complex_mix($mix, $data);
				$has_kids = false;
			} else {
				$data[$config->id['name']] = $data['value'].$this->id_postfix;
				$data[$config->text[0]['name']] = $data['value'];
				$has_kids = true;
			}
			$data = new $name($data,$config,$index);
			$conn->event->trigger("beforeRender",$data);
			if ($has_kids === false) {
				$data->set_kids(false);
			}

			if ($data->has_kids()===-1 && $dload)
				$data->set_kids(true);
			$record = $data->to_xml_start();
			if (($data->has_kids()===-1 || ( $data->has_kids()==true && !$dload))&&($has_kids == true)){
				$sub_request = new DataRequestConfig($conn->get_request());
				$sub_request->set_relation(str_replace($this->id_postfix, "", $data->get_id()));
				$temp = $this->render_set($conn->sql->select($sub_request), $name, $dload, $sep, $config, $mix, true);
				if (sizeof($temp))
					$record["data"] = $temp;
			}
			$output[] = $record;
			$index++;
		}
		if ($usemix) $this->unmix($config, $mix);
		return $output;
	}

}


?>