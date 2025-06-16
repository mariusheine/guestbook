CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author` text,
	`content` text NOT NULL,
	`image` text NOT NULL,
	`imageContext` text DEFAULT '',
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
