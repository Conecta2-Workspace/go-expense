-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-02-2018 a las 16:49:21
-- Versión del servidor: 10.1.25-MariaDB
-- Versión de PHP: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `go_expense`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta_banco`
--

CREATE TABLE `cuenta_banco` (
  `ID_CUENTA_BANCO` int(11) NOT NULL,
  `ID_EMPRESA` varchar(50) NOT NULL,
  `NOMBRE` varchar(50) NOT NULL,
  `SALDO` decimal(10,2) NOT NULL COMMENT 'SALDO = SALDO SUBCTA + SALDO RETENIDO',
  `SALDO_RETENIDO` decimal(10,2) NOT NULL COMMENT 'SALDO EXCLUSIVO DE LA CUENTA',
  `DESCRIPCION` varchar(70) NOT NULL,
  `ESTATUS` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `cuenta_banco`
--

INSERT INTO `cuenta_banco` (`ID_CUENTA_BANCO`, `ID_EMPRESA`, `NOMBRE`, `SALDO`, `SALDO_RETENIDO`, `DESCRIPCION`, `ESTATUS`) VALUES
(1, 'evert.nicolas@gmail.com', 'PAT EMY', '8620.00', '0.00', 'Cuenta patrimonial de Emy', 1),
(2, 'evert.nicolas@gmail.com', 'TC EMY', '0.00', '0.00', 'Tarjeta de credito Inbursa Plus', 1),
(3, 'evert.nicolas@gmail.com', 'BANCO AZTECA 11036', '0.00', '0.00', 'Cuenta esclusiva para recargas electronicas telcwel', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_movimiento`
--

