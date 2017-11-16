<?php
$git_paths = json_decode(file_get_contents("git_paths.json"));

if (!empty($_REQUEST['payload'])) {
	$data = json_decode($_REQUEST['payload'], true);
	$repo = $data['repository']['full_name'];
	if (array_key_exists($repo, $git_paths)) {
		$path = $git_paths[$path];
	}
	else {
		echo "invalid repository: " . $repo;
		die(1);
	}
	
	$output = shell_exec("cd " . $path . "; git pull;");
	
	if(is_null($output)) {
		echo "error executing pull";
		http_response_code(500);
		die(1);
	}
	else {
		echo $output;
		echo "updated " . $repo . " at " . time();
		die(0);
	}
}
echo "invalid request";
die(1);

?>