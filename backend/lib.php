<?php
$LISTA_MOV_LIMIT = 50;
$LISTA_SUBCTA_INIT_LIMIT = 3;


function conectaBD(){

    $mysqli = new mysqli('localhost', 'root', '', 'go_expense');
    
   
    if ($mysqli->connect_errno) {
   
        echo "Lo sentimos, este sitio web está experimentando problemas.";
   
        echo "Error: Fallo al conectarse a MySQL debido a: \n";
        echo "Errno: " . $mysqli->connect_errno . "\n";
        echo "Error: " . $mysqli->connect_error . "\n";
           
        exit;
    }

    return $mysqli;
}

/**
* Recuperas todas las cuentas de banco
*
*/
function getCuentasBanco(){
    $bd= conectaBD();

	$query = "SELECT ID_CUENTA_BANCO, ID_EMPRESA, NOMBRE, SALDO, DESCRIPCION, ESTATUS ";
	$query.= "FROM CUENTA_BANCO ";
	$query.= "WHERE ESTATUS = 1 ";
	



    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$data = array(	"idCuentaBanco"=>$line["ID_CUENTA_BANCO"],
						"idEmpresa"=>$line["ID_EMPRESA"],
						"nombre"=>$line["NOMBRE"],
						"descripcion"=>$line["DESCRIPCION"],
						"saldo"=>$line["SALDO"],
						"estatus"=>$line["ESTATUS"]						
					  );
		
		
        array_push($salida, $data);        
    }
    
    
    $result->free();
    $bd->close();
	
    return $salida;
	
	
}


/**
* Recuperas todas las SUBcuentas de banco
*
*/
function getSubCuentasBanco($idCuentaBanco){
    $bd= conectaBD();
	
	//echo "salida====".$idCuentaBanco;
	
	$query = "SELECT ID_SUBCUENTA, ID_EMPRESA, CUENTA_EJE, NOMBRE, SALDO, SALDO_RETENIDO, SALDO_DISPONIBLE, DESCRIPCION, ESTATUS ";
	$query.= "FROM SUBCUENTA ";
	$query.= "WHERE ESTATUS = 1 ";
	
	if($idCuentaBanco > 0 ){
		$query.= " AND CUENTA_EJE = ".$idCuentaBanco." ";
	}
	
	//~Solo aplica para la pantalla de inicio
	if($idCuentaBanco == -1 ){
		$query.= " ORDER BY RATING LIMIT 10"; 
	}

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$data = array(	"idSubCuenta"=>$line["ID_SUBCUENTA"],
						"idEmpresa"=>$line["ID_EMPRESA"],
						"cuentaEje"=>$line["CUENTA_EJE"],
						"nombre"=>$line["NOMBRE"],
						"descripcion"=>$line["DESCRIPCION"],
						"saldo"=>$line["SALDO"],
						"saldoRetenido"=>$line["SALDO_RETENIDO"],
						"saldoDisponible"=>$line["SALDO_DISPONIBLE"],
						"estatus"=>$line["ESTATUS"]						
					  );
		
		
        array_push($salida, $data);        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;
	
	
}

