# Lab 2 – REST API med Express

En enkel REST API byggd med Node.js och Express för att hantera en lista av uppgifter (tasks). Datan lagras i minnet (in-memory) och ersätter en riktig databas.

## Teknik

- **Node.js** med ES-moduler (`"type": "module"`)
- **Express** – webbramverk för HTTP-routing och middleware

## Projektstruktur

```
backend-lab1/
├── server.js                   # Startpunkt – skapar och startar Express-servern
├── package.json
├── routes/
│   └── tasks.routes.js         # Definierar alla routes för /api/tasks
├── controllers/
│   └── tasks.controller.js     # Hanterar HTTP-logik (request/response)
├── models/
│   └── tasks.model.js          # Dataoperationer (läs, skapa, uppdatera, ta bort)
└── data/
    └── tasks.data.js           # In-memory datakälla
```

## Kom igång

### Förutsättningar

- Node.js version 18 eller senare

### Installation och start

```bash
cd backend-lab1
npm install
npm start
```

Servern startar på `http://localhost:3000`.

## API-endpoints

Bas-URL: `/api/tasks`

| Metod    | Endpoint          | Beskrivning                        |
| -------- | ----------------- | ---------------------------------- |
| `GET`    | `/api/tasks`      | Hämta alla uppgifter               |
| `GET`    | `/api/tasks/:id`  | Hämta en specifik uppgift via id   |
| `POST`   | `/api/tasks`      | Skapa en ny uppgift                |
| `PUT`    | `/api/tasks/:id`  | Uppdatera en befintlig uppgift     |
| `DELETE` | `/api/tasks/:id`  | Ta bort en uppgift                 |

### Datamodell

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false
}
```

### Exempel – hämta alla uppgifter

```
GET http://localhost:3000/api/tasks
```

```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "Buy groceries", "completed": false },
    { "id": 2, "title": "Read a book", "completed": true },
    { "id": 3, "title": "Write lab report", "completed": false }
  ]
}
```

### Exempel – skapa en uppgift

```
POST http://localhost:3000/api/tasks
Content-Type: application/json

{
  "title": "Study for exam",
  "completed": false
}
```

Fältet `title` är obligatoriskt. `completed` är valfritt och sätts till `false` om det utelämnas.

### Felhantering

| HTTP-statuskod | Situation                                     |
| -------------- | --------------------------------------------- |
| `200 OK`       | Lyckad GET eller PUT                          |
| `201 Created`  | Ny resurs skapad via POST                     |
| `400 Bad Request` | Saknat eller ogiltigt fält i request body  |
| `404 Not Found`   | Ingen uppgift hittades med angivet id       |
