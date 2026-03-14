# Architecture

Developer notes for NatureJournal.

### 1. Scaling to 100k users

- **Horizontal Scaling**: Use stateless backend containers (K8s) with a Load Balancer.
- **Database**: Port to MongoDB Sharding for heavy entry volume. 
- **Analysis Service**: Separate the text processing logic into a dedicated microservice to avoid blocking the main API. Use a task queue if processing adds too much latency.
- **CDN**: Serve the frontend via CloudFront/Vercel for better edge performance.

### 2. Cost Management

- **Request Caching**: Cache common phrases in Redis to avoid redundant external API calls.
- **Efficient Processing**: Use lightweight models for basic tasks and reserve heavy processing for detailed summaries.
- **Frontend Throttling**: Limit how often users can trigger analysis to prevent spam.

### 3. Caching Logic

We use **Redis** to speed up repeated queries:

1. **Hashing**: Sanitize and hash the entry text.
2. **Storage**: Store the results using the hash as the key.
3. **Lookup**:
   - Check Redis on every new request.
   - Serve from cache if available.
   - If not, process, store with a TTL, and return.

### 4. Data Security

- **Encryption**: Force TLS 1.3 for all traffic.
- **Auth**: Use JWT for user sessions. Only allow owners to access their own `userId` records.
- **Storage**: Enable encryption-at-rest. For high privacy, use field-level encryption for journal text.
- **Secrets**: Store keys in environment variables or a secret manager.