function registraMovimiento($mov){
    $bd= conectaBD();
	
	$idEmpresa = $mov['idEmpresa'];
	$uuid = $mov["uuid"];
	$idCuenta = $mov["idCuenta"];
	$tipoCuenta = $mov["tipoCuenta"];
	$concepto = $mov["concepto"];
	$naturaleza = $mov["naturaleza"];
	$monto = $mov["monto"];
	$fechaAplicacion = $mov["fechaAplicacion"];
	$nota = $mov["nota"];
	$idMedioAcceso = $mov["idMedioAcceso"];
	$operacionRetieneSaldoMA= $mov["operacionRetieneSaldoMA"];
	
	$idMovimiento = 0;
	if(isset($mov["idMovimiento"])){
		$idMovimiento = $mov["idMovimiento"];		
	}		
	
	if($idMovimiento>0){		
		$query = "UPDATE DETALLE_MOVIMIENTO SET ID_USUARIO = (SELECT ID_USUARIO FROM USUARIO WHERE UUID='".$uuid."'), ";
		$query.= "CONCEPTO = '".$concepto."', NATURALEZA = '".$naturaleza."', MONTO = '".$monto."', NOTA = '".$nota."' WHERE ID_MOVIMIENTO = ".$idMovimiento;
		
		if(!$result = $bd->query($query)){       
			error_log ("Lo sentimos, este sitio web está experimentando problemas.");    
			error_log ("Error: La ejecución de la consulta falló debido a: \n");
			error_log ("Query: " . $query . "\n");
			error_log ("Errno: " . $bd->errno . "\n");
			error_log ("Error: " . $bd->error . "\n");
			
		}    			
	}else{
		
		//~Calcula estatus
		$estatus = "A";

		//La retencion solo aplica para CARGOS
		if($operacionRetieneSaldoMA && $naturaleza=="C"){
			$estatus = "R";
			$nota = "[RETENIDO] ".$nota;
		}
		
		$query = "INSERT INTO DETALLE_MOVIMIENTO (ID_MOVIMIENTO, ID_EMPRESA, ID_USUARIO, ID_CUENTA, ID_MEDIO_ACCESO, CONCEPTO, TIPO_CUENTA, NATURALEZA, FECHA_APLICACION, MONTO, FECHA_REG, ESTATUS, NOTA) ";
		$query.= "VALUES ('0', '".$idEmpresa."', (SELECT ID_USUARIO FROM USUARIO WHERE UUID='".$uuid."'), '".$idCuenta."', '".$idMedioAcceso."', '".$concepto."', '".$tipoCuenta."', '".$naturaleza."', '".$fechaAplicacion."', '".$monto."', NOW(), '".$estatus."', '".$nota."')";
			
			
		if(!$result = $bd->query($query)){       
			error_log ("Lo sentimos, este sitio web está experimentando problemas.");    
			error_log ("Error: La ejecución de la consulta falló debido a: \n");
			error_log ("Query: " . $query . "\n");
			error_log ("Errno: " . $bd->errno . "\n");
			error_log ("Error: " . $bd->error . "\n");
		}	
			
		//$result = $bd->query($query);    	
		$idMovimiento = $bd->insert_id;
	
	}

    $bd->close();
	
	return $idMovimiento;
}


/**
* Recupera el saldo de la cuenta
* Tipo Cuenta = CTA | SUBCTA
**/
function getSaldoCuenta($id, $tipoCuenta, $idMovimiento){
    $bd= conectaBD();
	
	//~En caso de ser edicion se obtiene el saldo de los movimientos sin contemplar el que se edita
	if($idMovimiento>0){
		$query = "	SELECT SUM(IF(DT.NATURALEZA='C',DT.MONTO*-1, DT.MONTO)) SALDO
					FROM DETALLE_MOVIMIENTO DT
					WHERE DT.ID_CUENTA = ".$id."
					AND DT.ID_EMPRESA = 'evert.nicolas@gmail.com'
					AND ESTATUS = 'A'
					AND DT.ID_MOVIMIENTO <> ".$idMovimiento;
	}else{
	
		//~Se busca el saldo de la cuenta o subcuenta
		if($tipoCuenta=="CTA"){		
			$query = "SELECT 0 SALDO_DISPONIBLE, SALDO, SALDO_RETENIDO FROM CUENTA_BANCO WHERE ID_CUENTA_BANCO = $id ";
		}else{	
			$query = "SELECT SALDO_DISPONIBLE, SALDO, SALDO_RETENIDO FROM SUBCUENTA WHERE ID_SUBCUENTA = $id ";		
		}
	
	}

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }
	
	$salida = 0;	
    
    while ($line = $result->fetch_assoc()) {

			$salida = array(	"saldo"=>$line["SALDO"],						
								"saldoDisponible"=>$line["SALDO_DISPONIBLE"],
								"saldoRetenido"=>$line["SALDO_RETENIDO"]
							  );
		
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;		
}

