<?php
/*
	@author dhtmlx.com
	@license GPL, see license.txt
*/

class FileTreeDataItem extends TreeDataItem {

	function has_kids(){
		if ($this->data['is_folder'] == '1') {
			return true;
		} else {
			return false;
		}
	}

}

?>