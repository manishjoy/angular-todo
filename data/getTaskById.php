<?php
include("conn.php");
$data = json_decode(file_get_contents("php://input"));

$sql = "SELECT * FROM tasks WHERE id = $data->taskId";
$result = mysqli_query($link, $sql);
$row = mysqli_fetch_array($result,MYSQLI_ASSOC);

$dataToReturn = json_encode($row);

echo $dataToReturn;
?>