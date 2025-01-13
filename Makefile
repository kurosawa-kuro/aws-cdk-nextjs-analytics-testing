dev:
	cd full-stack && pnpm run dev

build:
	cd full-stack && pnpm run build

start:
	cd full-stack && pnpm run start

generate-env:
	cd infrastructure/script && node generate-env.js

db-reset:
	cd full-stack && pnpm run db:reset

test:
	cd full-stack && pnpm run test

migrate:
	cd full-stack && pnpm run migrate
