-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."music" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "release_date" TIMESTAMP(3),
    "duration" INTEGER,
    "cover_image_url" TEXT,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."music_genres" (
    "music_id" TEXT NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "music_genres_pkey" PRIMARY KEY ("music_id","genre_id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."music_tags" (
    "music_id" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "music_tags_pkey" PRIMARY KEY ("music_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."links" (
    "id" SERIAL NOT NULL,
    "music_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "public"."genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- AddForeignKey
ALTER TABLE "public"."music_genres" ADD CONSTRAINT "music_genres_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "public"."music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."music_genres" ADD CONSTRAINT "music_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."music_tags" ADD CONSTRAINT "music_tags_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "public"."music"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."music_tags" ADD CONSTRAINT "music_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."links" ADD CONSTRAINT "links_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "public"."music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
