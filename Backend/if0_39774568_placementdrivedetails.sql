-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql200.infinityfree.com
-- Generation Time: Sep 29, 2025 at 09:59 PM
-- Server version: 11.4.7-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_39774568_placementdrivedetails`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `companyName` varchar(255) NOT NULL,
  `placementDate` date NOT NULL,
  `package` varchar(100) DEFAULT NULL,
  `photoUrl` varchar(1024) NOT NULL,
  `postedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `postedBy` varchar(255) NOT NULL,
  `postedById` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`id`, `name`, `companyName`, `placementDate`, `package`, `photoUrl`, `postedAt`, `postedBy`, `postedById`) VALUES
('alumni_68da096ae39873348ea75', 'Rakesh', 'GlowLogics ', '2025-09-06', '5.2', 'uploads/alum_68da096ae36cfe77f640b1000139692.jpg', '2025-09-29 04:22:02', 'Super Admin', 'SUPER_ADMIN_01'),
('alum_68da1beb1d7ba3f2df463', 'G GIRI ', 'GlowLogics ', '2025-09-09', '5.2', 'uploads/img_68da236ba1079fc28dc8eprofile.JPG', '2025-09-29 05:40:59', 'Super Admin', 'SUPER_ADMIN_01'),
('alum_68da7518de14115bae473', 'Guru Sai', 'Genpact ', '2022-09-29', '12LPA', 'uploads/img_68da7518de14f1a4cb0721000144865.jpg', '2025-09-29 12:01:28', 'Super Admin', 'SUPER_ADMIN_01');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `postedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `postedBy` varchar(255) NOT NULL,
  `postedById` varchar(255) NOT NULL,
  `isPublic` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `postedAt`, `postedBy`, `postedById`, `isPublic`) VALUES
('anno_68da0fa117e1e9168212a', 'Site is under construction', 'Testing', '2025-09-29 04:48:33', 'Super Admin', 'SUPER_ADMIN_01', 1),
('anno_68da11f41c7fb7730ceea', 'Announcement Testing ', 'Free', '2025-09-29 04:58:28', 'Guru Sai', 'admin_68da112bdb0d308e1e0ef', 1),
('anno_68da12034d9362dd8ccb9', 'Testing Announcement ', 'Premium ', '2025-09-29 04:58:43', 'Guru Sai', 'admin_68da112bdb0d308e1e0ef', 0),
('anno_68da90f3ad5de897c44c0', 'Testing at 7 30', 'test', '2025-09-29 14:00:19', 'Super Admin', 'SUPER_ADMIN_01', 1),
('anno_68da930fdd39f17e9c0ff', 'posting it at 7 39', 'testing', '2025-09-29 14:09:20', 'Super Admin', 'SUPER_ADMIN_01', 1);

-- --------------------------------------------------------

--
-- Table structure for table `drives`
--

CREATE TABLE `drives` (
  `id` varchar(255) NOT NULL,
  `companyName` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `eligibility` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ;

--
-- Dumping data for table `drives`
--

INSERT INTO `drives` (`id`, `companyName`, `role`, `description`, `eligibility`, `location`, `salary`, `applyDeadline`, `postedAt`, `postedBy`, `postedById`, `applyLink`, `packageLevel`, `isFree`) VALUES
('drive_68da100ec0c92ed732a93', 'Free', 'Telecom', 'hehe', '[\"Any Engineering Degree\",\"Relevant certifications\"]', 'tirupati', '20000', '2025-09-30', '2025-09-29 04:50:22', 'Super Admin', 'SUPER_ADMIN_01', '', 'LOW', 1),
('drive_68da11499e976de6940f6', 'Premium ', 'Drf', 'Hdjj', '[\"Ydhd\"]', 'Dyyd', '10', '2025-09-30', '2025-09-29 04:55:37', 'Super Admin', 'SUPER_ADMIN_01', '', 'LOW', 0),
('drive_68da91341ebf4ff3d18a9', 'CyberSecure', 'Cybersecurity Analyst', 'posting at 7 31', '[\"Any Engineering Degree\",\"Relevant certifications\"]', 'tirupati', '10', '2025-09-23', '2025-09-29 14:01:24', 'Super Admin', 'SUPER_ADMIN_01', '', 'LOW', 1);

-- --------------------------------------------------------

--
-- Table structure for table `drive_interests`
--

CREATE TABLE `drive_interests` (
  `passId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `driveId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `studentId` varchar(255) NOT NULL,
  `registeredAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drive_interests`
--

INSERT INTO `drive_interests` (`passId`, `userId`, `driveId`, `userName`, `studentId`, `registeredAt`) VALUES
('pass_68da116eded7fddcf4f39', 'user_68da110845305cc775e5d', 'drive_68da11499e976de6940f6', 'Rakesh', 'raki@123', '2025-09-29 04:56:14'),
('pass_68da1180c3c1dce9f31fa', 'user_68da110845305cc775e5d', 'drive_68da100ec0c92ed732a93', 'Rakesh', 'raki@123', '2025-09-29 04:56:32'),
('pass_68da11990707bf3445efb', 'user_68da1117ba3faeebcec38', 'drive_68da100ec0c92ed732a93', 'Harish', 'hari@123', '2025-09-29 04:56:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('STUDENT','ADMIN','SUPER_ADMIN') NOT NULL,
  `subscriptionTier` enum('FREE','PREMIUM') DEFAULT 'FREE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `password`, `role`, `subscriptionTier`) VALUES
('admin_68da112bdb0d308e1e0ef', 'guru@123', 'Guru Sai', '$2y$10$zh9vZMaSm3ScUHuNFXHSKOnKiRaKyGvALFR5Xfc6bUYQ72YgeIaW2', 'ADMIN', 'FREE'),
('SUPER_ADMIN_01', 'csjjpfp', 'Super Admin', '$2y$10$8q4LbuU.LD3nHtIezaft7.qoo3/5KycKAbw/EmQis2YP5VTcvKThS', 'SUPER_ADMIN', 'PREMIUM'),
('user_68da110845305cc775e5d', 'raki@123', 'Rakesh', '$2y$10$bM5SWYTTjy6g4brLXpKHWOfgnOVDVdwIuwCOw/coF6nWgCUG3sDIu', 'STUDENT', 'PREMIUM'),
('user_68da1117ba3faeebcec38', 'hari@123', 'Harish', '$2y$10$Y3aRTa.CrOFZropC0uUs7uhEKG7yQnZIkGq31mRIpjEHlWq7us6ru', 'STUDENT', 'FREE');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `drive_interests`
--
ALTER TABLE `drive_interests`
  ADD PRIMARY KEY (`passId`),
  ADD UNIQUE KEY `user_drive` (`userId`,`driveId`),
  ADD KEY `driveId` (`driveId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drive_interests`
--
ALTER TABLE `drive_interests`
  ADD CONSTRAINT `drive_interests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `drive_interests_ibfk_2` FOREIGN KEY (`driveId`) REFERENCES `drives` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
