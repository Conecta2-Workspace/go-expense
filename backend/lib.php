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
	
	$query = "SELECT ID_SUBCUENTA, ID_EMPRESA, CUENTA_EJE, NOMBRE, SALDO, DESCRIPCION, ESTATUS ";
	$query.= "FROM SUBCUENTA ";
	$query.= "WHERE ESTATUS = 1 ";
	
	if($idCuentaBanco > 0 ){
		$query.= " AND CUENTA_EJE = ".$idCuentaBanco." ";
	}
	
	$query.= " ORDER BY RATING LIMIT 3";

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
		$query = "INSERT INTO DETALLE_MOVIMIENTO (ID_MOVIMIENTO, ID_EMPRESA, ID_USUARIO, ID_CUENTA, CONCEPTO, TIPO_CUENTA, NATURALEZA, FECHA_APLICACION, MONTO, FECHA_REG, ESTATUS, NOTA) ";
		$query.= "VALUES ('0', '".$idEmpresa."', (SELECT ID_USUARIO FROM USUARIO WHERE UUID='".$uuid."'), '".$idCuenta."', '".$concepto."', '".$tipoCuenta."', '".$naturaleza."', '".$fechaAplicacion."', '".$monto."', NOW(), 'A', '".$nota."')";
			
			
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
			$query = "SELECT SUM(SALDO) SALDO FROM CUENTA_BANCO WHERE ID_CUENTA_BANCO = $id ";
		}else{	
			$query = "SELECT SUM(SALDO) SALDO FROM SUBCUENTA WHERE ID_SUBCUENTA = $id ";		
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
		$salida = $line["SALDO"];				        
    }
    					
    
    $result->free();
    $bd->close();
	
    return $salida;		
}

/**
*Actualiza directamente el saldo de la cuenta
**/
function actualizaSaldoCuentaDuro($id, $tipoCuenta, $saldo){
    $bd= conectaBD();
	
	
	if($tipoCuenta=="CTA"){
		$query = "UPDATE CUENTA_BANCO  SET SALDO='$saldo' WHERE ID_CUENTA_BANCO = $id ";
	}else{	
		$query = "UPDATE SUBCUENTA SET SALDO='$saldo' WHERE ID_SUBCUENTA = $id ";		
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
	$query.= "AND DT.ESTATUS = 'A' AND DT.ID_CUENTA = ".$idCuenta." ";
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
*Actualiza el saldo de la cuenta concentradora cuando una de sus subcuentas aplica un movimiento
**/
function actualizaSaldoCuentaConcentradora($idSubCuenta){
    $bd= conectaBD();
	
	
$query = "	UPDATE CUENTA_BANCO
			SET SALDO = (
				SELECT SUM(SALDO) FROM SUBCUENTA
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

?>