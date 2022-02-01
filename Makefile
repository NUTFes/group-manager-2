api=https://group-manager-api.nutfes.net

build:
	docker compose build
	docker compose run --rm view npm install
	docker compose run --rm admin_view npm install
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu

build db:
	docker compose run --rm api rails db:create
	docker compose run --rm api rails db:migrate
	docker compose run --rm api rails db:seed_fu

prod-build:
	docker compose -f docker-compose.prod.yml build
	docker compose -f docker-compose.prod.yml run --rm view npm install
	docker compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) view npm run build
	docker compose -f docker-compose.prod.yml run --rm inside_view npm install
	docker compose -f docker-compose.prod.yml run --rm -e VUE_APP_URL=$(api) inside_view npm run build
	docker compose -f docker-compose.prod.yml run --rm admin_view npm install
	docker compose -f docker-compose.prod.yml run --rm api rails db:create
	docker compose -f docker-compose.prod.yml run --rm api rails db:migrate
	docker compose -f docker-compose.prod.yml run --rm api rails db:seed_fu

prod-up:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-restart:
	docker compose -f docker-compose.prod.yml up -d
	docker compose -f docker-compose.prod.yml down