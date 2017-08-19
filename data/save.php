<?php
include("conn.php");
$data = json_decode(file_get_contents("php://input"));
$currDate = date('m/d/Y');
$sqlInsertQuery = "insert into tasks (`userid`, `task`, `description`, `created_at`, `due_date`) values ($data->userId, '$data->title','$data->description','$currDate','$data->due_date')";

if(mysqli_query($link,$sqlInsertQuery))
{
	echo true;
} else {
	echo false;
}
?>