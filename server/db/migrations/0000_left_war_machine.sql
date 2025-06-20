CREATE TABLE "bitcoin_price" (
	"id" text PRIMARY KEY NOT NULL,
	"close_price_usd" numeric(18, 8) NOT NULL,
	"evaluated_at" integer NOT NULL,
	CONSTRAINT "bitcoin_price_evaluated_at_unique" UNIQUE("evaluated_at")
);
--> statement-breakpoint
CREATE INDEX "bitcoin_price_close_price_usd_idx" ON "bitcoin_price" USING btree ("close_price_usd");--> statement-breakpoint
CREATE INDEX "bitcoin_price_evaluated_at_idx" ON "bitcoin_price" USING btree ("evaluated_at");