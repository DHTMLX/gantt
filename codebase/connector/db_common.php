<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("tools.php");

/*! manager of data request
**/
class DataRequestConfig{

    private $action_mode = "";
	private $filters;	//!< array of filtering rules
	private $relation=false;	//!< ID or other element used for linking hierarchy
	private $sort_by;	//!< sorting field 
	private $start;	//!< start of requested data
	private $count;	//!< length of requested data

	private $order = false;
    private $user;
    private $version;
	
	//for render_sql
	private $source;	//!< souce table or another source destination
	private $fieldset;	//!< set of data, which need to be retrieved from source
	
	/*! constructor

		@param proto 
			DataRequestConfig object, optional, if provided then new request object will copy all properties from provided one
	*/
	public function __construct($proto=false){
		if ($proto)
			$this->copy($proto);
		else{
			$start=0;
			$this->filters=array();
			$this->sort_by=array();
		}
	}
	
	/*! copy parameters of source object into self
		
		@param proto 
			source object
	*/
	public function copy($proto){
		$this->filters	=$proto->get_filters();
		$this->sort_by	=$proto->get_sort_by();
		$this->count	=$proto->get_count();
		$this->start	=$proto->get_start();
		$this->source	=$proto->get_source();
		$this->fieldset	=$proto->get_fieldset();
		$this->relation		=$proto->get_relation();
        $this->user = $proto->user;
        $this->version = $proto->version;
        $this->action_mode = $proto->action_mode;
	}
	
	/*! convert self to string ( for logs )
		@return 
			self as plain string,
	*/
	public function __toString(){
		$str="Source:{$this->source}\nFieldset:{$this->fieldset}\nWhere:";
		for ($i=0; $i < sizeof($this->filters); $i++)
			$str.=$this->filters[$i]["name"]." ".$this->filters[$i]["operation"]." ".$this->filters[$i]["value"].";";
		$str.="\nStart:{$this->start}\nCount:{$this->count}\n";
		for ($i=0; $i < sizeof($this->sort_by); $i++)
			$str.=$this->sort_by[$i]["name"]."=".$this->sort_by[$i]["direction"].";";
		$str.="\nRelation:{$this->relation}";
		return $str;
	}

    public function set_action_mode($action_mode) {
        $this->action_mode = $action_mode;
        return $this;
    }

    public function get_action_mode() {
        return $this->action_mode;
    }

	/*! returns set of filtering rules
		@return 
			set of filtering rules
	*/
	public function get_filters(){
		return $this->filters;
	}
	public function &get_filters_ref(){
		return $this->filters;
	}
	public function set_filters($data){
		$this->filters=$data;
	}


    public function get_order(){
        return $this->order;
    }
    public function set_order($order){
        $this->order = $order;
    }
    public function get_user(){
        return $this->user;
    }
    public function set_user($user){
        $this->user = $user;
    }
    public function get_version(){
        return $this->version;
    }
    public function set_version($version){
        $this->version = $version;
    }

	/*! returns list of used fields
		@return 
			list of used fields
	*/
	public function get_fieldset(){
		return $this->fieldset;
	}
	/*! returns name of source table 
		@return 
			name of source table 
	*/
	public function get_source(){
		return $this->source;
	}
	/*! returns set of sorting rules
		@return 
			set of sorting rules
	*/
	public function get_sort_by(){
		return $this->sort_by;
	}
	public function &get_sort_by_ref(){
		return $this->sort_by;
	}
	public function set_sort_by($data){
		$this->sort_by=$data;
	}
	
	/*! returns start index 
		@return 
			start index
	*/
	public function get_start(){
		return $this->start;
	}
	/*! returns count of requested records
		@return 
			count of requested records
	*/
	public function get_count(){
		return $this->count;
	}
	/*! returns name of relation id
		@return 
			relation id name
	*/
	public function get_relation(){
		return $this->relation;
	}
	
