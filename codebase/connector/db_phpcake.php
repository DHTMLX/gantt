<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("db_common.php");

//DataProcessor::$action_param ="dhx_editor_status";

/*! Implementation of DataWrapper for PDO

if you plan to use it for Oracle - use Oracle connection type instead
**/
class PHPCakeDBDataWrapper extends ArrayDBDataWrapper{
	public function select($sql){
		$source = $sql->get_source();
		if (is_array($source))	//result of find
			$res = $source;
		else
			$res = $this->connection->find("all");

		if (sizeof($res)){
			$name = get_class($this->connection);
			$temp = array();
			for ($i=sizeof($res)-1; $i>=0; $i--)
				$temp[]=&$res[$i][$name];
		}
		return new ArrayQueryWrapper($temp);
	}

	protected function getErrorMessage(){
		$errors = $this->connection->invalidFields();
		$text = array();
		foreach ($errors as $key => $value){
			$text[] = $key." - ".$value[0];
		}
		return implode("\n", $text);
	}

	public function insert($data,$source){
		$name = get_class($this->connection);
		$save = array(); 
		$temp_data = $data->get_data();
		unset($temp_data[$this->config->id['db_name']]);
		unset($temp_data["!nativeeditor_status"]);
		$save[$name] = $temp_data;

		if ($this->connection->save($save)){
			$data->success($this->connection->getLastInsertID());	
		} else {
			$data->set_response_attribute("details", $this->getErrorMessage());
			$data->invalid();
		}
	}
	public function delete($data,$source){
		$id = $data->get_id();
		$this->connection->delete($id);
		$data->success();
	}
	public function update($data,$source){
		$name = get_class($this->connection);
		$save = array(); 
		$save[$name] = &$data->get_data();

		if ($this->connection->save($save)){
			$data->success();
		} else {
			$data->set_response_attribute("details", $this->getErrorMessage());
			$data->invalid();
		}
	}	
		

	public function escape($str){
		throw new Exception("Not implemented");
	}
	public function query($str){
		throw new Exception("Not implemented");
	}
	public function get_new_id(){
		throw new Exception("Not implemented");
	}
}

?>