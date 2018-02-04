<?php
include "lib.php";



function doRegistraMovimiento(){
	$isExito = 1;
	$msgError = "";
	$salidaRegMov = array();
	$milisegActual = time();
	$cntMilisegCaducidad = (60000)*1; //~1 Minuto

	try {
		$postdata = file_get_contents("php://input");
		if (isset($postdata)) {
			
			
			//~Limpia JSON de entrada
			$postdata = str_replace('\"','"',$postdata);
			$postdata = str_replace('"{"','{"',$postdata);
			$postdata = str_replace('"}"','"}',$postdata);
			
			//echo $postdata;
			$request = (array) json_decode($postdata, true);		
			
			$idEmpresa = $request['idEmpresa'];
			$uuid = $request["uuid"];
			$idCuenta = $request["idCuenta"];
			$tipoCuenta = $request["tipoCuenta"];
			$concepto = $request["concepto"];
			$naturaleza = $request["naturaleza"];
			$monto = $request["monto"];
			$nota = $request["nota"];
			$idMovimiento = $request["idMovimiento"];

			//~Recupera el saldo antes de aplicar el movimiento
			$saldoAntes = getSaldoCuenta($idCuenta, $tipoCuenta, $idMovimiento);
			
			//~Valida sobregiro cuando es cargo
			if($naturaleza=="C"){
				if(($saldoAntes - $monto)<0){
					$isExito = 0;
					$msgError = "Saldo insuficiente";
					
					throw new Exception($msgError);
				}
			}
			
			//~Inserta el movimiento
			$idMovimiento = registraMovimiento($request);
			
			if($idMovimiento>0){			
				//~Genera nuevo saldo
				$nuevoSaldoCuenta = $saldoAntes + (  ($naturaleza=="C") ? $monto *-1 : $monto  );
				actualizaSaldoCuentaDuro($idCuenta, $tipoCuenta, $nuevoSaldoCuenta);
				
				//~Recupera los ultimos 50 registros de la base
				$ultimoMov = getLastMovimientos($idCuenta, $GLOBALS['LISTA_MOV_LIMIT']);
				
				
				$salidaRegMov = array(	"saldoAntes"=>$saldoAntes,
										"saldoDespues"=>$nuevoSaldoCuenta,
										"idMovimientoGenerado"=>$idMovimiento,
										"detalleMovMini"=>array("msCaducidadInfo"=>$milisegActual+$cntMilisegCaducidad,"detalle"=>$ultimoMov),
										"movimientoRegistrado"=>array("idEmpresa"=>$idEmpresa,"uuid"=>$uuid,"idCuenta"=>$idCuenta,"tipoCuenta"=>$tipoCuenta,"concepto"=>$concepto,"naturaleza"=>$naturaleza,"monto"=>$monto)
									);
			
				/**
				* Arrastra saldo a la cuenta concentradora
				* Solo aplica cuando se genera movimiento en una subcuenta
				* Saldo cuenta = saldo subcuentas + saldo retenido
				**/
				
				if($tipoCuenta=="SUBCTA"){
					actualizaSaldoCuentaConcentradora($idCuenta);
				}
				
				
				/**
				* Actualiza el rating de uso por cuenta / subcuenta
				*
				**/				
				actualizaRatingSubcta($idCuenta, $tipoCuenta);
				
			}else{
				$isExito=0;
				$msgError="No fue posible registrar el movimiento en DETALLE_MOVIMIENTO";
			}
		}
		else {
			echo "Not called properly with username parameter!";
		}
	}catch (Exception $e) {
		
	}	
	$salida = array(			
				"exito"=>$isExito,
				"error"=>$msgError,
				"data"=> $salidaRegMov
				);		

	echo json_encode($salida);
	
}	


function doGetDetalleMovimientos(){
	$listaMovimientos = array();
	$isExito = 1;
	$msgError = "";
	try {
		$postdata = file_get_contents("php://input");
		if (isset($postdata)) {
			
			
			//~Limpia JSON de entrada
			$postdata = str_replace('\"','"',$postdata);
			$postdata = str_replace('"{"','{"',$postdata);
			$postdata = str_replace('"}"','"}',$postdata);
			
			//echo $postdata;
			$request = (array) json_decode($postdata, true);		
			
			$idCuenta = $request['idCuenta'];
			
			
			$listaMovimientos = getLastMovimientos($idCuenta, $GLOBALS['LISTA_MOV_LIMIT']);

			
		}
		else {
			echo "Not called properly with username parameter!";
		}
	}catch (Exception $e) {
		
	}	
	$salida = array(			
				"exito"=>$isExito,
				"error"=>$msgError,
				"data"=> $listaMovimientos
				);		

	echo json_encode($salida);
}

?>