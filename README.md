
# NodeLabs Task: Chat Application

---

## 📦 Tech Stack

| Layer        | Technology                     |
|-------------|---------------------------------|
| Language     | TypeScript                     |
| Framework    | Express.js                     |
| Database     | MongoDB                        |
| Realtime     | Socket.IO                      |
| Queue        | RabbitMQ                       |
| Cache / State| Redis                          |
| Auth         | Passport + JWT                 |
| Deployment   | Docker, Docker Compose, K8s    |

---
## 📁 Project Structure

```
├── modules/             # Modular feature structure (auth, message, user, etc.)
├── models/              # Mongoose models
├── dto/                 # DTOs with class-validator
├── socket/              # Socket.IO server
├── queue/               # RabbitMQ integration
├── cron/                # Scheduled jobs (e.g. auto message matching)
├── worker/              # RabbitMQ consumers
├── k8s/                 # Kubernetes YAML manifests
├── docker-compose.yaml  # Local Docker setup
├── nginx/               # Reverse proxy configuration
└── main.ts              # App entry point
```

---

## 🐳 Local Development (Docker Compose)

1. Copy `.env` file and set values:
   ```env
   PORT=5354
   JWT_SECRET=yourSecret
   MONGO_URI=mongodb://root:example@mongo:27017
   ```

2. Build and start services:
   ```bash
   npm run build:docker
   ```

3. Access services:
    - API Gateway: `http://localhost`
    - Nginx routes (see `nginx/nginx.conf` for path mappings)

---

## ☸️ Kubernetes Deployment

1. Apply all manifests:

   ```bash
   npm run apply:k8s
   ```

2. (Optional) Clean up:
   ```bash
   npm run delete:k8s
   ```

3. View deployed services:
   ```bash
   kubectl get pods
   kubectl get services
   ```

---

## 📬 API Documentation

Postman collections are available under `/documentation`:

- `NodeLabs - Local Postman.json`
- `NodeLabs - Nginx Microservice Postman.json`
- `NodeLabs - Kubernetes Postman.json`

---

## 🧪 Testing

- Manual testing via Postman collections
- Socket.IO test client available in:  
  `test/socket.ts`

---

## 🛠️ Environment Variables

| Key            | Description                  |
|----------------|------------------------------|
| `PORT`         | Port the app listens on      |
| `MODULE`       | Microservice module name     |
| `JWT_SECRET`   | JWT signing key              |
| `MONGO_URI`    | MongoDB connection string    |

---

## ⚙️ Scaling & Deployment Notes

- All services are designed to be independently scalable.
- `MODULE=...` flag controls which logic a container runs.
- Horizontal scaling enabled via HPA (`k8s/*-hpa.yaml`).
- Redis + Room-based socket communication is ready for adapter integration.
