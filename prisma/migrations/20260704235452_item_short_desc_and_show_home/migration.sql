-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "short_description" TEXT,
ADD COLUMN     "show_home" BOOLEAN NOT NULL DEFAULT false;
