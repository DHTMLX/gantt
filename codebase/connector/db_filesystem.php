<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once('db_common.php');
require_once('tree_connector.php');

/*
Most execution time is a standart functions for workin with FileSystem: is_dir(), dir(), readdir(), stat()
*/

class FileSystemDBDataWrapper extends DBDataWrapper {


	// returns list of files and directories
	public function select($source) {
		$relation = $this->getFileName($source->get_relation());
		// for tree checks relation id and forms absolute path
		if ($relation == '0') {
			$relation = '';
		} else {
			$path = $source->get_source();
		}
		$path = $source->get_source();
		$path = $this->getFileName($path);
		$path = realpath($path);
		if ($path == false) {
			return new FileSystemResult();
		}
		
		if (strpos(realpath($path.'/'.$relation), $path) !== 0) {
			return new FileSystemResult();
		}
		// gets files and directories list
		$res = $this->getFilesList($path, $relation);
		// sorts list
		$res = $res->sort($source->get_sort_by(), $this->config->data);
		return $res;
	}


	// gets files and directory list
	private function getFilesList($path, $relation) {
		$fileSystemTypes = FileSystemTypes::getInstance();
		LogMaster::log("Query filesystem: ".$path);
		$dir = opendir($path.'/'.$relation);
		$result = new FileSystemResult();
		// forms fields list
		for ($i = 0; $i < count($this->config->data); $i++) {
			$fields[] = $this->config->data[$i]['db_name'];
		}
		// for every file and directory of folder
		while ($file = readdir($dir)) {
			// . and .. should not be in output list
			if (($file == '.')||($file == '..')) {
				continue;
			}
			$newFile = array();
			// parse file name as Array('name', 'ext', 'is_dir')
			$fileNameExt = $this->parseFileName($path.'/'.$relation, $file);
			// checks if file should be in output array
			if (!$fileSystemTypes->checkFile($file, $fileNameExt)) {
				continue;
			}
			// takes file stat if it's need
			if ((in_array('size', $fields))||(in_array('date', $fields))) {
				$fileInfo = stat($path.'/'.$file);
			}

			// for every field forms list of fields
			for ($i = 0; $i < count($fields); $i++) {
				$field = $fields[$i];
				switch ($field) {
					case 'filename':
						$newFile['filename'] = $file;
						break;
					case 'full_filename':
						$newFile['full_filename'] = $path."/".$file;
						break;
					case 'size':
						$newFile['size'] = $fileInfo['size'];
						break;
					case 'extention':
						$newFile['extention'] = $fileNameExt['ext'];
						break;
					case 'name':
						$newFile['name'] = $fileNameExt['name'];
						break;
					case 'date':
						$newFile['date'] = date("Y-m-d H:i:s", $fileInfo['ctime']);
						break;
				}
				$newFile['relation_id'] = $relation.'/'.$file;
				$newFile['safe_name'] = $this->setFileName($relation.'/'.$file);
				$newFile['is_folder'] = $fileNameExt['is_dir'];
			}
			// add file in output list
			$result->addFile($newFile);
		}
		return $result;
	}


	// replaces '.' and '_' in id
	private function setFileName($filename) {
		$filename = str_replace(".", "{-dot-}", $filename);
		$filename = str_replace("_", "{-nizh-}", $filename);
		return $filename;
	}

	
	// replaces '{-dot-}' and '{-nizh-}' in id
	private function getFileName($filename) {
		$filename =  str_replace("{-dot-}", ".", $filename);
		$filename = str_replace("{-nizh-}", "_", $filename);
		return $filename;
	}
	

	// parses file name and checks if is directory
	private function parseFileName($path, $file) {
		$result = Array();
		if (is_dir($path.'/'.$file)) {
			$result['name'] = $file;
			$result['ext'] = 'dir';
			$result['is_dir'] = 1;
		} else {
			$pos = strrpos($file, '.');
			$result['name'] = substr($file, 0, $pos);
			$result['ext'] = substr($file, $pos + 1);
			$result['is_dir'] = 0;
		}
		return $result;
	}

	public function query($sql) {
	}

	public function get_new_id() {
	}

	public function escape($data) {
	}	

	public function get_next($res) {
		return $res->next();
	}

}


class FileSystemResult {
	private $files;
	private $currentRecord = 0;


	// add record to output list
	public function addFile($file) {
		$this->files[] = $file;
	}
	
	
	// return next record
	public function next() {
		if ($this->currentRecord < count($this->files)) {
			$file = $this->files[$this->currentRecord];
			$this->currentRecord++;
			return $file;
		} else {
			return false;
		}
	}


