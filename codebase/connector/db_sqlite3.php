<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("db_common.php");
/*! SQLite implementation of DataWrapper
**/
class SQLite3DBDataWrapper extends DBDataWrapper{

	public function query($sql){
		LogMaster::log($sql);
		
		$res = $this->connection->query($sql);
		if ($res === false)
			throw new Exception("SQLLite - sql execution failed\n".$this->connection->lastErrorMsg());
			
		return $res;
	}
	
	public function get_next($res){
		return $res->fetchArray();
	}
	
	public function get_new_id(){
		return $this->connection->lastInsertRowID();
	}
	
	public function escape($data){
		return $this->connection->escapeString($data);
	}		
}
?>