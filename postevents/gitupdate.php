<?php
$git_repos = json_decode(file_get_contents("git_repos.json"), true);

if (!empty($_REQUEST['payload'])) {
	$data = json_decode($_REQUEST['payload'], true);
	$repo = $data['repository']['full_name'];
	if (array_key_exists($repo, $git_repos)) {
		$path = $git_repos[$repo]['path'];
		if (array_key_exists('build', $git_repos[$repo])) {
			$build_cmd = $git_repos[$repo]['build'];
		}
	}
	else {
		echo "invalid repository: " . $repo;
		die(1);
	}

	$cmd = "cd " . $path . "; git pull;";

	if (isset($build_cmd)) {
		$cmd = $cmd . " " . $build_cmd . ";";
	}
	
	$output = shell_exec($cmd);
	
	if(is_null($output)) {
		echo "error executing pull";
		http_response_code(500);
		die(1);
	}
	else {
		date_default_timezone_set("America/Los_Angeles");
		echo $output;
		echo "updated " . $repo . " at " . date("F jS Y h:i A");
		die(0);
	}
}
echo "invalid request";
die(1);

?>