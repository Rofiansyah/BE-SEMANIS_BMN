/*
  Warnings:

  - Made the column `barangId` on table `peminjaman` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."peminjaman" DROP CONSTRAINT "peminjaman_barangId_fkey";

-- AlterTable
ALTER TABLE "public"."peminjaman" ALTER COLUMN "barangId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."peminjaman" ADD CONSTRAINT "peminjaman_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "public"."barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
