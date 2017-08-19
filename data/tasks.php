<?php
include("conn.php");
$data = json_decode(file_get_contents("php://input"));
$sel  = mysqli_query($link,"select * from tasks WHERE userid=".$data->userId);
$fRows = array();
while($arr=mysqli_fetch_assoc($sel))
{
	$fRows[]=$arr;
}
echo json_encode($fRows);
?>