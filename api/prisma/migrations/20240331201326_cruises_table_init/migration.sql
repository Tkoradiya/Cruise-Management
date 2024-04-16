/*
  Warnings:

  - Added the required column `cruise_id` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `cruise_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_cruise_id_fkey` FOREIGN KEY (`cruise_id`) REFERENCES `Cruises`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
