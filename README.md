# Test Task: Generate Combinations and Store in MySQL

## Objective

Create an API that:
- Accepts a list of items and a desired combination length.
- Generates valid combinations based on specific rules.
- Stores combinations in a MySQL database.
- Returns the stored combinations to the client.

## Prerequisites

- **Node.js**
- **Docker** (for MySQL setup)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
2. **Start the MySQL database and API server using Docker Compose:**
   ```bash
   docker compose up

## API Documentation

### POST /generate

This endpoint generates valid combinations based on the provided items and combination length, then stores and returns them.

- **Endpoint:**
  ```bash
  POST /generate

- **Request Body Example:**
  ```json
  {
      "items": [1, 2, 1],
      "length": 2
  }
- **Response Example:**
  ```json 
  {
      "id": 1,
      "combination": [
        ["A1", "B1"], ["A1", "B2"], ["A1", "C1"],
        ["B1", "C1"], ["B2", "C1"]
      ]
  }
