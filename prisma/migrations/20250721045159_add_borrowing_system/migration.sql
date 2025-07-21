/*
  Warnings:

  - You are about to drop the column `deskripsi` on the `kategori` table. All the data in the column will be lost.
  - You are about to drop the column `deskripsi` on the `lokasi` table. All the data in the column will be lost.
  - You are about to drop the column `deskripsi` on the `merek` table. All the data in the column will be lost.
  - Added the required column `nama` to the `barang` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusBarang" AS ENUM ('TERSEDIA', 'DIPINJAM', 'DALAM_PROSES_PEMINJAMAN');

-- CreateEnum
CREATE TYPE "StatusPeminjaman" AS ENUM ('PENDING', 'DISETUJUI', 'DITOLAK', 'DIPINJAM', 'DIKEMBALIKAN');

-- AlterTable
ALTER TABLE "barang" ADD COLUMN     "nama" TEXT NOT NULL,
ADD COLUMN     "status" "StatusBarang" NOT NULL DEFAULT 'TERSEDIA';

-- AlterTable
ALTER TABLE "kategori" DROP COLUMN "deskripsi";

-- AlterTable
ALTER TABLE "lokasi" DROP COLUMN "deskripsi";

-- AlterTable
ALTER TABLE "merek" DROP COLUMN "deskripsi";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "peminjaman" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barangId" TEXT NOT NULL,
    "status" "StatusPeminjaman" NOT NULL DEFAULT 'PENDING',
    "tanggalPengajuan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalDisetujui" TIMESTAMP(3),
    "tanggalDipinjam" TIMESTAMP(3),
    "tanggalDikembalikan" TIMESTAMP(3),
    "penanggungJawab" TEXT,
    "fotoPinjam" TEXT,
    "fotoKembali" TEXT,
    "catatan" TEXT,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peminjaman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman" ADD CONSTRAINT "peminjaman_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
