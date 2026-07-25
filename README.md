# Hotel Reservation Frontend

Simple HTML, CSS, and Vanilla JavaScript frontend for the Hotel Reservation System.

The frontend allows users to create hotel reservations, look up existing reservations, and cancel reservations by calling the backend API.

## Build Docker Image

```bash
docker build -t hotel-frontend:v1 .
```

## Run Docker Container

```bash
docker run -d --name hotel-frontend -p 8080:80 hotel-frontend:v1
```
# Trigger Frontend Pipeline 2 Sat Jul 25 19:15:08     2026
