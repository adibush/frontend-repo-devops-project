# Hotel Reservation Frontend

Simple frontend for a university DevOps final project.

The frontend allows users to create hotel reservations, search for existing reservations, and cancel reservations.

## Technologies

- HTML
- CSS
- Vanilla JavaScript
- NGINX
- Docker
- GitHub Actions

## Project Structure

```text
frontend-repo-devops-project/
|-- .github/
|   `-- workflows/
|-- src/
|   |-- index.html
|   |-- style.css
|   `-- script.js
|-- Dockerfile
`-- README.md
```

## Features

- Load hotels from the backend API
- Create a new reservation
- Display the generated reservation ID after successful reservation creation
- Search for a reservation by ID, full name, or email
- Cancel a reservation

## Backend API

The frontend calls the backend through these endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/hotels` | Load hotels |
| POST | `/api/reservation` | Create reservation |
| GET | `/api/reservation/<reservation_id>` | Get reservation by ID, full name, or email |
| DELETE | `/api/reservation/<reservation_id>` | Cancel reservation |

In Kubernetes, these routes are exposed through the NGINX Ingress.

## Build Docker Image

```bash
docker build -t hotel-frontend:v1 .
```

## Run Docker Container

```bash
docker run -d --name hotel-frontend -p 8080:80 hotel-frontend:v1
```

## CI/CD

Pipeline 1 runs on push to the `dev` branch.

It builds the Docker image and pushes it to Docker Hub:

```text
adibush/hotel-frontend
```

Pipeline 2 runs after Pipeline 1 completes successfully.

It updates the frontend image tag in the infrastructure repository, opens a pull request from `dev` to `main`, and merges it automatically.