	/*! sets sorting rule
		
		@param field 
			name of column
		@param order
			direction of sorting
	*/
	public function set_sort($field,$order=false){
		if (!$field && !$order)
			$this->sort_by=array();
		else{
			if ($order===false)
				$this->sort_by[] = $field;
			else {
				$order=strtolower($order)=="asc"?"ASC":"DESC";
				$this->sort_by[]=array("name"=>$field,"direction" => $order);
			}
		}
	}
	/*! sets filtering rule
		
		@param field 
			name of column
		@param value
			value for filtering
		@param operation
			operation for filtering, optional , LIKE by default
	*/
	public function set_filter($field,$value=false,$operation=false){
		if ($value === false)
			array_push($this->filters,$field);
		else
			array_push($this->filters,array("name"=>$field,"value"=>$value,"operation"=>$operation));
	}
	
	/*! sets list of used fields
		
		@param value
			list of used fields
	*/
	public function set_fieldset($value){
		$this->fieldset=$value;
	}
	/*! sets name of source table
		
		@param value 
			name of source table
	*/
	public function set_source($value){
		if (is_string($value))
			$value = trim($value);
		$this->source = $value;
	}
	/*! sets data limits
		
		@param start
			start index
		@param count
			requested count of data
	*/
	public function set_limit($start,$count){
		$this->start=$start;
		$this->count=$count;
	}
	/*! sets name of relation id
		
		@param value 
			name of relation id field
	*/
	public function set_relation($value){
		$this->relation=$value;
	}
	/*! parse incoming sql, to fill other properties
		
		@param sql
			incoming sql string
	*/
	public function parse_sql($sql, $as_is = false){
		if ($as_is){
			$this->fieldset = $sql;
			return;
		}

		$sql= preg_replace("/[ \n\t]+limit[\n\t ,0-9]*$/i","",$sql);
		
		$data = preg_split("/[ \n\t]+\\_from\\_/i",$sql,2);
		if (count($data)!=2)
			$data = preg_split("/[ \n\t]+from/i",$sql,2);
		$this->fieldset = preg_replace("/^[\s]*select/i","",$data[0],1);

		//Ignore next type of calls
		//direct call to stored procedure without FROM
		if ((count($data) == 1) ||
			//UNION select
			preg_match("#[ \n\r\t]union[ \n\t\r]#i", $sql)){
				$this->fieldset = $sql;
				return;
		}

	  	$table_data = preg_split("/[ \n\t]+where/i",$data[1],2);
	  	/*
		  		if sql code contains group_by we will place all sql query in the FROM 
		  		it will not allow to use any filtering against the query
		  		still it is better than just generate incorrect sql commands for any group by query
	  	*/
	  	if (sizeof($table_data)>1 && !preg_match("#.*group by.*#i",$table_data[1])){ //where construction exists
	  		$this->set_source($table_data[0]);
  			$where_data = preg_split("/[ \n\t]+order[ ]+by/i",$table_data[1],2);
  			$this->filters[]=$where_data[0];
  			if (sizeof($where_data)==1) return; //end of line detected
  			$data=$where_data[1];
  		} else { 
  			$table_data = preg_split("/[ \n\t]+order[ ]+by/i",$data[1],2);	
  			$this->set_source($table_data[0]);
  			if (sizeof($table_data)==1) return; //end of line detected
  			$data=$table_data[1];
  		}
	  	
      	if (trim($data)){ //order by construction exists
			$s_data = preg_split("/\\,/",trim($data));
			for ($i=0; $i < count($s_data); $i++) { 
				$data=preg_split("/[ ]+/",trim($s_data[$i]),2);
				if (sizeof($data)>1)
					$this->set_sort($data[0],$data[1]);
				else
					$this->set_sort($data[0]);
			}
			
		}
	}
}
	
