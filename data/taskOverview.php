<?php
include("conn.php");
$dataToReturn = array();
$data = json_decode(file_get_contents("php://input"));
$fetchCompleted = "SELECT COUNT(id) FROM tasks WHERE userid = $data->userId AND status = 1";
$fetchPending = "SELECT COUNT(id) FROM tasks WHERE userid = $data->userId AND status = 0";

$result  = mysqli_query($link, $fetchCompleted);
$row = mysqli_fetch_array($result,MYSQLI_NUM);
$dataToReturn['completed'] = $row[0];

$result  = mysqli_query($link, $fetchPending);
$row = mysqli_fetch_array($result,MYSQLI_NUM);
$dataToReturn['pending'] = $row[0];

$totalNumTasks = $dataToReturn['completed'] + $dataToReturn['pending'];
if($totalNumTasks > 0) {
	$completedPercent = ($dataToReturn['completed'] * 100) / ($dataToReturn['completed'] + $dataToReturn['pending']);
	$dataToReturn['completedPercent'] = number_format((float)$completedPercent, 2, '.', '');
} else {
	$dataToReturn['completedPercent'] = 0;
}
	

echo json_encode($dataToReturn);
?>