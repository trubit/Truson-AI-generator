# Scalability Analysis Report for Neurova

This document lists the critical system and database bottlenecks identified in the codebase that prevent it from scaling to **300,000+ concurrent users** without crashing, along with the proposed architectural fixes.

---

## 1. In-Memory Memory Leaks (State Retention in RAM)
### Finding:
In `server/src/modules/prompts/repositories/prompt.repository.ts`, there is an in-memory array:
```typescript
private inMemoryStore: PromptGeneratorResult[] = [];
```
Whenever a prompt is saved, it pushes it onto this array. 

### Why this crashes the app:
* **Memory Exhaustion (OOM)**: At 300,000+ concurrent users, storing every single generated prompt result inside a local Javascript array will consume all system RAM in minutes, triggering a V8 heap out-of-memory crash.
* **Lack of Synchronization**: In a load-balanced production environment, different backend instances will have isolated array memories. Users will get random lists of generated prompts depending on which server their HTTP request hits.

### Fix:
Change the repository to store and retrieve data directly using the MongoDB/Mongoose `PromptHistoryModel` database collection.

---

## 2. In-Memory Rate Limiting
### Finding:
In `server/src/middleware/security.middleware.ts`, the rate limiter `apiLimiter` uses `express-rate-limit`'s default in-memory store.

### Why this crashes the app:
* **RAM Overhead**: The default in-memory store retains the IP address and request count of every visitor. Under a massive load of 300,000+ concurrent users, tracking millions of unique client IPs in a standard JavaScript object eats gigabytes of RAM.
* **Shared State Inconsistency**: Horizontally scaled application instances (e.g., in a Kubernetes cluster or behind an AWS load balancer) cannot share this memory. A user could make 300 requests to Server A and 300 to Server B, bypassing rate limits entirely, or get blocked inconsistently.

### Fix:
Implement a distributed rate-limiting store. If a `REDIS_URL` is present in the environment variables, the system will use a Redis-backed store (`rate-limit-redis` with `ioredis`). If not, it will fall back to a memory-efficient store.

---

## 3. Lack of Database Compound Indexes
### Finding:
The Mongoose schemas in `server/src/modules/ai-chat/models/` and `server/src/modules/prompts/models/` only define single-field indexes. 

### Why this crashes the app:
* **In-Memory Sorting & Collection Scans**: When fetching chat conversations, the system queries by `{ user, status }` and sorts by `{ isPinned: -1, updatedAt: -1 }`. Without a compound index, MongoDB must execute index intersections and load matching documents into DB memory to sort them manually.
* When retrieving chat messages, the system queries by `{ conversation }` and sorts by `{ createdAt: 1 }`. Under 300,000+ users, this causes high disk I/O, heavy DB CPU usage, and eventual database lockups.

### Fix:
Introduce compound indexes on the database layer:
* **Conversations**: `{ user: 1, status: 1, isPinned: -1, updatedAt: -1 }`
* **Messages**: `{ conversation: 1, createdAt: 1 }`
* **Prompt History**: `{ user: 1, createdAt: -1 }`

---

## 4. Database Connection Pool Exhaustion
### Finding:
The database connection configuration in `server/src/database/connection.ts` connects without specifying pool limit size parameters.

### Why this crashes the app:
* **Pool Starvation**: Mongoose defaults to a maximum pool size of 100 connections. When 300,000+ users make database calls, 100 connections will be exhausted instantly. Requests will queue up, database queries will bottleneck, and the backend will throw connection timeout errors.

### Fix:
Configure Mongoose options:
* `maxPoolSize`: `500` (allowing more simultaneous database connections).
* `minPoolSize`: `50` (maintaining warm connections).
* Connect socket timeout limits.

---

## 5. Single-Threaded Node.js Execution
### Finding:
The entrypoint `server.ts` starts a single Express HTTP listener on one main thread.

### Why this crashes the app:
* **CPU Bottleneck**: Node.js runs on a single event loop thread by default. Even on a server with 16 or 32 CPU cores, a single Node.js process will only run on one core. Under high loads, that core will hit 100% usage immediately, blocking the event loop and causing requests to hang and time out.

### Fix:
Utilize Node.js's native `cluster` module in production. The master process will fork workers equal to the number of CPU cores, distributing incoming HTTP connections evenly across all available CPU resources.
