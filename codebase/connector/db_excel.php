<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once('db_common.php');

if (!defined('DHX_IGNORE_EMPTY_ROWS')) {
	define('DHX_IGNORE_EMPTY_ROWS', true);
}

class ExcelDBDataWrapper extends DBDataWrapper {
	
	public $emptyLimit = 10;
	public function excel_data($points){
		$path = $this->connection;
		$excel = PHPExcel_IOFactory::createReaderForFile($path);
		$excel = $excel->load($path);
		$result = array();
		$excelWS = $excel->getActiveSheet();
		
		for ($i=0; $i < sizeof($points); $i++) { 
			$c = array();
			preg_match("/^([a-zA-Z]+)(\d+)/", $points[$i], $c);
			if (count($c) > 0) {
				$col = PHPExcel_Cell::columnIndexFromString($c[1]) - 1;
				$cell = $excelWS->getCellByColumnAndRow($col, (int)$c[2]);
				$result[] = $cell->getValue();
			}
		}
		
		return $result;
	}
	public function select($source) {
		$path = $this->connection;
		$excel = PHPExcel_IOFactory::createReaderForFile($path);
		$excel->setReadDataOnly(false);
		$excel = $excel->load($path);
		$excRes = new ExcelResult();
		$excelWS = $excel->getActiveSheet();
		$addFields = true;

		$coords = array();
		if ($source->get_source() == '*') {
			$coords['start_row'] = 0;
			$coords['end_row'] = false;
		} else {
			$c = array();
			preg_match("/^([a-zA-Z]+)(\d+)/", $source->get_source(), $c);
			if (count($c) > 0) {
				$coords['start_row'] = (int) $c[2];
			} else {
				$coords['start_row'] = 0;
			}
			$c = array();
			preg_match("/:(.+)(\d+)$/U", $source->get_source(), $c);
			if (count($c) > 0) {
				$coords['end_row'] = (int) $c[2];
			} else {
				$coords['end_row'] = false;
			}
		}

		$i = $coords['start_row'];
		$end = 0;
		while ((($coords['end_row'] == false)&&($end < $this->emptyLimit))||(($coords['end_row'] !== false)&&($i < $coords['end_row']))) {
			$r = Array();
			$emptyNum = 0;
			for ($j = 0; $j < count($this->config->text); $j++) {
				$col = PHPExcel_Cell::columnIndexFromString($this->config->text[$j]['name']) - 1;
				$cell = $excelWS->getCellByColumnAndRow($col, $i);
				if (PHPExcel_Shared_Date::isDateTime($cell)) {
					$r[PHPExcel_Cell::stringFromColumnIndex($col)] = PHPExcel_Shared_Date::ExcelToPHP($cell->getValue());
				}  else if ($cell->getDataType() == 'f') {
					$r[PHPExcel_Cell::stringFromColumnIndex($col)] = $cell->getCalculatedValue();
				} else {
					$r[PHPExcel_Cell::stringFromColumnIndex($col)] = $cell->getValue();
				}
				if ($r[PHPExcel_Cell::stringFromColumnIndex($col)] == '') {
					$emptyNum++;
				}
			}
			if ($emptyNum < count($this->config->text)) {
				$r['id'] = $i;
				$excRes->addRecord($r);
				$end = 0;
			} else {
				if (DHX_IGNORE_EMPTY_ROWS == false) {
					$r['id'] = $i;
					$excRes->addRecord($r);
				}
				$end++;
			}
			$i++;
		}
		return $excRes;
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


class ExcelResult {
	private $rows;
	private $currentRecord = 0;


	// add record to output list
	public function addRecord($file) {
		$this->rows[] = $file;
	}


	// return next record
	public function next() {
		if ($this->currentRecord < count($this->rows)) {
			$row = $this->rows[$this->currentRecord];
			$this->currentRecord++;
			return $row;
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


?>