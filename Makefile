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

test-e2e:
	docker compose exec -T api rails db:migrate
	docker compose restart api
	docker compose run --rm user sh -lc '\
		i=0; \
		until node -e "require(\"http\").get(\"http://api:3000\", () => process.exit(0)).on(\"error\", () => process.exit(1))"; do \
			i=$$((i + 1)); \
			test $$i -ge 60 && exit 1; \
			sleep 1; \
		done; \
		pnpm exec playwright install chromium >/dev/null && \
		PLAYWRIGHT_API_BASE_URL=http://api:3000 pnpm run test:e2e'

test-admin-e2e:
	cd admin_view/nuxt-project && \
		npm run test:e2e && \
		PLAYWRIGHT_ADMIN_API_URL=http://localhost:3000 npm run test:e2e:real

run-swagger:
	docker compose -f compose.swagger.yml up -d

openapi:
	docker compose run --rm api bundle exec rake routes:oas:docs
	docker compose run --rm api bundle exec rake routes:oas:build
	docker compose run --rm api bundle exec rake openapi:sync_access_control

api-access-docs:
	docker compose run --rm api bundle exec rake api_access_control:export_markdown \
		OUTPUT_PATH=/myapp/tmp/group-manager-api-access-control.md
	cp api/tmp/group-manager-api-access-control.md docs/group-manager-api-access-control.md

erd:
	docker compose run --rm api bundle exec rake erd filetype=png filename=er
