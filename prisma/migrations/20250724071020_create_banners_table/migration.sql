-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "banner_name" TEXT NOT NULL,
    "banner_image" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
