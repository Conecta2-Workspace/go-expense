<?php
header("Access-Control-Allow-Origin: *");
include "lib.php";

$dataQuery = getCuentasBanco();


$salida = array(
			"exito"=>1,
			"error"=>"",
			"data"=> array(	array('idCuentaBanco'=>6,'idEmpresa'=>'evert.nicolas@gmail.com', 'nombre'=>'NOBASE3', 'descripcion'=>'', 'saldo'=>32658784, 'estatus'=>1),
							array('idCuentaBanco'=>7,'idEmpresa'=>'evert.nicolas@gmail.com', 'nombre'=>'XXX', 'descripcion'=>'AKJSDHAKSJDH', 'saldo'=>584, 'estatus'=>1)
						  )
			);
//echo json_encode($salida);
//echo "<br>";echo "<br>";

$salida = array(
			"exito"=>1,
			"error"=>"",
			"data"=> $dataQuery
			);			

echo json_encode($salida);
?>