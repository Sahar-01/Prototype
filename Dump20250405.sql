-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: prototype_db
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `expense_claims`
--

DROP TABLE IF EXISTS `expense_claims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_claims` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `reason_for_rejection` varchar(255) DEFAULT NULL,
  `receipt_url` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `manager_id` bigint DEFAULT NULL,
  `staff_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1p4eptvs20j5eq8o8kad5ks1r` (`manager_id`),
  KEY `FKp70dtb021h48hrwyqwy63ftaj` (`staff_id`),
  CONSTRAINT `FK1p4eptvs20j5eq8o8kad5ks1r` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKp70dtb021h48hrwyqwy63ftaj` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_claims`
--

LOCK TABLES `expense_claims` WRITE;
/*!40000 ALTER TABLE `expense_claims` DISABLE KEYS */;
INSERT INTO `expense_claims` VALUES (1,1000,NULL,NULL,NULL,NULL,NULL,'PENDING',NULL,NULL);
/*!40000 ALTER TABLE `expense_claims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'queen@example.com','$2a$10$nJd3mhq2vJeOnQC6XcmIX.SBGgLThyctCLlYgOzryuVQFb0nynhQ2',NULL,'queen'),(2,NULL,'$2a$10$yx5ifj8T7dtwAvyFS1HBbOqyb96UFVh1J/SaWO0JzfnD3DxkJoyEi',NULL,'admin'),(3,NULL,'$2a$10$tbLRWNg.zqypZ4KJfCkf3OF0tp9SYbJRbaqsUIxWkAz9IpRSgCCjK',NULL,'123456'),(4,NULL,'$2a$10$pkUIarSFCxQd1gPHMUt0XOU/vjAJucAx.YZsefc8KWAACWnapCyOG',NULL,'testuser'),(5,'testuser','$2a$10$KHTNsEmv93RsvnRvCAquGOQ1Bp02PpEVJaShch.JPXGn1TcU8jak2','STAFF','wrwrwrw'),(6,'testuser','$2a$10$yqe4/IOhlaC/36D539X7B.evnqk6HSI9XvW15Kvufz2Bvl1AqRTFy','STAFF','jhuh'),(7,'testuser','$2a$10$aDYj/2lPQhBMC1znSRnO3e5NgXOZtF.ujqJXYsZzwX1e1xrMkQ5ra','STAFF','jhuh'),(8,'testuser','$2a$10$QyLZSTqfupmyAhaSy7zGiuiHuKZsMz6ES7pHHciv9qi5pMj7OxKlu','STAFF','jhuh'),(9,'testuser','$2a$10$mCoLwJfemMVSaIB.7fs9HuZxH8iGW8TbFnkbHCjy.oPv59CH0s0Ue','STAFF','jhuh'),(10,'testuser','$2a$10$luTqW2XxPMbpB6J4nCv/duTbt.zuVHolJGNz8r5sqhmLpcURYEUyG','STAFF','jhuh'),(11,'testuser','$2a$10$ooiO99IROETmfCyO7qjnl.CXdRvOlixaKMyPUjalLNi8bmFfADOLq','STAFF','hvh'),(12,'testuser','$2a$10$L8gwrC1JZpLW2dhnFGbDHOlAC2vF1Ky3xXlRz/qpgFhIsXmdf5sge','STAFF','uyguf'),(13,'testuser','$2a$10$IK2lYiI5FkU1TB4uzobAROttKVToJJwLefL0cDymrvZ5vZMA.uprm','STAFF','jhvvhvh'),(14,'testuser','$2a$10$A6k2wp/i9Cbf3pFMu6vgzeX.yNuD8z0os.8t5C/0Y6J2eB25wH4H6','STAFF','tomi'),(15,'ojomo@gmail.com','$2a$10$lsAchQTwP0TkMXE1HTrdGee7FpfBT/yVLrxpvV1VJv0NW0n0vSKeK','STAFF','tobi'),(16,'ojomo@gmail.com','$2a$10$VJbQc/fz0tfuQmkh76acwuOkyECa1IJ1GaGRk/Dw2/1fdMZTEpDzm','STAFF','tobiann'),(17,'tola@gmail.com','$2a$10$G0qzEjR8hVq7RM1MtO1TeuHC5CksPYfkEYQ7S.LmwtkD2k6l5FJKG','STAFF','tolami'),(18,'tola07@gmail.com','$2a$10$syvmhPqhaZ0hlvzOOgPmsuzaNfYrou0btG/sFJa3SOdMOgHP3Ivk6','STAFF','tolaojomo'),(19,'tolaoj@gmail.com','$2a$10$k5yb4Ljh6/SgOtSHhFIaOOTyq2.gQuv2e/9QiI2COqfcrvs8rq.Uu','STAFF','tolamiojomo');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-05  9:49:42
