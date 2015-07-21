<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
require_once("base_connector.php");

class MixedConnector extends Connector {

    private $_data_type = null;

    function __construct($dataType = "json") {
        $this->_data_type = $dataType;
    }

    protected $attributes = array();
    protected $connectors = array();

    public function add($name, $conn) {
        $this->connectors[$name] = $conn;
        $conn->simple = true;
    }

    public function render() {
        if($this->_data_type == "json")
            $this->render_json();
        else
            $this->render_xml();
    }

    private function render_json() {
        $result = "{";
        $parts = array();
        foreach($this->connectors as $name => $conn) {
            $conn->asString(true);
            $parts[] = "\"".$name."\":".($conn->render())."\n";
        }
        $result .= implode(",\n", $parts)."}";
        echo $result;
    }

    private function render_xml() {
        $result = "";
        $parts = array();

        foreach($this->connectors as $name => $conn) {
            $conn->asString(true);
            $parts[] = "<".$name.">".($conn->render())."</".$name.">\n";
        }
        $result .= implode("", $parts);
        $this->output_as_xml($result);
    }

    protected function output_as_xml($res) {
        echo "<?xml version='1.0' encoding='".$this->encoding."' ?>".$this->xml_start().$res.$this->xml_end();
    }
}

?>