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
