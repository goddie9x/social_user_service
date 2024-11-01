# User Service

The `user_service` is a Node.js microservice designed to manage user-related functionalities in a social media application. This service handles user authentication, manages tokens, and communicates with other services via gRPC and Kafka. It also registers with Eureka for service discovery.

To view all services for this social media system, lets visit: `https://github.com/goddie9x?tab=repositories&q=social`

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

## Setup

### 1. Clone the Repository

Clone the `user_service` repository and its required utilities:

```bash
git clone https://github.com/goddie9x/social_user_service.git
cd user_service
```

### 2. Clone Utility Package

Clone the required `social_utils` package as a subdirectory in the project root:

```bash
git clone https://github.com/goddie9x/social_utils.git utils
```

### 3. Configuration

Set up environment variables in a `.env` file in the root directory with the following configuration:

```dotenv
APP_NAME=user-service
PORT=3000
JWT_ACCESS_TOKEN_SECRET=<your_jwt_access_token_secret>
JWT_REFRESH_TOKEN_SECRET=<your_jwt_refresh_token_secret>
JWT_ACCESS_TOKEN_EXPIRE=2h
JWT_REFRESH_TOKEN_EXPIRE=7d
REFRESH_TOKEN_MAX_AGE_MILLISECONDS=604800000
MONGODB_URI=mongodb://goddie9x:thisIsJustTheTestPassword123@mongo:27017/user
KAFKA_CLIENT_HOST=kafka:29092
EUREKA_DISCOVERY_SERVER_HOST=discovery-server
EUREKA_DISCOVERY_SERVER_PORT=8761
APP_PATH=/api/v1/users
IP_ADDRESS=user-service
HOST_NAME=user-service
PROTO_PORT=0.0.0.0:50051
REDIS_CONNECTION_STRING=redis://thisIsJustTheUser:thisIsJustTheTestPassword123@redis:6379
ELASTIC_SEARCH_INSTANCE=elasticsearch
ELASTIC_SEARCH_USERNAME=elastic
ELASTIC_SEARCH_PASSWORD=thisIsJustTheTestPassword123
```

Ensure to replace sensitive values with appropriate placeholders.

## Package Installation

Ensure dependencies are installed by running:

```bash
npm install
```

## Running the Service Locally

To start the service locally:

```bash
npm start
```

The service will run on `http://localhost:3000` by default and the gRPC server will listen on `0.0.0.0:50051`.

## Running with Docker

1. **Dockerfile**:

   Create a `Dockerfile` in the project root with the following content:

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /usr/src/app
   COPY package*.json ./
   RUN npm install --production --legacy-peer-deps
   COPY . .
   EXPOSE 50051
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run the Docker Container**:

   Build and start the Docker container:

   ```bash
   docker build -t user-service .
   docker run -p 3000:3000 -p 50051:50051 --env-file .env user-service
   ```

## Running with Docker Compose

To run `user_service` within a Docker Compose setup, include the following service definition:

```yaml
user-service:
  image: user-service
  build:
    context: .
  ports:
    - 3000:3000
    - 50051:50051
  environment:
    - APP_NAME=user-service
    - PORT=3000
    - JWT_ACCESS_TOKEN_SECRET=<your_jwt_access_token_secret>
    - JWT_REFRESH_TOKEN_SECRET=<your_jwt_refresh_token_secret>
    - JWT_ACCESS_TOKEN_EXPIRE=2h
    - JWT_REFRESH_TOKEN_EXPIRE=7d
    - REFRESH_TOKEN_MAX_AGE_MILLISECONDS=604800000
    - MONGODB_URI=mongodb://goddie9x:thisIsJustTheTestPassword123@mongo:27017/user
    - KAFKA_CLIENT_HOST=kafka:29092
    - EUREKA_DISCOVERY_SERVER_HOST=discovery-server
    - EUREKA_DISCOVERY_SERVER_PORT=8761
    - APP_PATH=/api/v1/users
    - IP_ADDRESS=user-service
    - HOST_NAME=user-service
    - PROTO_PORT=0.0.0.0:50051
    - REDIS_CONNECTION_STRING=redis://thisIsJustTheUser:thisIsJustTheTestPassword123@redis:6379
    - ELASTIC_SEARCH_INSTANCE=elasticsearch
    - ELASTIC_SEARCH_USERNAME=elastic
    - ELASTIC_SEARCH_PASSWORD=thisIsJustTheTestPassword123
  depends_on:
    - mongo
    - discovery-server
    - kafka
    - redis
    - elasticsearch
  networks:
    - social-media-network
```

Start all services with Docker Compose:

```bash
docker-compose up --build
```

## Accessing the Service

Once running, the `user_service` will be available at `http://localhost:3000/api/v1/users`, and gRPC requests can be made to `0.0.0.0:50051`.

---

This setup will allow you to start, configure, and deploy the `user_service` in both local and containerized environments.

### Useful Commands

- **Stop Containers**: Use `docker-compose down` to stop all services and remove the containers.
- **Restart Containers**: Run `docker-compose restart` to restart the services without rebuilding the images.

This setup enables seamless orchestration of the social media microservices with an API Gateway for managing external client requests.

## Contributing

Contributions are welcome. Please clone this repository and submit a pull request with your changes. Ensure that your changes are well-tested and documented.

## License

This project is licensed under the MIT License. See `LICENSE` for more details.