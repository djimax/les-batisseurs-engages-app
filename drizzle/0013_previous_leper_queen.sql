ALTER TABLE `adhesions` MODIFY COLUMN `montant` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` MODIFY COLUMN `objectif` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `campaigns` MODIFY COLUMN `montantCollecte` decimal(10,2) NOT NULL DEFAULT '0';--> statement-breakpoint
ALTER TABLE `cotisations` MODIFY COLUMN `montant` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `depenses` MODIFY COLUMN `montant` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `dons` MODIFY COLUMN `montant` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `montant` decimal(10,2) NOT NULL;