/**
*Actualiza directamente el saldo de la cuenta
**/
function actualizaSaldoCuentaDuro($id, $tipoCuenta, $saldo, $saldoRetenido, $saldoDisponible){
    $bd= conectaBD();		
	
	if($tipoCuenta=="CTA"){
		$query = "UPDATE CUENTA_BANCO  SET SALDO='$saldo', SALDO_RETENIDO='$saldoRetenido' WHERE ID_CUENTA_BANCO = $id ";
	}else{	
		$query = "UPDATE SUBCUENTA SET SALDO='$saldo', SALDO_DISPONIBLE='$saldoDisponible', SALDO_RETENIDO='$saldoRetenido' WHERE ID_SUBCUENTA = $id ";		
	}
	
	
    $result = $bd->query($query);    	
	
    $bd->close();
	
	return $result;
}

/**
* Recupera los ultimos N registros de movimientos aplicados por cuenta
**/
function getLastMovimientos($idCuenta, $nRegMostrar){
	$bd= conectaBD();
	
	
	$query = "SELECT DT.ID_MOVIMIENTO, DT.ID_EMPRESA, DT.ID_USUARIO, U.NOMBRE USUARIO, U.UUID, DT.ID_CUENTA, DT.CONCEPTO, DT.TIPO_CUENTA, DT.NATURALEZA, DATE_FORMAT(DT.FECHA_APLICACION, '%d/%m/%Y') FECHA_APLICACION, IF(DT.NATURALEZA='C',DT.MONTO*-1, DT.MONTO) MONTO, DATE_FORMAT(DT.FECHA_REG, '%d/%m/%Y') FECHA_REG, DT.ESTATUS, DT.NOTA ";
	$query.= "FROM DETALLE_MOVIMIENTO DT, USUARIO U  ";
	$query.= "WHERE DT.ID_USUARIO = U.ID_USUARIO ";
	$query.= "AND DT.ESTATUS IN ('A','R') AND DT.ID_CUENTA = ".$idCuenta." ";
	$query.= "ORDER BY DT.ID_MOVIMIENTO DESC LIMIT ".$nRegMostrar;


    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$data = array(	"idMovimiento"=>$line["ID_MOVIMIENTO"],						
						"idEmpresa"=>$line["ID_EMPRESA"],
						"idUsuario"=>$line["ID_USUARIO"],
						"usuario"=>$line["USUARIO"],
						"uuid"=>$line["UUID"],
						"idCuenta"=>$line["ID_CUENTA"],
						"concepto"=>$line["CONCEPTO"],
						"tipoCuenta"=>$line["TIPO_CUENTA"],
						"naturaleza"=>$line["NATURALEZA"],
						"fechaAplicacion"=>$line["FECHA_APLICACION"],
						"monto"=>$line["MONTO"],
						"fechaReg"=>$line["FECHA_REG"],
						"estatus"=>$line["ESTATUS"],
						"nota"=>$line["NOTA"]
					  );
		
		
        array_push($salida, $data);        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;
}

/**
* Muestra los movimientos retenidos y pendientes de pagar
**/
function getMovimientosRetenidos($idMedioAcceso){

	


	$bd= conectaBD();
	
	
	$query = "SELECT DT.ID_MOVIMIENTO, DT.ID_EMPRESA, DT.ID_USUARIO, U.NOMBRE USUARIO, U.UUID, DT.ID_CUENTA, DT.CONCEPTO, DT.TIPO_CUENTA, DT.NATURALEZA, DATE_FORMAT(DT.FECHA_APLICACION, '%d/%m/%Y') FECHA_APLICACION, IF(DT.NATURALEZA='C',DT.MONTO*-1, DT.MONTO) MONTO, DATE_FORMAT(DT.FECHA_REG, '%d/%m/%Y') FECHA_REG, DT.ESTATUS, DT.NOTA, ";
	$query.= "CASE  ";
	$query.= "WHEN DT.TIPO_CUENTA='CTA' THEN (SELECT C.NOMBRE FROM CUENTA_BANCO C WHERE C.ID_CUENTA_BANCO = DT.ID_CUENTA)  ";
	$query.= "ELSE (SELECT C.NOMBRE FROM SUBCUENTA C WHERE C.ID_SUBCUENTA = DT.ID_CUENTA)  ";
	$query.= "END NOMBRE_CUENTA   ";
	$query.= "FROM DETALLE_MOVIMIENTO DT, USUARIO U  ";
	$query.= "WHERE DT.ID_USUARIO = U.ID_USUARIO ";
	$query.= "AND DT.ESTATUS = 'R' AND DT.ID_MEDIO_ACCESO = $idMedioAcceso ";
	$query.= "ORDER BY DT.ID_MOVIMIENTO DESC ";



    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
	$subTotal = 0;
    
    while ($line = $result->fetch_assoc()) {
		$data = array(	"idMovimiento"=>$line["ID_MOVIMIENTO"],						
						"idEmpresa"=>$line["ID_EMPRESA"],
						"idUsuario"=>$line["ID_USUARIO"],
						"usuario"=>$line["USUARIO"],
						"uuid"=>$line["UUID"],
						"idCuenta"=>$line["ID_CUENTA"],
						"concepto"=>$line["CONCEPTO"],
						"tipoCuenta"=>$line["TIPO_CUENTA"],
						"nombreCuenta"=>$line["NOMBRE_CUENTA"],
						"naturaleza"=>$line["NATURALEZA"],
						"fechaAplicacion"=>$line["FECHA_APLICACION"],
						"monto"=>$line["MONTO"],
						"fechaReg"=>$line["FECHA_REG"],
						"estatus"=>$line["ESTATUS"],
						"nota"=>$line["NOTA"]
					  );
		
		$subTotal= $subTotal + $line["MONTO"];
		
        array_push($salida, $data);        
    }
    					
    
    $result->free();
    $bd->close();
	
	$arrSalida = array(
		"movimientos" => $salida,
		"subTotal" => $subTotal
	);
	
    return $arrSalida;
}


