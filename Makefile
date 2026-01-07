PROJECT = urligram

BASE = docker-compose.base.yml
DEV  = docker-compose.dev.yml
PROD = docker-compose.prod.yml

start-dev:
	docker compose -p $(PROJECT) -f $(BASE) -f $(DEV) up --build

start-prod:
	docker compose -p $(PROJECT) -f $(BASE) -f $(PROD) up -d --build

down:
	docker compose -p $(PROJECT) down

logs:
	docker compose -p $(PROJECT) logs -f api

db:
	docker compose -p $(PROJECT) exec db mysql -uroot -p
