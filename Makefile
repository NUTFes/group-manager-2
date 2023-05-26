api=https://group-manager-api.nutfes.net

build:
	docker compose build
	docker compose run --rm user_front npm install
	docker compose run --rm admin_view npm install
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

build db:
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/develop

prod-build:
	docker-compose -f docker-compose.prod.yml build
	docker-compose -f docker-compose.prod.yml run --rm view npm install
	docker-compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) view npm run build
	docker-compose -f docker-compose.prod.yml run --rm inside_view npm install
	docker-compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) inside_view npm run build
	docker-compose -f docker-compose.prod.yml run --rm admin_view npm install
	docker-compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) admin_view npm run build
	docker-compose -f docker-compose.prod.yml run --rm api rails db:create
	docker-compose -f docker-compose.prod.yml run --rm api rails db:migrate
	docker-compose -f docker-compose.prod.yml run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/production

prod-build-no-install:
	docker-compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) view npm run build
	docker-compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) inside_view npm run build
	docker-compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) admin_view npm run build
	docker-compose -f docker-compose.prod.yml run --rm api rails db:create
	docker-compose -f docker-compose.prod.yml run --rm api rails db:migrate
	docker-compose -f docker-compose.prod.yml run --rm api rails db:seed_fu FIXTURE_PATH=db/fixtures/production

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

prod-restart:
	docker-compose -f docker-compose.prod.yml down
	docker-compose -f docker-compose.prod.yml up -d

prod-logs:
	docker-compose -f docker-compose.prod.yml logs

upgrade:
	make prod-down
	make prod-build-no-install
	make prod-up