/*! manager of data configuration
**/
class DataConfig{
	public $id;////!< name of ID field
	public $relation_id;//!< name or relation ID field
	public $text;//!< array of text fields
	public $data;//!< array of all known fields , fields which exists only in this collection will not be included in dataprocessor's operations
	
	
	/*! converts self to the string, for logging purposes
	**/
	public function __toString(){
		$str="ID:{$this->id['db_name']}(ID:{$this->id['name']})\n";
		$str.="Relation ID:{$this->relation_id['db_name']}({$this->relation_id['name']})\n";
		$str.="Data:";
		for ($i=0; $i<sizeof($this->text); $i++)
			$str.="{$this->text[$i]['db_name']}({$this->text[$i]['name']}),";
			
		$str.="\nExtra:";
		for ($i=0; $i<sizeof($this->data); $i++)
			$str.="{$this->data[$i]['db_name']}({$this->data[$i]['name']}),";
			
		return $str;
	}
	
	/*! removes un-used fields from configuration
		@param name 
			name of field , which need to be preserved
	*/
	public function minimize($name){
		for ($i=0; $i < sizeof($this->text); $i++){
			if ($this->text[$i]["db_name"]==$name || $this->text[$i]["name"]==$name){
				$this->text[$i]["name"]="value";
				$this->data=array($this->text[$i]);
				$this->text=array($this->text[$i]);
				return;
			}
		}
		throw new Exception("Incorrect dataset minimization, master field not found.");
	}
	
	public function limit_fields($data){
		if (isset($this->full_field_list))
			$this->restore_fields();
		$this->full_field_list = $this->text;
		$this->text = array();
			
		for ($i=0; $i < sizeof($this->full_field_list); $i++) { 
			if (array_key_exists($this->full_field_list[$i]["name"],$data))
				$this->text[] = $this->full_field_list[$i];
		}
	}
	
	public function restore_fields(){
		if (isset($this->full_field_list))
			$this->text = $this->full_field_list;
	}
	
	/*! initialize inner state by parsing configuration parameters

		@param id 
			name of id field
		@param fields
			name of data field(s)
		@param extra
			name of extra field(s)
		@param relation
			name of relation field
			
	*/
	public function init($id,$fields,$extra,$relation){
		$this->id	= $this->parse($id,false);
		$this->text = $this->parse($fields,true);
		$this->data	= array_merge($this->text,$this->parse($extra,true));
		$this->relation_id = $this->parse($relation,false);
	}
	
	/*! parse configuration string
		
		@param key 
			key string from configuration
		@param mode
			multi names flag
		@return 
			parsed field name object
	*/
	private function parse($key,$mode){
		if ($mode){
			if (!$key) return array();
			$key=explode(",",$key);
			for ($i=0; $i < sizeof($key); $i++)
				$key[$i]=$this->parse($key[$i],false);
			return $key;
		}
		$key=explode("(",$key);
		$data=array("db_name"=>trim($key[0]), "name"=>trim($key[0]));
		if (sizeof($key)>1)
			$data["name"]=substr(trim($key[1]),0,-1);
		return $data;		
	}
	
	/*! constructor
		init public collectons
		@param proto
			DataConfig object used as prototype for new one, optional
	*/
	public function __construct($proto=false){
		if ($proto!==false)
			$this->copy($proto);
		else {
			$this->text=array();
			$this->data=array();
			$this->id=array("name"=>"dhx_auto_id", "db_name"=>"dhx_auto_id");
			$this->relation_id=array("name"=>"", "db_name"=>"");
		}
	}
	
	/*! copy properties from source object
		
		@param proto 
			source object
	*/
	public function copy($proto){
		$this->id = $proto->id;
		$this->relation_id = $proto->relation_id;
		$this->text = $proto->text;
		$this->data = $proto->data;			
	}

	/*! returns list of data fields (db_names)
		@return 
			list of data fields ( ready to be used in SQL query )
	*/
	public function db_names_list($db){
		$out=array();
		if ($this->id["db_name"])
			array_push($out,$db->escape_name($this->id["db_name"]));
		if ($this->relation_id["db_name"])
			array_push($out,$db->escape_name($this->relation_id["db_name"]));
		
		for ($i=0; $i < sizeof($this->data); $i++){
			if ($this->data[$i]["db_name"]!=$this->data[$i]["name"])
				$out[]=$db->escape_name($this->data[$i]["db_name"])." as ".$this->data[$i]["name"];
			else
				$out[]=$db->escape_name($this->data[$i]["db_name"]);
		}
		
		return $out;
	}
	
