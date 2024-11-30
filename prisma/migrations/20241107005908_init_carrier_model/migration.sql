-- CreateTable
CREATE TABLE "carriers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "mc_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);
