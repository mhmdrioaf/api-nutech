-- CreateTable
CREATE TABLE "users_wallet" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "users_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_owner_id_key" ON "users_wallet"("owner_id");

-- AddForeignKey
ALTER TABLE "users_wallet" ADD CONSTRAINT "users_wallet_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