/**
*Actualiza el saldo de la cuenta concentradora cuando una de sus subcuentas aplica un movimiento
**/
function actualizaSaldoCuentaConcentradora($idSubCuenta){
    $bd= conectaBD();
	
	
$query = "	UPDATE CUENTA_BANCO
			SET SALDO = (
				SELECT SUM(SALDO_DISPONIBLE) FROM SUBCUENTA
				WHERE ID_EMPRESA = 'evert.nicolas@gmail.com'
				AND CUENTA_EJE IN (
				SELECT CUENTA_EJE FROM SUBCUENTA
				WHERE ID_SUBCUENTA = ".$idSubCuenta."
				AND ID_EMPRESA = 'evert.nicolas@gmail.com'
				)
			) + SALDO_RETENIDO
			WHERE ID_EMPRESA = 'evert.nicolas@gmail.com'
			AND ID_CUENTA_BANCO = (SELECT CUENTA_EJE FROM SUBCUENTA WHERE ID_SUBCUENTA = ".$idSubCuenta." AND ID_EMPRESA = 'evert.nicolas@gmail.com')";
	
	
    $result = $bd->query($query);    	
	
    $bd->close();
	
	return $result;
}


/**
*Tipo Cuenta = CTA | SUBCTA
**/
function actualizaRatingSubcta($id, $tipoCuenta){
    $bd= conectaBD();
	
	
	if($tipoCuenta=="SUBCTA"){
		$query = "UPDATE SUBCUENTA SET RATING= RATING + 1 WHERE ID_SUBCUENTA = $id ";		
	}
	
	
	
	
    $result = $bd->query($query);    	
	
    $bd->close();
	
	return $result;
}	


function getUsuariosByEmpresa($idEmpresa){
    $bd= conectaBD();

	
	$query = "SELECT ID_USUARIO, NOMBRE, UUID FROM USUARIO WHERE ID_EMPRESA = '".$idEmpresa."' ";	
		

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$data = array(	"idUsuario"=>$line["ID_USUARIO"],
						"nombre"=>$line["NOMBRE"],
						"uuid"=>$line["UUID"]
					  );
		
		
        array_push($salida, $data);        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;		
}

/**
*
*/
function registraUUIDusuario($idUsuario, $uuid){
    $bd= conectaBD();
			
	$query = "UPDATE USUARIO SET UUID= '".$uuid."' WHERE ID_USUARIO = $idUsuario ";		
	
	
    $result = $bd->query($query);    	
	
    $bd->close();
	
	return $result;
}