	/*! add field to dataset config ($text collection)
	
		added field will be used in all auto-generated queries
		@param name 
			name of field
		@param aliase
			aliase of field, optional
	*/	
	public function add_field($name,$aliase=false){
		if ($aliase===false) $aliase=$name;
		
		//adding to list of data-active fields
		if ($this->id["db_name"]==$name || $this->relation_id["db_name"] == $name){
			LogMaster::log("Field name already used as ID, be sure that it is really necessary.");
		}
		if ($this->is_field($name,$this->text)!=-1)
			throw new Exception('Data field already registered: '.$name);
		array_push($this->text,array("db_name"=>$name,"name"=>$aliase));
		
		//adding to list of all fields as well
		if ($this->is_field($name,$this->data)==-1)
			array_push($this->data,array("db_name"=>$name,"name"=>$aliase));
		
	}
	
	/*! remove field from dataset config ($text collection)

		removed field will be excluded from all auto-generated queries
		@param name 
			name of field, or aliase of field
	*/
	public function remove_field($name){
		$ind = $this->is_field($name);
		if ($ind==-1) throw new Exception('There was no such data field registered as: '.$name);
		array_splice($this->text,$ind,1);
		//we not deleting field from $data collection, so it will not be included in data operation, but its data still available
	}
	
	/*! remove field from dataset config ($text and $data collections)

		removed field will be excluded from all auto-generated queries
		@param name 
			name of field, or aliase of field
	*/
	public function remove_field_full($name){
		$ind = $this->is_field($name);
		if ($ind==-1) throw new Exception('There was no such data field registered as: '.$name);
		array_splice($this->text,$ind,1);
		
		$ind = $this->is_field($name, $this->data);
		if ($ind==-1) throw new Exception('There was no such data field registered as: '.$name);
		array_splice($this->data,$ind,1);
	}
	
	/*! check if field is a part of dataset

		@param name 
			name of field
		@param collection
			collection, against which check will be done, $text collection by default
		@return 
			returns true if field already a part of dataset, otherwise returns true
	*/
	public function is_field($name,$collection = false){
		if (!$collection)
			$collection=$this->text;
			
		for ($i=0; $i<sizeof($collection); $i++)
			if ($collection[$i]["name"] == $name || $collection[$i]["db_name"] == $name)	return $i;
		return -1;
	}
	
	
}

/*! Base abstraction class, used for data operations
	Class abstract access to data, it is a base class to all DB wrappers
**/
abstract class DataWrapper{
	protected $connection;
	protected $config;//!< DataConfig instance
	/*! constructor
		@param connection
			DB connection
		@param config 
			DataConfig instance
	*/
	public function __construct($connection = false,$config = false){
		$this->config=$config;
		$this->connection=$connection;
	}
	
	/*! insert record in storage
		
		@param data 
			DataAction object
		@param source
			DataRequestConfig object
	*/
	abstract function insert($data,$source);
	
	/*! delete record from storage
		
		@param data 
			DataAction object
		@param source
			DataRequestConfig object
	*/
	abstract function delete($data,$source);
	
	/*! update record in storage
		
		@param data 
			DataAction object
		@param source
			DataRequestConfig object
	*/
	abstract function update($data,$source);
	
	/*! select record from storage
		
		@param source
			DataRequestConfig object
	*/
	abstract function select($source);
	
	/*! get size of storage
		
		@param source
			DataRequestConfig object
	*/
	abstract function get_size($source);
	
	/*! get all variations of field in storage
		
		@param name
			name of field
		@param source
			DataRequestConfig object
	*/
	abstract function get_variants($name,$source);
	
	/*! checks if there is a custom sql string for specified db operation
		
		@param  name
			name of DB operation
		@param  data
			hash of data
		@return 
			sql string
	*/
	public function get_sql($name,$data){
		return ""; //custom sql not supported by default
	}
	
