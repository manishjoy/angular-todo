<?php
include("conn.php");
$data = json_decode(file_get_contents("php://input"));
$sql = "UPDATE tasks SET task = '$data->title', description = '$data->description', due_date = '$data->due_date' WHERE id = $data->taskId";
if (mysqli_query($link, $sql)) {
	echo true;
} else {
	return false;
}
?>