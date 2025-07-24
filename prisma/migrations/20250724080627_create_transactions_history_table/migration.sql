-- CreateTable
CREATE TABLE "transaction_history" (
    "id" SERIAL NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "wallet_id" INTEGER NOT NULL,

    CONSTRAINT "transaction_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_history_invoice_number_key" ON "transaction_history"("invoice_number");

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "users_wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