	/*! begins DB transaction
	*/
	public function begin_transaction(){
		throw new Exception("Data wrapper not supports transactions.");
	}
	/*! commits DB transaction
	*/
	public function commit_transaction(){
		throw new Exception("Data wrapper not supports transactions.");
	}
	/*! rollbacks DB transaction
	*/
	public function rollback_transaction(){
		throw new Exception("Data wrapper not supports transactions.");
	}	
}

/*! Common database abstraction class
	Class provides base set of methods to access and change data in DB, class used as a base for DB-specific wrappers
**/
abstract class DBDataWrapper extends DataWrapper{
	private $transaction = false; //!< type of transaction
	private $sequence=false;//!< sequence name
	private $sqls = array();//!< predefined sql actions
	
	
	/*! assign named sql query
		@param name 
			name of sql query
		@param data
			sql query text
	*/
	public function attach($name,$data){
		$name=strtolower($name);
		$this->sqls[$name]=$data;
	}
	/*! replace vars in sql string with actual values
		
		@param matches 
			array of field name matches
		@return 
			value for the var name
	*/
	public function get_sql_callback($matches){
		return $this->escape($this->temp->get_value($matches[1]));
	}
	public function get_sql($name,$data){
		$name=strtolower($name);
		if (!array_key_exists($name,$this->sqls)) return "";
		
		
		$str = $this->sqls[$name];
		$this->temp = $data; //dirty
		$str = preg_replace_callback('|\{([^}]+)\}|',array($this,"get_sql_callback"),$str);
		unset ($this->temp); //dirty
		return $str;
	}

	public function new_record_order($action, $source){
		$order = $source->get_order();
		if ($order){
			$table = $source->get_source();
			$id    = $this->config->id["db_name"];
			$idvalue = $action->get_new_id();

			$max = $this->queryOne("SELECT MAX($order) as dhx_maxvalue FROM $table");
			$dhx_maxvalue = $max["dhx_maxvalue"] + 1;

			$this->query("UPDATE $table SET $order = $dhx_maxvalue WHERE $id = $idvalue");
		}
	}
	
	public function order($data, $source){
		//id of moved item
		$id1 = $this->escape($data->get_value("id"));
		//id of target item
		$target = $data->get_value("target");
		if (strpos($target, "next:") !== false){
			$dropnext = true;
			$id2 = str_replace("next:", "", $target);
		} else {
			$id2 = $target;
		}
		$id2 = $this->escape($id2);
		

		//for tree like components we need to limit out queries to the affected branch only
		$relation_select = $relation_update = $relation_sql_out = $relation_sql = "";
		if ($this->config->relation_id["name"]){
			$relation = $data->get_value($this->config->relation_id["name"]);
			if ($relation !== false && $relation !== ""){
				$relation_sql = " ".$this->config->relation_id["db_name"]." = '".$this->escape($relation)."' AND ";
				$relation_select = $this->config->relation_id["db_name"]." as dhx_parent, ";
				$relation_update = " ".$this->config->relation_id["db_name"]." = '".$this->escape($relation)."', ";
			}
		}

		
		$name = $source->get_order();
		$table = $source->get_source();
		$idkey = $this->config->id["db_name"];

		$source = $this->queryOne("select $relation_select $name as dhx_index from $table where $idkey = '$id1'");
		$source_index = $source["dhx_index"] ? $source["dhx_index"] : 0;
		if ($relation_sql)
			$relation_sql_out = " ".$this->config->relation_id["db_name"]." = '".$this->escape($source["dhx_parent"])."' AND ";
		
		$this->query("update $table set $name = $name - 1 where $relation_sql_out $name >= $source_index");

		if ($id2 !== ""){
			$target = $this->queryOne("select $name as dhx_index from $table where $idkey = '$id2'");
			$target_index = $target["dhx_index"];
			if (!$target_index)
				$target_index = 0;
			if ($dropnext)
				$target_index += 1;
			$this->query("update $table set $name = $name + 1 where $relation_sql $name >= $target_index");
		} else {
			$target = $this->queryOne("select max($name) as dhx_index from $table");
			$target_index = ($target["dhx_index"] ? $target["dhx_index"] : 0)+1;
		}

		$this->query("update $table set $relation_update $name = $target_index where $idkey = '$id1'");
	}

