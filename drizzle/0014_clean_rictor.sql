ALTER TABLE `app_users` DROP INDEX `app_users_username_unique`;--> statement-breakpoint
ALTER TABLE `app_users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `app_users` ADD CONSTRAINT `app_users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `app_users` DROP COLUMN `username`;