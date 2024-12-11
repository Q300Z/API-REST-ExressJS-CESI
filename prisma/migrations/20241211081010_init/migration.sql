-- CreateTable
CREATE TABLE "User"
(
    "id"        UUID         NOT NULL,
    "nom"       VARCHAR(255) NOT NULL,
    "prenom"    VARCHAR(255) NOT NULL,
    "password"  VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP    NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article"
(
    "id"        UUID         NOT NULL,
    "titre"     VARCHAR(255) NOT NULL,
    "contenu"   TEXT         NOT NULL,
    "userId"    UUID         NOT NULL,
    "createdAt" TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP    NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nom_key" ON "User" ("nom");

-- CreateIndex
CREATE UNIQUE INDEX "User_prenom_key" ON "User" ("prenom");

-- CreateIndex
CREATE UNIQUE INDEX "Article_titre_key" ON "Article" ("titre");

-- AddForeignKey
ALTER TABLE "Article"
    ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
