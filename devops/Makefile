USER=1000

#========================================
.PHONY: help
help: ## Muestra la ayuda de los objetivos disponibles
	@echo "Uso: make [objetivo]"
	@echo ""
	@echo "Objetivos disponibles:"
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
		print " - " substr($$1, 0, length($$1)-1) \
	} /^## / { \
		print "    " substr($$0, 5) \
	} ' $(MAKEFILE_LIST)

up:
	docker compose up -d

down:
	docker compose down

stop:
	docker compose stop

restart:
	docker compose restart

build:
	docker compose build

restart-docker:
	sudo service docker restart

#========================================
.PHONY: enter-php-container
back:
	docker exec -it backend_g /bin/bash

user-back:
	docker exec -u $(USER) -it backend_g /bin/bash

cache:
	docker exec backend_g sh -c "php bin/console cache:clear"

router:
	docker exec backend_g sh -c "php bin/console debug:router"

log-back:
	docker logs backend_g

restart-apache:
	docker exec backend_g sh -c "service apache2 restart"

chown-config: #make chown-config file=doctrine.yaml
	docker exec backend_g sh -c "chown -R www-data:www-data /var/www/html/$(file)"

back-permission:
	docker exec backend_g sh -c "chown -R www-data:www-data ."

back-permission-777: #
	docker exec backend_g sh -c "chmod -R 777 /var/www"

symfony-create-user:
	@docker exec -it backend_g php /var/www/html/scripts/execute_sql.php

back-migrate:
	docker exec -it backend_g php bin/console doctrine:migrations:migrate --no-interaction

 ip ?= default
.PHONY: xdebug
xdebug: ## 🆘⛑ Actualizamos la ip de escucha de xdebug. ip={}
	docker exec backend_g sh -c "sed -i 's|xdebug.client_host =.*|xdebug.client_host =$(ip)|g' /var/www/shared/docker-php-ext-xdebug.ini && \
	cp /var/www/shared/docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini"

#========================================
frontend:
	docker exec -it frontend_g sh

packages-front:
	@docker-compose exec frontend_g sh -c "chown -R node:node node_modules/"

front-permission:
	@docker-compose exec frontend_g sh -c "chown -R node:node ."

user-front:
	docker exec -u node -it frontend_g sh

log-front:
	docker logs frontend_g

mysql-in:
	@docker exec -it mysql_g mysql -usymfony -psymfony_password symfony_db