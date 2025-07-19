-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "KondisiBarang" AS ENUM ('BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT', 'HILANG');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nomorhp" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merek" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokasi" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barang" (
    "id" TEXT NOT NULL,
    "kodeBarang" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kondisi" "KondisiBarang" NOT NULL DEFAULT 'BAIK',
    "fotoUrl" TEXT,
    "qrCodeUrl" TEXT,
    "kategoriId" TEXT NOT NULL,
    "merekId" TEXT NOT NULL,
    "lokasiId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_nama_key" ON "kategori"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "merek_nama_key" ON "merek"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "lokasi_nama_key" ON "lokasi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "barang_kodeBarang_key" ON "barang"("kodeBarang");

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_merekId_fkey" FOREIGN KEY ("merekId") REFERENCES "merek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_lokasiId_fkey" FOREIGN KEY ("lokasiId") REFERENCES "lokasi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
