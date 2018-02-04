<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

	exit(0);
}
include "lib.php";

$idCuentaBanco= -1;
if(isset($_GET["idCuentaBanco"])){
	$idCuentaBanco= $_GET["idCuentaBanco"];			
}

$dataQuery = getSubCuentasBanco($idCuentaBanco);

/*
$salida = array(
			"exito"=>1,
			"error"=>"",
			"data"=> array(	array('idSubCuenta'=>1,'idEmpresa'=>'evert.nicolas@gmail.com', 'cuentaEje'=>1, 'nombre'=>'PAT', 'descripcion'=>'Patromonial Evert', 'saldo'=>12332, 'estatus'=>1),
							array('idSubCuenta'=>2,'idEmpresa'=>'evert.nicolas@gmail.com', 'cuentaEje'=>1, 'nombre'=>'ALAN', 'descripcion'=>'Pequeño Alan', 'saldo'=>6734, 'estatus'=>1),
							array('idSubCuenta'=>2,'idEmpresa'=>'evert.nicolas@gmail.com', 'cuentaEje'=>2, 'nombre'=>'DENTISTA MEXICANO DE MEXICO', 'descripcion'=>'Cuenta para dentista', 'saldo'=>123, 'estatus'=>1)
						  )
			);
*/
		

$salida = array(
			"exito"=>1,
			"error"=>"",
			"data"=> $dataQuery
			);		

echo json_encode($salida);
?>