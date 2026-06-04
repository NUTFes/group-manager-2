api=https://group-manager-api.nutfes.net

build-gm2:
	docker compose build
	docker compose run --rm user_front npm install
	docker compose run --rm admin_view npm install
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

build-gm2-mac:
	PLATFORM=arm64-darwin docker compose build
	docker compose run --rm user_front npm install
	docker compose run --rm admin_view npm install
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

build-gm3:
	docker compose build
	docker compose run --rm user pnpm install
	docker compose run --rm admin_view npm install
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

build-gm3-mac:
	PLATFORM=arm64-darwin docker compose build
	docker compose run --rm user pnpm install
	docker compose run --rm admin_view npm install
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

build db:
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

prod-build:
	docker compose -f compose.prod.yml build
	docker compose -f compose.prod.yml run --rm user pnpm install
	docker compose -f compose.prod.yml run --rm admin_view npm install
	docker compose -f compose.prod.yml run --rm user pnpm run build
	docker compose -f compose.prod.yml run --rm admin_view npm run build
	docker compose -f compose.prod.yml run --rm api rails db:migrate

prod-build-seed:
	docker compose -f compose.prod.yml build
	docker compose -f compose.prod.yml run --rm user pnpm install
	docker compose -f compose.prod.yml run --rm admin_view npm install
	docker compose -f compose.prod.yml run --rm user pnpm run build
	docker compose -f compose.prod.yml run --rm admin_view npm build
	docker compose -f compose.prod.yml run --rm api rails db:migrate
	docker compose -f compose.prod.yml run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/production

prod-up:
	docker compose -f compose.prod.yml up -d

prod-down:
	docker compose -f compose.prod.yml down

prod-restart:
	docker compose -f compose.prod.yml down
	docker compose -f compose.prod.yml up -d

prod-logs:
	docker compose -f compose.prod.yml logs

gen-component:
	docker compose run --rm user pnpm run scaff:component
	docker compose run --rm user pnpm run fmt

run-storybook:
	docker compose run --rm -p 6006:6006 user pnpm run storybook

fmt:
	docker compose run --rm user pnpm run fmt

run-swagger:
	docker compose -f compose.swagger.yml up -d

openapi: openapi-codegen

openapi-build:
	docker compose run --rm user pnpm run openapi:bundle

openapi-codegen: openapi-build
	docker compose run --rm user pnpm run api:generate

erd:
	docker compose run --rm api bundle exec rake erd filetype=png filename=er
