-- Create the column as nullable first
ALTER TABLE "Conversation" ADD COLUMN "userId" INTEGER;

-- Update existing rows to set a default user ID (adjust the user ID as necessary)
-- This assumes you have a user with id 1; change it accordingly
UPDATE "Conversation" SET "userId" = 1 WHERE "userId" IS NULL;

-- Now make the column non-nullable
ALTER TABLE "Conversation" ALTER COLUMN "userId" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "Conversation" ADD FOREIGN KEY ("userId") REFERENCES "User"("id");