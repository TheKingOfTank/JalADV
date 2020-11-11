<?php
require_once "../BD/conectar.php";
$Nom=$_POST['NomAspirante'];
$APat=$_POST['apPatAsp'];
$AMat=$_POST['apMatAsp'];
$Edo=$_POST['EdoAspirante'];
$Mpio=$_POST['MpioAspirante'];
$Calle=$_POST['ClAspirante'];
$numCa=$_POST['NumCasaAsp'];
$Tel=$_POST['NumTelAsp'];
$FNac=$_POST['FecNac'];
$Correo=$_POST['CorreoAsp'];
$pass=$_POST['ContraseniaAsp'];


$inserta="INSERT INTO Aspirante(NomAspirante,apPatAsp,apMatAsp,EdoAspirante,MpioAspirante,ClAspirante,NumCasaAsp,NumTelAsp,FecNac,CorreoAsp,ContraseniaAsp) VALUES('$Nom','$APat','$AMat','$Edo','$Mpio','$Calle','$numCa','$Tel','$FNac','$Correo','$pass')";
$resultado=mysqli_query($conexion,$inserta);
   echo '<script> window.location="../index.php"; </script>';
mysqli_close($conexion);
?>