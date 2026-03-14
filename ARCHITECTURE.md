# Architecture

This document explains the architectural decisions and scalability considerations for the **AI-Assisted Journal System (NatureJournal)**.

The system allows users to write journal entries after immersive nature sessions and uses an LLM to analyze emotional tone and generate insights.

---

# 1. Scaling the System to 100k Users

To support large user growth, the system is designed with **horizontal scalability and service separation**.

### Stateless Backend

The Node.js API server should remain **stateless**, allowing multiple instances to run behind a load balancer.

Example deployment:

* Docker containers
* Kubernetes cluster
* NGINX / AWS Application Load Balancer

This allows traffic to be distributed across multiple servers.

### Database Scaling

MongoDB can scale using:

* **MongoDB Atlas clusters**
* **Sharding**

Sharding distributes journal entries across multiple database nodes, ensuring the system can handle high write throughput as the number of users increases.

Indexes can also be added for:

* `userId`
* `createdAt`
* `emotion`

This improves query performance for insights.

### LLM Processing Service

Emotion analysis can become expensive and slow if processed directly in the main API.

To solve this:

* Move LLM processing into a **separate microservice**
* Use a **message queue** (RabbitMQ / Kafka / Redis Queue)

Flow:

User Request
→ API Server
→ Queue
→ LLM Worker
→ Store Result in DB

This prevents the main API from blocking.

### Frontend Delivery

The frontend should be deployed on a **CDN** such as:

* Vercel
* Cloudflare
* AWS CloudFront

This allows static assets to be served from edge locations worldwide, improving latency and scalability.

---

# 2. Reducing LLM Costs

LLM APIs can become expensive at scale, so several strategies can be used to minimize costs.

### Caching Results

Many users may write similar journal entries.

Before calling the LLM:

1. Hash the journal text
2. Check Redis cache
3. If a result exists, return cached output

This avoids duplicate LLM calls.

### Model Selection

Use different models depending on complexity:

* Lightweight models for **emotion classification**
* Larger models only for **detailed summaries**

This reduces compute costs.

### Rate Limiting

To prevent abuse or excessive API usage:

* Implement **rate limiting middleware**
* Limit how often users can call `/analyze`

Example:

5 requests per minute per user.

---

# 3. Caching Repeated Analysis

To improve performance and reduce external API usage, the system uses **Redis caching**.

### Cache Workflow

1. Normalize the journal text.
2. Generate a hash of the text.
3. Use the hash as the cache key.

Example:

Key:

```
emotion_analysis:hash(text)
```

### Cache Lookup

When a new request arrives:

1. Check Redis for the cached analysis.
2. If found → return cached result.
3. If not found:

   * Call the LLM
   * Store result in Redis
   * Return response.

### TTL Strategy

Cached entries can expire after a fixed duration.

Example:

```
TTL = 24 hours
```

This ensures cache freshness.

---

# 4. Protecting Sensitive Journal Data

Journal entries contain highly personal information, so security and privacy are important.

### Transport Security

All communication should use **HTTPS with TLS 1.3** to protect data in transit.

### Authentication

Use **JWT-based authentication** to identify users.

Access control ensures:

* Users can only access their own journal entries.
* API endpoints validate `userId` ownership.

### Encryption at Rest

Sensitive data stored in MongoDB should be encrypted using:

* MongoDB encryption-at-rest
* Optional **field-level encryption** for journal text.

### Secrets Management

Sensitive credentials such as:

* LLM API keys
* Database connection strings

should be stored securely using:

* Environment variables
* Secret managers (AWS Secrets Manager / Vault)

---

# Summary

The system is designed to be scalable, cost-efficient, and secure.

Key architectural principles include:

* Stateless backend services
* Horizontal scaling with containers
* Redis caching to reduce LLM cost
* Asynchronous processing for heavy workloads
* Strong encryption and authentication for sensitive data

This architecture allows the system to grow from a prototype to a production system supporting **100k+ users**.
