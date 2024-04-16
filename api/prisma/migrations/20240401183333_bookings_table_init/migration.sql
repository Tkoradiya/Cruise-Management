-- AlterTable
ALTER TABLE `users` ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `mobile_number` VARCHAR(191) NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `gender` ENUM('Female', 'Male') NULL;
