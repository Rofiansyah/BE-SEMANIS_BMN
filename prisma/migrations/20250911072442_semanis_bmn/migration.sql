-- DropForeignKey
ALTER TABLE "public"."peminjaman" DROP CONSTRAINT "peminjaman_barangId_fkey";

-- AlterTable
ALTER TABLE "public"."peminjaman" ALTER COLUMN "barangId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."peminjaman" ADD CONSTRAINT "peminjaman_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "public"."barang"("id") ON DELETE SET NULL ON UPDATE CASCADE;
