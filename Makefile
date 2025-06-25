dev:
	docker-compose -f docker-compose.yml up --build -d

start:
	docker-compose start

stop:
	docker-compose stop

down:
	docker-compose down -v

clean:
	docker system prune -a