	public function insert($data,$source){
		$sql=$this->insert_query($data,$source);
		$this->query($sql);
		$data->success($this->get_new_id());
	}
	public function delete($data,$source){
		$sql=$this->delete_query($data,$source);
		$this->query($sql);
		$data->success();
	}
	public function update($data,$source){
		$sql=$this->update_query($data,$source);
		$this->query($sql);
		$data->success();
	}
	public function select($source){
		$select=$source->get_fieldset();
		if (!$select){
			$select=$this->config->db_names_list($this);
			$select = implode(",",$select);
		}
		
		$where=$this->build_where($source->get_filters(),$source->get_relation());
		$sort=$this->build_order($source->get_sort_by());
			
		return $this->query($this->select_query($select,$source->get_source(),$where,$sort,$source->get_start(),$source->get_count()));
	}	
	public function queryOne($sql){
		$res = $this->query($sql);
		if ($res)
			return $this->get_next($res);
		return false;
	}	
	public function get_size($source){
		$count = new DataRequestConfig($source);
		
		$count->set_fieldset("COUNT(*) as DHX_COUNT ");
		$count->set_sort(null);
		$count->set_limit(0,0);
		
		$res=$this->select($count);
		$data=$this->get_next($res);
		if (array_key_exists("DHX_COUNT",$data)) return $data["DHX_COUNT"];
		else return $data["dhx_count"]; //postgresql
	}
	public function get_variants($name,$source){
		$count = new DataRequestConfig($source);
		$count->set_fieldset("DISTINCT ".$this->escape_name($name)." as value");
		$sort = new SortInterface($source);
		$count->set_sort(null);
		for ($i = 0; $i < count($sort->rules); $i++) {
			if ($sort->rules[$i]['name'] == $name)
				$count->set_sort($sort->rules[$i]['name'], $sort->rules[$i]['direction']);
		}
		$count->set_limit(0,0);
		return $this->select($count);
	}
	
	public function sequence($sec){
		$this->sequence=$sec;
	}
	
	
	/*! create an sql string for filtering rules
		
		@param rules 
			set of filtering rules
		@param relation
			name of relation id field
		@return 
			sql string with filtering rules
	*/
	protected function build_where($rules,$relation=false){
		$sql=array();
		for ($i=0; $i < sizeof($rules); $i++)
			if (is_string($rules[$i]))
				array_push($sql,"(".$rules[$i].")");
			else {
				$filtervalue = $rules[$i]["value"];
				$filteroperation = $rules[$i]["operation"];
				if ($filtervalue!=""){
					if (!$filteroperation)
						array_push($sql,$this->escape_name($rules[$i]["name"])." LIKE '%".$this->escape($filtervalue)."%'");
					else {
						if ($filteroperation != "IN") 
							$filtervalue = "'".$this->escape($filtervalue)."'";

						array_push($sql,$this->escape_name($rules[$i]["name"])." ".$filteroperation." ".$filtervalue);
					}
				}
			}

		if ($relation !== false && $relation !== ""){
			$relsql = $this->escape_name($this->config->relation_id["db_name"])." = '".$this->escape($relation)."'";
			if ($relation == "0")
				$relsql = "( ".$relsql." OR ".$this->escape_name($this->config->relation_id["db_name"])." IS NULL )";

			array_push($sql,$relsql);
		}
		return implode(" AND ",$sql);
	}	
	/*! convert sorting rules to sql string
		
		@param by 
			set of sorting rules
		@return 
			sql string for set of sorting rules
	*/
	protected function build_order($by){
		if (!sizeof($by)) return "";
		$out = array();
		for ($i=0; $i < sizeof($by); $i++)
			if (is_string($by[$i]))
				$out[] = $by[$i];
			else if ($by[$i]["name"])
				$out[]=$this->escape_name($by[$i]["name"])." ".$by[$i]["direction"];
		return implode(",",$out);
	}	
	