	// sorts records under $sort array
	public function sort($sort, $data) {
		if (count($this->files) == 0) {
			return $this;
		}
		// defines fields list if it's need
		for ($i = 0; $i < count($sort); $i++) {
			$fieldname = $sort[$i]['name'];
			if (!isset($this->files[0][$fieldname])) {
				if (isset($data[$fieldname])) {
					$fieldname = $data[$fieldname]['db_name'];
					$sort[$i]['name'] = $fieldname;
				} else {
					$fieldname = false;
				}
			}
		}
		
		// for every sorting field will sort
		for ($i = 0; $i < count($sort); $i++) {
			// if field, setted in sort parameter doesn't exist, continue
			if ($sort[$i]['name'] == false) {
				continue;
			}
			// sorting by current field
			$flag = true;
			while ($flag == true) {
				$flag = false;
				// checks if previous sorting fields are equal
				for ($j = 0; $j < count($this->files) - 1; $j++) {
					$equal = true;
					for ($k = 0; $k < $i; $k++) {
						if ($this->files[$j][$sort[$k]['name']] != $this->files[$j + 1][$sort[$k]['name']]) {
							$equal = false;
						}
					}
					// compares two records in list under current sorting field and sorting direction
					if (((($this->files[$j][$sort[$i]['name']] > $this->files[$j + 1][$sort[$i]['name']])&&($sort[$i]['direction'] == 'ASC'))||(($this->files[$j][$sort[$i]['name']] < $this->files[$j + 1][$sort[$i]['name']])&&($sort[$i]['direction'] == 'DESC')))&&($equal == true)) {
						$c = $this->files[$j];
						$this->files[$j] = $this->files[$j+1];
						$this->files[$j+1] = $c;
						$flag = true;
					}
				}
			}
		}
		return $this;
	}

}


// singleton class for setting file types filter
class FileSystemTypes {

	static private $instance = NULL;
	private $extentions = Array();
	private $extentions_not = Array();
	private $all = true;
	private $patterns = Array();
	// predefined types
	private $types = Array(
		'image' => Array('jpg', 'jpeg', 'gif', 'png', 'tiff', 'bmp', 'psd', 'dir'),
		'document' => Array('txt', 'doc', 'docx', 'xls', 'xlsx', 'rtf', 'dir'),
		'web' => Array('php', 'html', 'htm', 'js', 'css', 'dir'),
		'audio' => Array('mp3', 'wav', 'ogg', 'dir'),
		'video' => Array('avi', 'mpg', 'mpeg', 'mp4', 'dir'),
		'only_dir' => Array('dir')
		);


	static function getInstance() {
		if (self::$instance == NULL) {
			self::$instance = new FileSystemTypes();
		}
		return self::$instance;
	}

	// sets array of extentions
	public function setExtentions($ext) {
		$this->all = false;
		$this->extentions = $ext;
	}

	// adds one extention in array
	public function addExtention($ext) {
		$this->all = false;
		$this->extentions[] = $ext;
	}

	
	// adds one extention which will not ouputed in array
	public function addExtentionNot($ext) {
		$this->extentions_not[] = $ext;
	}
	
	
	// returns array of extentions
	public function getExtentions() {
		return $this->extentions;
	}

	// adds regexp pattern
	public function addPattern($pattern) {
		$this->all = false;
		$this->patterns[] = $pattern;
	}

	// clear extentions array
	public function clearExtentions() {
		$this->all = true;
		$this->extentions = Array();
	}

	// clear regexp patterns array
	public function clearPatterns() {
		$this->all = true;
		$this->patterns = Array();
	}

	// clear all filters
	public function clearAll() {
		$this->clearExtentions();
		$this->clearPatterns();
	}

	// sets predefined type
	public function setType($type, $clear = false) {
		$this->all = false;
		if ($type == 'all') {
			$this->all = true;
			return true;
		}
		if (isset($this->types[$type])) {
			if ($clear) {
				$this->clearExtentions();
			}
			for ($i = 0; $i < count($this->types[$type]); $i++) {
				$this->extentions[] = $this->types[$type][$i];
			}
			return true;
		} else {
			return false;
		}
	}


	// check file under setted filter
	public function checkFile($filename, $fileNameExt) {
		if (in_array($fileNameExt['ext'], $this->extentions_not)) {
			return false;
		}
		if ($this->all) {
			return true;
		}

		if ((count($this->extentions) > 0)&&(!in_array($fileNameExt['ext'], $this->extentions))) {
			return false;
		}

		for ($i = 0; $i < count($this->patterns); $i++) {
			if (!preg_match($this->patterns[$i], $filename)) {
				return false;
			}
		}
		return true;
	}
}

?>