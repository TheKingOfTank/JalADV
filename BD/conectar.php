<?php
$usuario="root"; //nombre del usuario  con el que accedes  a  la  bd
$password=""; //contraseña  con la  que accedes  a  la  bd
$servidor="localhost";
$basededatos="hackathon"; // nombre de  la  bd
$conexion=mysqli_connect($servidor,$usuario,$password,$basededatos);
mysqli_query($conexion,"SET NAMES 'utf8'");
mysqli_set_charset($conexion,'utf8');

if(!$conexion){
	echo "no conecta la base de datos";
}
else
{
	//echo "si esta  conectando la bd";
}

?>