	/*! generates sql code for select operation
		
		@param select 
			list of fields in select
		@param from 
			table name
		@param where
			list of filtering rules
		@param sort
			list of sorting rules
		@param start
			start index of fetching
		@param count 
			count of records to fetch
		@return 
			sql string for select operation
	*/
	protected function select_query($select,$from,$where,$sort,$start,$count){
		if (!$from)
			return $select;
			
		$sql="SELECT ".$select." FROM ".$from;
		if ($where) $sql.=" WHERE ".$where;
		if ($sort) $sql.=" ORDER BY ".$sort;
		if ($start || $count) $sql.=" LIMIT ".$start.",".$count;
		return $sql;
	}
	/*! generates update sql
		
		@param data
			DataAction object
		@param request
			DataRequestConfig object
		@return 
			sql string, which updates record with provided data
	*/
	protected function update_query($data,$request){
		$sql="UPDATE ".$request->get_source()." SET ";
		$temp=array();
		for ($i=0; $i < sizeof($this->config->text); $i++) { 
			$step=$this->config->text[$i];
			
			if ($data->get_value($step["name"])===Null)
				$step_value ="Null";
			else
				$step_value = "'".$this->escape($data->get_value($step["name"]))."'";
			$temp[$i]= $this->escape_name($step["db_name"])."=". $step_value;
		}
		if ($relation = $this->config->relation_id["db_name"]){
			$temp[]= $this->escape_name($relation)."='".$this->escape($data->get_value($relation))."'";
		}
		$sql.=implode(",",$temp)." WHERE ".$this->escape_name($this->config->id["db_name"])."='".$this->escape($data->get_id())."'";
		
		//if we have limited set - set constraints
		$where=$this->build_where($request->get_filters());
		if ($where) $sql.=" AND (".$where.")";
		
		return $sql;
	}
	
	/*! generates delete sql
		
		@param data
			DataAction object
		@param request
			DataRequestConfig object
		@return 
			sql string, which delete record 
	*/
	protected function delete_query($data,$request){
		$sql="DELETE FROM ".$request->get_source();
		$sql.=" WHERE ".$this->escape_name($this->config->id["db_name"])."='".$this->escape($data->get_id())."'";
		
		//if we have limited set - set constraints
		$where=$this->build_where($request->get_filters());
		if ($where) $sql.=" AND (".$where.")";
		
		return $sql;
	}
	
	/*! generates insert sql
		
		@param data
			DataAction object
		@param request
			DataRequestConfig object
		@return 
			sql string, which inserts new record with provided data
	*/
	protected function insert_query($data,$request){
		$temp_n=array(); 
		$temp_v=array(); 
		foreach($this->config->text as $k => $v){
			$temp_n[$k]=$this->escape_name($v["db_name"]);
			if ($data->get_value($v["name"])===Null)
				$temp_v[$k]="Null";
			else
			$temp_v[$k]="'".$this->escape($data->get_value($v["name"]))."'";
		}
		if ($relation = $this->config->relation_id["db_name"]){
			$temp_n[]=$this->escape_name($relation);
			$temp_v[]="'".$this->escape($data->get_value($relation))."'";
		}
		if ($this->sequence){
			$temp_n[]=$this->escape_name($this->config->id["db_name"]);
			$temp_v[]=$this->sequence;
		}
		
		$sql="INSERT INTO ".$request->get_source()."(".implode(",",$temp_n).") VALUES (".implode(",",$temp_v).")";
		
		return $sql;
	}	
	
	/*! sets the transaction mode, used by dataprocessor
		
		@param mode 
			mode name
	*/
	public function set_transaction_mode($mode){
		if ($mode!="none" && $mode!="global" && $mode!="record") 
			throw new Exception("Unknown transaction mode");
		$this->transaction=$mode;
	}
	/*! returns true if global transaction mode was specified
		@return 
			true if global transaction mode was specified
	*/
	public function is_global_transaction(){
		return $this->transaction == "global";
	}
	/*! returns true if record transaction mode was specified
		@return 
			true if record transaction mode was specified
	*/	
	public function is_record_transaction(){
		return $this->transaction == "record";
	}
	
		
	public function begin_transaction(){
		$this->query("BEGIN");
	}
	public function commit_transaction(){
		$this->query("COMMIT");
	}
	public function rollback_transaction(){
		$this->query("ROLLBACK");
	}	
	
