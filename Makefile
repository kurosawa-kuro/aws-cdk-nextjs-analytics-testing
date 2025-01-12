dev:
	cd src && pnpm run dev

build:
	cd src && pnpm run build

start:
	cd src && pnpm run start

generate-env:
	cd infrastructure/script && node generate-env.js
