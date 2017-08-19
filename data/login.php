<?php
include("conn.php");
$data = json_decode(file_get_contents("php://input"));

$sql = "SELECT userId FROM users WHERE username = '$data->username' and password = '$data->password'";
$result = mysqli_query($link, $sql);
$row = mysqli_fetch_array($result,MYSQLI_ASSOC);
$userId = $row['userId'];
$count = mysqli_num_rows($result);

// If result matched $myusername and $mypassword, table row must be 1 row
$dataToReturn = array();
if($count > 0) {
	$dataToReturn = ['success' => true, 'username' => $data->username, 'userId' => $userId];
}else {
	$dataToReturn = ['success' => false];
}
$dataToReturn = json_encode($dataToReturn);

echo $dataToReturn;
?>