CREATE TABLE `detalle_movimiento` (
  `ID_MOVIMIENTO` bigint(20) NOT NULL,
  `ID_EMPRESA` varchar(50) NOT NULL,
  `ID_USUARIO` int(11) NOT NULL,
  `ID_CUENTA` int(11) NOT NULL,
  `ID_MEDIO_ACCESO` int(11) NOT NULL,
  `CONCEPTO` varchar(50) NOT NULL,
  `TIPO_CUENTA` varchar(6) NOT NULL COMMENT 'CTA Y SUBCTA',
  `NATURALEZA` varchar(1) NOT NULL COMMENT 'C y A',
  `FECHA_APLICACION` date NOT NULL,
  `MONTO` decimal(10,2) NOT NULL,
  `FECHA_REG` date NOT NULL,
  `ESTATUS` varchar(1) NOT NULL COMMENT '[A]Aplicado [R]Retenido [C]Cancelado',
  `NOTA` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `detalle_movimiento`
--

INSERT INTO `detalle_movimiento` (`ID_MOVIMIENTO`, `ID_EMPRESA`, `ID_USUARIO`, `ID_CUENTA`, `ID_MEDIO_ACCESO`, `CONCEPTO`, `TIPO_CUENTA`, `NATURALEZA`, `FECHA_APLICACION`, `MONTO`, `FECHA_REG`, `ESTATUS`, `NOTA`) VALUES
(156, 'evert.nicolas@gmail.com', 3, 1, 1, 'SALDO INICIAL', 'SUBCTA', 'A', '2018-02-24', '100.00', '2018-02-24', 'A', ''),
(157, 'evert.nicolas@gmail.com', 3, 1, 2, 'RET1', 'SUBCTA', 'C', '2018-02-24', '50.00', '2018-02-24', 'R', '[RETENIDO]'),
(158, 'evert.nicolas@gmail.com', 3, 1, 3, 'RET 2', 'SUBCTA', 'C', '2018-02-24', '20.00', '2018-02-24', 'R', '[RETENIDO] FUI A BUCAR CHOCOLATES'),
(159, 'evert.nicolas@gmail.com', 3, 7, 1, 'inicial', 'SUBCTA', 'A', '2018-02-24', '3552.00', '2018-02-24', 'A', ''),
(160, 'evert.nicolas@gmail.com', 3, 6, 1, 'aaaaa', 'SUBCTA', 'A', '2018-02-24', '3333.00', '2018-02-24', 'A', ''),
(161, 'evert.nicolas@gmail.com', 3, 2, 1, 'asdasdasd', 'SUBCTA', 'A', '2018-02-24', '1255.00', '2018-02-24', 'A', ''),
(162, 'evert.nicolas@gmail.com', 3, 8, 1, 'inicial', 'SUBCTA', 'A', '2018-02-24', '1000.00', '2018-02-24', 'A', ''),
(163, 'evert.nicolas@gmail.com', 3, 8, 3, 'ejemplo', 'SUBCTA', 'C', '2018-02-24', '100.00', '2018-02-24', 'R', '[RETENIDO] '),
(164, 'evert.nicolas@gmail.com', 3, 2, 3, 'retenido poque si viaje a cuerna', 'SUBCTA', 'C', '2018-02-24', '450.00', '2018-02-24', 'R', '[RETENIDO] ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medio_acceso`
--

CREATE TABLE `medio_acceso` (
  `ID_MEDIO_ACCESO` int(11) NOT NULL,
  `ID_EMPRESA` varchar(50) NOT NULL,
  `NOMBRE` varchar(20) NOT NULL,
  `PREFIJO` varchar(3) NOT NULL,
  `RETIENE_SALDO` int(11) NOT NULL DEFAULT '0',
  `ESTATUS` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `medio_acceso`
--

INSERT INTO `medio_acceso` (`ID_MEDIO_ACCESO`, `ID_EMPRESA`, `NOMBRE`, `PREFIJO`, `RETIENE_SALDO`, `ESTATUS`) VALUES
(1, 'evert.nicolas@gmail.com', 'EFECTIVO', 'EFE', 0, 1),
(2, 'evert.nicolas@gmail.com', 'CREDITO EMY', 'TCE', 1, 1),
(3, 'evert.nicolas@gmail.com', 'CREDITO EVERT', 'TCD', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcuenta`
--

CREATE TABLE `subcuenta` (
  `ID_SUBCUENTA` int(11) NOT NULL,
  `ID_EMPRESA` varchar(50) NOT NULL,
  `CUENTA_EJE` int(11) NOT NULL,
  `NOMBRE` varchar(50) NOT NULL,
  `SALDO` decimal(10,2) NOT NULL,
  `SALDO_RETENIDO` decimal(10,2) NOT NULL,
  `SALDO_DISPONIBLE` decimal(10,2) NOT NULL,
  `DESCRIPCION` varchar(150) NOT NULL,
  `RATING` int(11) NOT NULL,
  `ESTATUS` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `subcuenta`
--

INSERT INTO `subcuenta` (`ID_SUBCUENTA`, `ID_EMPRESA`, `CUENTA_EJE`, `NOMBRE`, `SALDO`, `SALDO_RETENIDO`, `SALDO_DISPONIBLE`, `DESCRIPCION`, `RATING`, `ESTATUS`) VALUES
(1, 'evert.nicolas@gmail.com', 1, 'ALAN', '100.00', '70.00', '30.00', 'Cuentita de gugu', 19, 1),
(2, 'evert.nicolas@gmail.com', 1, 'DEPTO', '1255.00', '450.00', '805.00', 'Casita', 7, 1),
(3, 'evert.nicolas@gmail.com', 1, 'CARRITO', '0.00', '0.00', '0.00', 'Chamionetita', 18, 1),
(4, 'evert.nicolas@gmail.com', 1, 'DENTISTA EN MEXICO CIUDAD', '0.00', '0.00', '0.00', 'Dentista Guerrero', 9, 1),
(5, 'evert.nicolas@gmail.com', 1, 'CELULAR', '0.00', '0.00', '0.00', 'CELULARES', 1, 1),
(6, 'evert.nicolas@gmail.com', 1, 'BARCOS', '3333.00', '0.00', '3333.00', 'PARA COMPRAR UN BARCO', 5, 1),
(7, 'evert.nicolas@gmail.com', 1, 'GATOS OTROS', '3552.00', '0.00', '3552.00', 'OTROS', 3, 1),
(8, 'evert.nicolas@gmail.com', 1, 'RECICLADO', '1000.00', '100.00', '900.00', 'PAPEL', 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_USUARIO` int(11) NOT NULL,
  `ID_EMPRESA` varchar(30) NOT NULL,
  `UUID` varchar(50) NOT NULL,
  `NOMBRE` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_USUARIO`, `ID_EMPRESA`, `UUID`, `NOMBRE`) VALUES
(1, 'evert.nicolas@gmail.com', 'uuid-generico2222', 'EVERT'),
(2, 'evert.nicolas@gmail.com', 'uuid-generico33333', 'SOCCER COCO'),
(3, 'evert.nicolas@gmail.com', 'uuid-generico', 'GENERICO PRUEBAS');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cuenta_banco`
--
ALTER TABLE `cuenta_banco`
  ADD PRIMARY KEY (`ID_CUENTA_BANCO`),
  ADD KEY `ID_EMPRESA` (`ID_EMPRESA`);

--
-- Indices de la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  ADD PRIMARY KEY (`ID_MOVIMIENTO`),
  ADD KEY `ID_EMPRESA` (`ID_EMPRESA`);

--
-- Indices de la tabla `medio_acceso`
--
ALTER TABLE `medio_acceso`
  ADD PRIMARY KEY (`ID_MEDIO_ACCESO`);

--
-- Indices de la tabla `subcuenta`
--
ALTER TABLE `subcuenta`
  ADD PRIMARY KEY (`ID_SUBCUENTA`),
  ADD KEY `ID_EMPRESA` (`ID_EMPRESA`),
  ADD KEY `CUENTA_EJE_LINK` (`CUENTA_EJE`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_USUARIO`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cuenta_banco`
--
ALTER TABLE `cuenta_banco`
  MODIFY `ID_CUENTA_BANCO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  MODIFY `ID_MOVIMIENTO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;
--
-- AUTO_INCREMENT de la tabla `medio_acceso`
--
ALTER TABLE `medio_acceso`
  MODIFY `ID_MEDIO_ACCESO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `subcuenta`
--
ALTER TABLE `subcuenta`
  MODIFY `ID_SUBCUENTA` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_USUARIO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `subcuenta`
--
ALTER TABLE `subcuenta`
  ADD CONSTRAINT `CUENTA_EJE_LINK` FOREIGN KEY (`CUENTA_EJE`) REFERENCES `cuenta_banco` (`ID_CUENTA_BANCO`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
