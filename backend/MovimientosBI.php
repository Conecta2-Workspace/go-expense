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
			$idMedioAcceso = $request["idMedioAcceso"];

			//~Recupera el saldo antes de aplicar el movimiento
			$arrSaldo = getSaldoCuenta($idCuenta, $tipoCuenta, $idMovimiento);
			$saldoDisponibleAntes = $arrSaldo["saldoDisponible"];
			$saldoRetenidoAntes = $arrSaldo["saldoRetenido"];
			$saldoAntes = $arrSaldo["saldo"];
			
			//~Medio de acceso
			$medioAcceso = getMedioAcceso($idMedioAcceso);
			$operacionRetieneSaldoMA = $medioAcceso["retieneSaldo"];
			$request["operacionRetieneSaldoMA"] = $operacionRetieneSaldoMA;
			
			//~Valida sobregiro cuando es cargo
			if($naturaleza=="C"){
				if(($saldoDisponibleAntes - $monto)<0){
					$isExito = 0;
					$msgError = "Saldo insuficiente";
					
					throw new Exception($msgError);
				}
			}
			
			//~Inserta el movimiento
			$idMovimiento = registraMovimiento($request);
			
			if($idMovimiento>0){
				//~Se retiene el saldo
				if($operacionRetieneSaldoMA && $naturaleza=="C"){
					$saldoNvo = $saldoAntes;
					$saldoRetenidoNvo = $saldoRetenidoAntes + $monto;
					$saldoDisponibleNvo = $saldoNvo - $saldoRetenidoNvo;
				}else{
					$saldoNvo = $saldoAntes + (  ($naturaleza=="C") ? $monto *-1 : $monto  );
					$saldoRetenidoNvo = $saldoRetenidoAntes;
					$saldoDisponibleNvo = $saldoNvo - $saldoRetenidoNvo;
				}
				
				
				//~Genera nuevo saldo				
				actualizaSaldoCuentaDuro($idCuenta, $tipoCuenta, $saldoNvo, $saldoRetenidoNvo, $saldoDisponibleNvo);
				
				//~Recupera los ultimos 50 registros de la base
				$ultimoMov = getLastMovimientos($idCuenta, $GLOBALS['LISTA_MOV_LIMIT']);
				
				
				$salidaRegMov = array(	"saldoAntes"=>$saldoDisponibleAntes,
										"saldoDespues"=>$saldoDisponibleNvo,
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

function doGetListaMediosAcceso(){
	$lista = array();
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
			
			$idEmpresa = $request['idEmpresa'];
			
			
			$lista = getListaMediosAcceso($idEmpresa);

			
		}
		else {
			echo "Not called properly with username parameter!";
		}
	}catch (Exception $e) {
		
	}	
	$salida = array(			
				"exito"=>$isExito,
				"error"=>$msgError,
				"data"=> $lista
				);		

	echo json_encode($salida);
}


function doGetMovimientosRetenidos(){
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
			
			$idMedioAcceso = $request['idMedioAcceso'];
			
			
			$listaMovimientos = getMovimientosRetenidos($idMedioAcceso);

			
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