function getListaMediosAcceso($idEmpresa){
    $bd= conectaBD();


	$query = "SELECT ID_MEDIO_ACCESO, NOMBRE, PREFIJO ";
	$query.= "FROM MEDIO_ACCESO ";
	$query.= "WHERE ID_EMPRESA = '$idEmpresa' ";
	$query.= "AND ESTATUS = 1 ";
		

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$data = array(	"idMedioAcceso"=>$line["ID_MEDIO_ACCESO"],
						"nombre"=>$line["NOMBRE"],
						"prefijo"=>$line["PREFIJO"]
					  );
		
		
        array_push($salida, $data);        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;		
}

function getMedioAcceso($idMedioAcceso){
    $bd= conectaBD();


	$query = "SELECT ID_MEDIO_ACCESO, NOMBRE, PREFIJO, RETIENE_SALDO ";
	$query.= "FROM MEDIO_ACCESO ";
	$query.= "WHERE ID_MEDIO_ACCESO = '$idMedioAcceso' ";
	$query.= "AND ESTATUS = 1 ";
		

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$salida = array(	"idMedioAcceso"=>$line["ID_MEDIO_ACCESO"],
							"nombre"=>$line["NOMBRE"],
							"prefijo"=>$line["PREFIJO"],
							"retieneSaldo"=>($line["RETIENE_SALDO"]==1)?true:false
						  );				        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;		
}

function getSaldosArrastre($idCuenta){
    $bd= conectaBD();


	$query = "SELECT 	SUM(IF(DT.NATURALEZA='C',DT.MONTO*-1, DT.MONTO)) MONTO, ";
	$query.= "        ESTATUS ";
	$query.= "FROM DETALLE_MOVIMIENTO DT ";
	$query.= "WHERE ID_CUENTA = $idCuenta ";
	$query.= "GROUP BY ESTATUS ";

		

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array("A"=>0,"R"=>0,"C"=>0);
    
    while ($line = $result->fetch_assoc()) {
		if($line["ESTATUS"]=="A"){
			$salida["A"] = $line["MONTO"];
		}else if($line["ESTATUS"]=="R"){
			$salida["R"] = $line["MONTO"];
		}if($line["ESTATUS"]=="C"){
			$salida["C"] = $line["MONTO"];
		}			        
    }
    
    $result->free();
    $bd->close();
	
    return $salida;		
}

/**
 * Recupera un arreglo asociativo con el nombre de las cuentas existentes
 * 
 */
function getArrayNombreCuenta($tipoCuenta){
    $bd= conectaBD();


	if($tipoCuenta=="CTA"){

		$query = "SSELECT ID_CUENTA_BANCO ID, NOMBRE FROM CUENTA_BANCO ";
		$query.= "WHERE ID_EMPRESA = 'evert.nicolas@gmail.com' ";
		$query.= "AND ESTATUS = 1 ";

	}else{
		$query = "SSELECT ID_SUBCUENTA ID, NOMBRE FROM SUBCUENTA ";
		$query.= "WHERE ID_EMPRESA = 'evert.nicolas@gmail.com' ";
		$query.= "AND ESTATUS = 1 ";
	}


		

    if(!$result = $bd->query($query)){       
        echo "Lo sentimos, este sitio web está experimentando problemas.";    
        echo "Error: La ejecución de la consulta falló debido a: \n";
        echo "Query: " . $query . "\n";
        echo "Errno: " . $bd->errno . "\n";
        echo "Error: " . $bd->error . "\n";
        exit;
    }

    $salida = array();
    
    while ($line = $result->fetch_assoc()) {
		$salida[$line["ID"]] = $line["NOMBRE"];				        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;		
}


function activaMovimientoRetenido($listaIdMovimiento){
    $bd= conectaBD();
			
	$query = "UPDATE DETALLE_MOVIMIENTO SET ESTATUS= 'A', NOTA=REPLACE(NOTA,'[RETENIDO]',CONCAT('[LIBERADO ',DATE_FORMAT(NOW(), '%d.%m.%Y'),']')) WHERE ID_MOVIMIENTO IN ($listaIdMovimiento) ";
	
	
	//SELECT NOTA, REPLACE(NOTA,'[RETENIDO]',CONCAT('[LIBERADO ',DATE_FORMAT(NOW(), '%d.%m.%Y'),']')) FROM `detalle_movimiento` WHERE ID_MOVIMIENTO = 157

    $result = $bd->query($query);    	
	
    $bd->close();
	
	return $result;
}
?>