	/*! exec sql string
		
		@param sql 
			sql string
		@return 
			sql result set
	*/
	abstract public function query($sql);
	/*! returns next record from result set
		
		@param res 
			sql result set
		@return 
			hash of data
	*/
	abstract public function get_next($res);
	/*! returns new id value, for newly inserted row
		@return 
			new id value, for newly inserted row
	*/
	abstract public function get_new_id();
	/*! escape data to prevent sql injections
		@param data 
			unescaped data
		@return 
			escaped data
	*/
	abstract public function escape($data);			
	
	/*! escape field name to prevent sql reserved words conflict
		@param data 
			unescaped data
		@return 
			escaped data
	*/
	public function escape_name($data){
		return $data;
	}
	
	/*! get list of tables in the database
		
		@return 
			array of table names
	*/
	public function tables_list() {
		throw new Exception("Not implemented");
	}

	/*! returns list of fields for the table in question
		
		@param table 
			name of table in question
		@return 
			array of field names
	*/
	public function fields_list($table) {
		throw new Exception("Not implemented");
	}
	
}

class ArrayDBDataWrapper extends DBDataWrapper{
	public function get_next($res){
		if ($res->index < sizeof($res->data))
		return $res->data[$res->index++];
	}
	public function select($sql){
		if ($this->config->relation_id["db_name"] == "") {
            if ($sql->get_relation() == "0" || $sql->get_relation() == "") {
                return new ArrayQueryWrapper($this->connection);
            } else {
                return new ArrayQueryWrapper(array());
            }
        }

		$relation_id = $this->config->relation_id["db_name"];
		$result = array();

        for ($i = 0; $i < count($this->connection); $i++) {
            $item = $this->connection[$i];
            if (!isset($item[$relation_id])) continue;
            if ($item[$relation_id] == $sql->get_relation())
                $result[] = $item;

        }

		return new ArrayQueryWrapper($result);
	}
	public function query($sql){
		throw new Exception("Not implemented");
	}
	public function escape($value){
		throw new Exception("Not implemented");
	}
	public function get_new_id(){
		throw new Exception("Not implemented");
	}
}

class ArrayQueryWrapper{
	public function __construct($data){
		$this->data = $data;
		$this->index = 0;
	}
}
/*! Implementation of DataWrapper for MySQL
**/
class MySQLDBDataWrapper extends DBDataWrapper{
	protected $last_result;
	public function query($sql){
		LogMaster::log($sql);
		$res=mysql_query($sql,$this->connection);
		if ($res===false) throw new Exception("MySQL operation failed\n".mysql_error($this->connection));
		$this->last_result = $res;
		return $res;
	}
	
	public function get_next($res){
		if (!$res)
			$res = $this->last_result;
			
		return mysql_fetch_assoc($res);
	}
	
	public function get_new_id(){
		return mysql_insert_id($this->connection);
	}
	
	public function escape($data){
		return mysql_real_escape_string($data, $this->connection);
	}

	public function tables_list() {
		$result = mysql_query("SHOW TABLES");
		if ($result===false) throw new Exception("MySQL operation failed\n".mysql_error($this->connection));

		$tables = array();
		while ($table = mysql_fetch_array($result)) {
			$tables[] = $table[0];
		}
		return $tables;
	}

	public function fields_list($table) {
		$result = mysql_query("SHOW COLUMNS FROM `".$table."`");
		if ($result===false) throw new Exception("MySQL operation failed\n".mysql_error($this->connection));

		$fields = array();
        $id = "";
		while ($field = mysql_fetch_assoc($result)) {
			if ($field['Key'] == "PRI")
				$id = $field["Field"];
            else
			    $fields[] = $field["Field"];
		}
		return array("fields" => $fields, "key" => $id );
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
}
?>