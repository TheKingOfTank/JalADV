-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2020 a las 08:18:22
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hackathon`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aliados`
--

CREATE TABLE `aliados` (
  `idAliado` int(11) NOT NULL,
  `NomAliado` varchar(20) NOT NULL,
  `TelAliado` varchar(15) NOT NULL,
  `EdoAliado` varchar(25) NOT NULL,
  `MpioAliado` varchar(25) NOT NULL,
  `ClAliado` varchar(20) NOT NULL,
  `NumAliado` varchar(10) NOT NULL,
  `CCTAliado` varchar(20) NOT NULL,
  `CorreoAliado` varchar(30) NOT NULL,
  `ContraseniaAli` varchar(20) NOT NULL,
  `Verificado` tinyint(1) NOT NULL,
  `idModerador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aspirante`
--

CREATE TABLE `aspirante` (
  `idAspirante` int(11) NOT NULL,
  `NomAspirante` varchar(20) NOT NULL,
  `apPatAsp` varchar(20) NOT NULL,
  `apMatAsp` varchar(20) NOT NULL,
  `EdoAspirante` varchar(20) NOT NULL,
  `MpioAspirante` varchar(20) NOT NULL,
  `ClAspirante` varchar(20) NOT NULL,
  `NumCasaAsp` int(11) NOT NULL,
  `NumTelAsp` varchar(15) NOT NULL,
  `FecNac` date NOT NULL,
  `CorreoAsp` varchar(30) NOT NULL,
  `Idiomas` varchar(50) DEFAULT NULL,
  `ContraseniaAsp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `idEmpresa` int(11) NOT NULL,
  `NomEmpresa` varchar(25) NOT NULL,
  `NomReclutador` varchar(20) NOT NULL,
  `apPatReclutador` varchar(20) NOT NULL,
  `apMatReclutador` varchar(20) NOT NULL,
  `EdoEmpresa` varchar(20) NOT NULL,
  `MpioEmp` varchar(20) NOT NULL,
  `ClEmpresa` varchar(20) NOT NULL,
  `NumEmp` varchar(20) NOT NULL,
  `CorreoEmp` varchar(30) DEFAULT NULL,
  `ContraseniaEmp` varchar(20) NOT NULL,
  `TelEmpresa` varchar(15) DEFAULT NULL,
  `SitioEmp` varchar(60) DEFAULT NULL,
  `GiroEmp` varchar(20) NOT NULL,
  `TamEmp` varchar(20) NOT NULL,
  `CIF` varchar(20) NOT NULL,
  `Verificada` tinyint(1) NOT NULL,
  `idAspirante` int(11) NOT NULL,
  `idModerador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE `grupos` (
  `idGrupo` int(11) NOT NULL,
  `NomGrupo` varchar(20) NOT NULL,
  `DescGrupo` varchar(50) NOT NULL,
  `idAspirante` int(11) NOT NULL,
  `idEmpresa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insigneas`
--

CREATE TABLE `insigneas` (
  `idInsignea` int(11) NOT NULL,
  `NomInsig` varchar(25) NOT NULL,
  `DescripcionIns` varchar(50) NOT NULL,
  `Verificada` tinyint(1) NOT NULL,
  `idAspirante` int(11) NOT NULL,
  `idAliado` int(11) NOT NULL,
  `idModerador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `moderadores`
--

CREATE TABLE `moderadores` (
  `idModerador` int(11) NOT NULL,
  `NomModerador` varchar(20) NOT NULL,
  `apPatMod` varchar(20) NOT NULL,
  `apMatMod` varchar(20) NOT NULL,
  `TelMod` varchar(15) NOT NULL,
  `CorreoMod` varchar(30) NOT NULL,
  `ContraseniaMod` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aliados`
--
ALTER TABLE `aliados`
  ADD PRIMARY KEY (`idAliado`),
  ADD KEY `moderadores_aliados_fk` (`idModerador`);

--
-- Indices de la tabla `aspirante`
--
ALTER TABLE `aspirante`
  ADD PRIMARY KEY (`idAspirante`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`idEmpresa`),
  ADD KEY `moderadores_empresa_fk` (`idModerador`),
  ADD KEY `aspirante_empresa_fk` (`idAspirante`);

--
-- Indices de la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`idGrupo`),
  ADD KEY `aspirante_grupos_fk` (`idAspirante`),
  ADD KEY `empresa_grupos_fk` (`idEmpresa`);

--
-- Indices de la tabla `insigneas`
--
ALTER TABLE `insigneas`
  ADD PRIMARY KEY (`idInsignea`),
  ADD KEY `moderadores_insigneas_fk` (`idModerador`),
  ADD KEY `aliados_insigneas_fk` (`idAliado`),
  ADD KEY `aspirante_insigneas_fk` (`idAspirante`);

--
-- Indices de la tabla `moderadores`
--
ALTER TABLE `moderadores`
  ADD PRIMARY KEY (`idModerador`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aliados`
--
ALTER TABLE `aliados`
  MODIFY `idAliado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `aspirante`
--
ALTER TABLE `aspirante`
  MODIFY `idAspirante` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `idEmpresa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `grupos`
--
ALTER TABLE `grupos`
  MODIFY `idGrupo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `insigneas`
--
ALTER TABLE `insigneas`
  MODIFY `idInsignea` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `moderadores`
--
ALTER TABLE `moderadores`
  MODIFY `idModerador` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aliados`
--
ALTER TABLE `aliados`
  ADD CONSTRAINT `moderadores_aliados_fk` FOREIGN KEY (`idModerador`) REFERENCES `moderadores` (`idModerador`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `aspirante_empresa_fk` FOREIGN KEY (`idAspirante`) REFERENCES `aspirante` (`idAspirante`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `moderadores_empresa_fk` FOREIGN KEY (`idModerador`) REFERENCES `moderadores` (`idModerador`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD CONSTRAINT `aspirante_grupos_fk` FOREIGN KEY (`idAspirante`) REFERENCES `aspirante` (`idAspirante`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `empresa_grupos_fk` FOREIGN KEY (`idEmpresa`) REFERENCES `empresa` (`idEmpresa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `insigneas`
--
ALTER TABLE `insigneas`
  ADD CONSTRAINT `aliados_insigneas_fk` FOREIGN KEY (`idAliado`) REFERENCES `aliados` (`idAliado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `aspirante_insigneas_fk` FOREIGN KEY (`idAspirante`) REFERENCES `aspirante` (`idAspirante`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `moderadores_insigneas_fk` FOREIGN KEY (`idModerador`) REFERENCES `moderadores` (`idModerador`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
