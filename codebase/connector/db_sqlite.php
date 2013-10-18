<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("db_common.php");
/*! SQLite implementation of DataWrapper
**/
class SQLiteDBDataWrapper extends DBDataWrapper{

	public function query($sql){
		LogMaster::log($sql);
		
		$res = sqlite_query($this->connection,$sql);
		if ($res === false)
			throw new Exception("SQLLite - sql execution failed\n".sqlite_error_string(sqlite_last_error($this->connection)));
			
		return $res;
	}
	
	public function get_next($res){
		$data = sqlite_fetch_array($res, SQLITE_ASSOC);
		return $data;
	}
	
	public function get_new_id(){
		return sqlite_last_insert_rowid($this->connection);
	}
	
	public function escape($data){
		return sqlite_escape_string($data);
	}		
}
?>