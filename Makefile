dev:
	docker-compose -f docker-compose.yml up --build -d

start:
	docker-compose start

log-a:
	docker compose logs app

log-m:
	docker compose logs mariadb

stop:
	docker-compose stop

down:
	docker-compose down -v

clean:
	docker system prune -a