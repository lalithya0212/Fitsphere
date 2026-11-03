-- ===================================================================
-- FitSphere — Database Schema (Phase 1 Auth + Phase 2 User Profiles)
-- Database Engine: MySQL 8.x
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `fitsphere`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `fitsphere`;

-- -------------------------------------------------------------------
-- 1. Table: users
-- Core authentication credentials and platform identity
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` VARCHAR(20) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  CONSTRAINT `uq_users_email` UNIQUE (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------
-- 2. Table: student_profiles
-- Role-specific profile for student-athletes (One-to-One with users)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `student_profiles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `student_id` VARCHAR(50) NOT NULL,
  `department` VARCHAR(150) DEFAULT NULL,
  `course` VARCHAR(150) DEFAULT NULL,
  `year_of_study` INT DEFAULT NULL,
  `date_of_birth` DATE DEFAULT NULL,
  `gender` VARCHAR(30) DEFAULT NULL,
  `fitness_goal` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `profile_image_url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  CONSTRAINT `uq_student_profiles_user_id` UNIQUE (`user_id`),
  CONSTRAINT `uq_student_profiles_student_id` UNIQUE (`student_id`),
  CONSTRAINT `fk_student_profiles_user_id` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------
-- 3. Table: trainer_profiles
-- Role-specific credentials for coaches/trainers (One-to-One with users)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `trainer_profiles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `trainer_id` VARCHAR(50) NOT NULL,
  `qualification` VARCHAR(255) DEFAULT NULL,
  `experience_years` INT DEFAULT NULL,
  `specialization` VARCHAR(150) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `profile_image_url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  CONSTRAINT `uq_trainer_profiles_user_id` UNIQUE (`user_id`),
  CONSTRAINT `uq_trainer_profiles_trainer_id` UNIQUE (`trainer_id`),
  CONSTRAINT `fk_trainer_profiles_user_id` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------------
-- 4. Table: admin_profiles
-- Role-specific profile for sports directors (One-to-One with users)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_profiles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `employee_id` VARCHAR(50) NOT NULL,
  `department` VARCHAR(150) DEFAULT NULL,
  `designation` VARCHAR(150) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `profile_image_url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  CONSTRAINT `uq_admin_profiles_user_id` UNIQUE (`user_id`),
  CONSTRAINT `uq_admin_profiles_employee_id` UNIQUE (`employee_id`),
  CONSTRAINT `fk_admin_profiles_user_id` FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
