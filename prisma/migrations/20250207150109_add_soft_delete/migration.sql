/*
  Warnings:

  - You are about to drop the `auditlog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocklog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `auditlog` DROP FOREIGN KEY `AuditLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `stocklog` DROP FOREIGN KEY `StockLog_productId_fkey`;

-- DropForeignKey
ALTER TABLE `stocklog` DROP FOREIGN KEY `StockLog_userId_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `auditlog`;

-- DropTable
DROP TABLE `stocklog`;
