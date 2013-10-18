<?php
require_once("db_common.php");
/*! SaSQL implementation of DataWrapper
**/
class SaSQLDBDataWrapper extends DBDataWrapper{
	private $last_id=""; //!< ID of previously inserted record

	public function query($sql){
		LogMaster::log($sql);
		$res=sasql_query($this->connection, $sql);
		if ($res===false) throw new Exception("SaSQL operation failed\n".sasql_error($this->connection));
		$this->last_result = $res;
		return $res;
	}
	
	public function get_next($res){
		if (!$res)
			$res = $this->last_result;
			
		return sasql_fetch_assoc($res);
	}
	
	public function get_new_id(){
		return sasql_insert_id($this->connection);
	}
	
	protected function insert_query($data,$request){
		$sql = parent::insert_query($data,$request);
		$this->insert_operation=true;
		return $sql;
	}		
	
	protected function select_query($select,$from,$where,$sort,$start,$count){
		if (!$from)
			return $select;
			
		$sql="SELECT " ;
		if ($count)
			$sql.=" TOP ".($count+$start);
		$sql.=" ".$select." FROM ".$from;
		if ($where) $sql.=" WHERE ".$where;
		if ($sort) $sql.=" ORDER BY ".$sort;
		return $sql;
	}

	public function escape($data){
		return sasql_escape_string($this->connection, $data);
	}
	
	public function begin_transaction(){
		$this->query("BEGIN TRAN");
	}
}
?>