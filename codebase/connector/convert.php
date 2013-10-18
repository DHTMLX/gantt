<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/
class ConvertService{
	private $url;
	private $type;
	private $name;
	private $inline;
	
	public function __construct($url){
		$this->url = $url;	
		$this->pdf();
		EventMaster::attach_static("connectorInit",array($this, "handle"));
	}
	public function pdf($name = "data.pdf", $inline = false){
		$this->type = "pdf";
		$this->name = $name;
		$this->inline = $inline;
	}
	public function excel($name = "data.xls", $inline = false){
		$this->type = "excel";
		$this->name = $name;
		$this->inline = $inline;
	}
	public function handle($conn){
		$conn->event->attach("beforeOutput",array($this,"convert"));
	}
	private function as_file($size, $name, $inline){
		header('Content-Type: application/force-download');
		header('Content-Type: application/octet-stream');
		header('Content-Type: application/download');
		header('Content-Transfer-Encoding: binary'); 
		
		header('Content-Length: '.$size);
		if ($inline)
			header('Content-Disposition: inline; filename="'.$name.'";'); 
		else
			header('Content-Disposition: attachment; filename="'.basename($name).'";');
	}	
	public function convert($conn, $out){
		
		$str_out = str_replace("<rows>","<rows profile='color'>", $out);
		$str_out = str_replace("<head>","<head><columns>", $str_out);
		$str_out = str_replace("</head>","</columns></head>", $str_out);

		if ($this->type == "pdf")
			header("Content-type: application/pdf");
		else
			header("Content-type: application/ms-excel");

		$handle = curl_init($this->url);
		curl_setopt($handle, CURLOPT_POST, true);
		curl_setopt($handle, CURLOPT_HEADER, false);
		curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($handle, CURLOPT_POSTFIELDS, "grid_xml=".urlencode($str_out));
		
		
		$out->reset();
		$out->set_type("pdf");
		$out->add(curl_exec($handle));
		$this->as_file(strlen((string)$out), $this->name, $this->inline);
		
		curl_close($handle);
	}
}

?>