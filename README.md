# grafton
=======
# Proyecto Grafton
Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

- **Docker** y **Docker Compose**

Este proyecto es una **API** con **Symfony** en el backend y **Vue.js** en el frontend, construido y gestionado mediante **Docker Compose**. Implementa un enfoque basado en **Domain-Driven Design (DDD)** y **Command Query Responsibility Segregation (CQRS)** para mantener el código desacoplado, modular y fácil de mantener.

## Requisitos previos
Para levantar el proyecto:

GNU Make: Necesitamos GNU Make versión 4.3 o superior. Puedes verificar si está instalado con el comando 
```bash
make -v
```

Docker: El proyecto se ejecuta en contenedores, por lo que necesitarás Docker versión 27.1.2 o superior. Verifica si Docker está instalado con el comando
```bash
docker -v
```
Docker Compose: Utilizamos Docker Compose versión v2.29.1 o superior para gestionar múltiples contenedores. Puedes comprobar su instalación con 
```bash
docker compose version
```


## Estructura del Proyecto

```bash
.
├── conf                 # Configuraciones para Nginx, puertos y Xdebug
├── devops               # Configuración de Docker Compose y Dockerfiles
│   ├── docker-compose.yml
│   └── Makefile         # Herramientas para facilitar las tareas de desarrollo
└── project              # Código fuente del proyecto
    ├── backend          # Backend con Symfony
    └── front            # Frontend con Vue.js
```

## Primeros pasos
Clona el repositorio:


```bash
git clone https://github.com/gogeta20/grafton
```
Cambia al directorio devops:
```bash
cd devops
```
Construye los contenedores:

```bash
make build
```
Levanta los contenedores:

```bash
make up
```
Ejecuta las migraciones para la base de datos:

```bash
make back-migrate
```

Crea el primer usuario de Symfony (opcional):

```bash
make symfony-create-user
```

Crea la llaves para los token jwt:

```bash
make jwt
```

Opciones adicionales
En caso de tener problemas con permisos en el backend o frontend, puedes ejecutar el siguiente comando para cambiar los permisos:

```bash
make back-permission-777
```
Otros comandos útiles
Acceder al contenedor de Symfony (backend):

```bash
make back
```
Acceder al contenedor de Node.js (frontend):

```bash
make frontend
```

Detener los contenedores:

```bash
make stop
```

Ver los logs del backend:

```bash
make log-back
```

Ver los logs del frontend:

```bash
make log-front
```

## Descripción del Proyecto
El proyecto es una API que permite la gestión de artículos y usuarios, con funcionalidades adicionales como la marcación de favoritos. El backend está desarrollado en Symfony y expone diferentes endpoints para gestionar los datos, mientras que el frontend utiliza Vue.js para crear una interfaz moderna y reactiva.

## Arquitectura basada en DDD y CQRS
El proyecto sigue un enfoque basado en Domain-Driven Design (DDD) y CQRS (Command Query Responsibility Segregation). A continuación, se explican brevemente estos conceptos:

DDD (Domain-Driven Design): La estructura del proyecto está organizada en torno al dominio central del negocio. Los conceptos clave del dominio, como Artículo, Usuario y Favorito, se representan a través de entidades y agregados. Las reglas de negocio se implementan dentro de estas entidades y otros objetos del dominio.

CQRS (Command Query Responsibility Segregation): El proyecto separa las operaciones de lectura (queries) de las operaciones de escritura (commands). Esto permite un código más limpio y especializado para cada tipo de operación:

Queries: Son responsables de leer los datos, pero nunca modifican el estado del sistema. Se encargan de ejecutar consultas sobre las entidades y devolver los resultados.
Commands: Se encargan de modificar el estado del sistema, como crear, actualizar o eliminar entidades. Siguen la regla de "un comando, una responsabilidad".
Ejemplo de la organización de Commands y Queries
### Commands
Tarea: Modificar el estado de la aplicación (crear, actualizar, eliminar).
Ejemplo: CreateArticleCommand – se utiliza para crear un nuevo artículo.
Manejo: Los Handlers ejecutan la lógica asociada a un comando y realizan las acciones pertinentes sobre el dominio.
### Queries
Tarea: Recuperar datos sin alterar el estado.
Ejemplo: GetAllArticlesQuery – se utiliza para recuperar todos los artículos existentes.
Manejo: Los Handlers ejecutan las consultas correspondientes y devuelven los datos al controlador para su respuesta.
### Normas del Proyecto
Desacoplamiento: Siempre buscamos desacoplar las capas. Los controladores, servicios y repositorios son independientes, lo que facilita el mantenimiento y las pruebas.

Inyección de dependencias: Utilizamos la inyección de dependencias para pasar los servicios a los controladores y casos de uso, lo que mejora la modularidad y la capacidad de testeo.

Validación en los Requests: Todas las validaciones deben realizarse en los objetos Request antes de llegar al controlador.

Manejo de Excepciones: Se manejan excepciones específicas como StoreException para capturar errores del dominio y DatabaseException para errores en la base de datos.

### Funcionalidades clave
Gestión de artículos: Crear, editar, eliminar y listar artículos.
Sistema de favoritos: Los usuarios pueden marcar sus artículos favoritos.
Gestión de usuarios: Crear y actualizar usuarios desde el frontend.
Autenticación JWT: Implementación de autenticación segura con tokens JWT.
## Desarrollo y Colaboración
### Entorno de desarrollo
El entorno de desarrollo está completamente dockerizado, lo que significa que todo lo que necesitas para ejecutar el proyecto ya está preconfigurado dentro de los contenedores de Docker. No necesitas instalar manualmente servicios como MySQL o configurar Nginx en tu máquina local.

### Tareas comunes
Levantar y apagar contenedores: Usa make up y make down para iniciar o detener todo el stack de contenedores.

Migraciones de base de datos: Las migraciones se ejecutan con el comando make back-migrate.

Acceso a la base de datos: Puedes acceder a la base de datos MySQL ejecutando:

```bash
make mysql-in
```

Problemas de permisos: Si experimentas problemas con permisos, puedes ejecutar:
```bash
make back-permission-777
```
