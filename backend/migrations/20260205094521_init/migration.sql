-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `instructor_id` INTEGER NOT NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `courses_instructor_id_idx`(`instructor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order_index` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `modules_course_id_idx`(`course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lessons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content_type` ENUM('VIDEO', 'TEXT') NOT NULL,
    `video_url` VARCHAR(191) NULL,
    `text_content` TEXT NULL,
    `duration` INTEGER NULL,
    `order_index` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lessons_module_id_idx`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `enrolled_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `enrollments_user_id_idx`(`user_id`),
    INDEX `enrollments_course_id_idx`(`course_id`),
    UNIQUE INDEX `enrollments_user_id_course_id_key`(`user_id`, `course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `lesson_id` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `completed_at` DATETIME(3) NULL,

    INDEX `progress_user_id_idx`(`user_id`),
    INDEX `progress_lesson_id_idx`(`lesson_id`),
    UNIQUE INDEX `progress_user_id_lesson_id_key`(`user_id`, `lesson_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `reviews_course_id_idx`(`course_id`),
    UNIQUE INDEX `reviews_user_id_course_id_key`(`user_id`, `course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_instructor_id_fkey` FOREIGN KEY (`instructor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `progress` ADD CONSTRAINT `progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `progress` ADD CONSTRAINT `progress_lesson_id_fkey` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
