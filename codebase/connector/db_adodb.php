<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("db_common.php");
/*! Implementation of DataWrapper for PostgreSQL
**/
class AdoDBDataWrapper extends DBDataWrapper{
	protected $last_result;
	public function query($sql){
		LogMaster::log($sql);
		if (is_array($sql)) {
			$res = $this->connection->SelectLimit($sql['sql'], $sql['numrows'], $sql['offset']);
		} else {
			$res = $this->connection->Execute($sql);
		}

		if ($res===false) throw new Exception("ADODB operation failed\n".$this->connection->ErrorMsg());
		$this->last_result = $res;
		return $res;
	}

	public function get_next($res){
		if (!$res)
			$res = $this->last_result;

		if ($res->EOF)
			return false;

		$row = $res->GetRowAssoc(false);
		$res->MoveNext();
		return $row;
	}

	protected function get_new_id(){
		return $this->connection->Insert_ID();
	}

	public function escape($data){
		return $this->connection->addq($data);
	}

	/*! escape field name to prevent sql reserved words conflict
		@param data 
			unescaped data
		@return 
			escaped data
	*/
	public function escape_name($data){
		if ((strpos($data,"`")!==false || is_int($data)) || (strpos($data,".")!==false))
			return $data;
		return '`'.$data.'`';
	}


	protected function select_query($select,$from,$where,$sort,$start,$count){
		if (!$from)
			return $select;

		$sql="SELECT ".$select." FROM ".$from;
		if ($where) $sql.=" WHERE ".$where;
		if ($sort) $sql.=" ORDER BY ".$sort;

		if ($start || $count) {
			$sql=array("sql"=>$sql,'numrows'=>$count, 'offset'=>$start);
		}
		return $sql;
	}

}
?>