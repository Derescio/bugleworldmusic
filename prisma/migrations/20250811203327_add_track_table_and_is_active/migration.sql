-- AlterTable
ALTER TABLE "public"."music" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."tracks" (
    "id" SERIAL NOT NULL,
    "music_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER,
    "position" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_music_id_position_key" ON "public"."tracks"("music_id", "position");

-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "public"."music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
