-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "id"         TEXT NOT NULL,
    "email"      TEXT NOT NULL,
    "password"   TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
