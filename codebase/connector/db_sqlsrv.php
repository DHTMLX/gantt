<?php
/*
This software is allowed to use under GPL or you need to obtain Commercial or Enterise License
to use it in non-GPL project. Please contact sales@dhtmlx.com for details
*/
?><?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("db_common.php");
/*! MSSQL implementation of DataWrapper
**/
class SQLSrvDBDataWrapper extends DBDataWrapper{
	private $last_id=""; //!< ID of previously inserted record
	private $insert_operation=false; //!< flag of insert operation
	private $start_from=false; //!< index of start position
	
	public function query($sql){
		LogMaster::log($sql);
		if ($this->start_from)
			$res = sqlsrv_query($this->connection,$sql, array(), array("Scrollable" => SQLSRV_CURSOR_STATIC));
		else
			$res = sqlsrv_query($this->connection,$sql);
		
		if ($res === false){
			$errors = sqlsrv_errors();
			$message = Array();
			foreach($errors as $error)
				$message[]=$error["SQLSTATE"].$error["code"].$error["message"];
			throw new Exception("SQLSrv operation failed\n".implode("\n\n", $message));
		}
		
		if ($this->insert_operation){
			sqlsrv_next_result($res);
			$last = sqlsrv_fetch_array($res);
			$this->last_id = $last["dhx_id"];
			sqlsrv_free_stmt($res);
		}
		if ($this->start_from)
			$data = sqlsrv_fetch($res, SQLSRV_SCROLL_ABSOLUTE, $this->start_from-1);
		return $res;
	}
	
	public function get_next($res){
		$data = sqlsrv_fetch_array($res, SQLSRV_FETCH_ASSOC);
		if ($data)
			foreach ($data as $key => $value)
				if (is_a($value, "DateTime"))
					$data[$key] = $value->format("Y-m-d H:i");
		return $data;
	}
	
	public function get_new_id(){
		/*
		MSSQL doesn't support identity or auto-increment fields
		Insert SQL returns new ID value, which stored in last_id field
		*/
		return $this->last_id;
	}
	
	protected function insert_query($data,$request){
		$sql = parent::insert_query($data,$request);
		$this->insert_operation=true;
		return $sql.";SELECT SCOPE_IDENTITY() as dhx_id";
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
		if ($start && $count) 
			$this->start_from=$start;
		else 
			$this->start_from=false;
		return $sql;
	}

	public function escape($data){
		/*
		there is no special escaping method for mssql - use common logic
		*/
		return str_replace("'","''",$data);
	}
	
	public function begin_transaction(){
		sqlsrv_begin_transaction($this->connection);
	}
	public function commit_transaction(){
		sqlsrv_commit($this->connection);
	}
	public function rollback_transaction(){
		sqlsrv_rollback($this->connection);
	}		
}
?>