<?php
include("conn.php");
$data = json_decode(file_get_contents("php://input"));

$sql = "UPDATE tasks SET status = 1 WHERE id = $data->taskId";
if (mysqli_query($link, $sql)) {
	echo true;
} else {
	return false;
}
?>