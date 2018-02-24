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

if($_GET["do"]=="consultaUsuarios"){		
	$postdata = file_get_contents("php://input");
	if (isset($postdata)) {
		//~Limpia JSON de entrada
		$postdata = str_replace('\"','"',$postdata);
		$postdata = str_replace('"{"','{"',$postdata);
		$postdata = str_replace('"}"','"}',$postdata);
		
		//echo $postdata;
		$request = (array) json_decode($postdata, true);
		
		
		$dataQuery = getUsuariosByEmpresa($request["idEmpresa"]);	
	}
				
}	

if($_GET["do"]=="registraUuid"){
	$postdata = file_get_contents("php://input");
	if (isset($postdata)) {
		//~Limpia JSON de entrada
		$postdata = str_replace('\"','"',$postdata);
		$postdata = str_replace('"{"','{"',$postdata);
		$postdata = str_replace('"}"','"}',$postdata);
		
		//echo $postdata;
		$request = (array) json_decode($postdata, true);
		
		
		registraUUIDusuario($request["idUsuario"], $request["uuid"]);
		$dataQuery = array ("msg"=>"uuid actualizado correctamente");
	}	
	
}
	

$salida = array(
			"exito"=>1,
			"error"=>"",
			"data"=> $dataQuery
			);		

echo json_encode($salida);
?>