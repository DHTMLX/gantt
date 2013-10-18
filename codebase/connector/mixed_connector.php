<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");

class MixedConnector extends Connector {

	protected $connectors = array();

	public function add($name, $conn) {
		$this->connectors[$name] = $conn;
	}

	public function render() {
		$result = "{";
		$parts = array();
		foreach($this->connectors as $name => $conn) {
			$conn->asString(true);
			$parts[] = "\"".$name."\":".($conn->render())."\n";
		}
		$result .= implode(",\n", $parts)."}";
		echo $result;
	}
}

?>