# Deployment Guide

This guide covers how to deploy the Fraud Detection Platform to production environments.

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm, pnpm, or yarn package manager

### Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign up/login

3. Click "New Project" and import your GitHub repository

4. Vercel will automatically detect Next.js and configure the build settings

5. Click "Deploy"

Your application will be live at a unique Vercel URL!

### Environment Variables (Production)

For production deployment, add these environment variables in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

## Docker Deployment

### Build Docker Image

1. Create a `Dockerfile` in the project root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. Build the image:
```bash
docker build -t fraud-detection-platform .
```

3. Run the container:
```bash
docker run -p 3000:3000 fraud-detection-platform
```

## Performance Optimization

### Production Build

Create an optimized production build:
```bash
npm run build
npm start
```

### Cache Configuration

The application includes:
- Next.js automatic code splitting
- Image optimization
- Font optimization
- CSS minification

### Bundle Analysis

To analyze your bundle size:
```bash
npm run build -- --analyze
```

## Database Setup (PostgreSQL)

For persistent data storage:

1. Set up a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE fraud_detection;
```

2. Run migrations:
```bash
psql -U postgres -d fraud_detection -f scripts/init-db.sql
```

3. Update `.env.production`:
```
DATABASE_URL=postgresql://user:password@host:port/fraud_detection
```

4. Update API routes to use database instead of in-memory storage

## Security Considerations

### SSL/TLS
- Vercel automatically provides SSL certificates
- For self-hosted: Use Let's Encrypt or AWS Certificate Manager

### Environment Variables
- Never commit `.env` files
- Use `.env.example` for reference
- Set production variables in deployment platform

### API Rate Limiting
Consider adding rate limiting for production:
```bash
npm install express-rate-limit
```

### Input Validation
- All CSV data is validated before processing
- File size limits can be configured
- Add CSP headers for security

## Monitoring

### Error Tracking
Integrate error tracking service:
```typescript
// Example with Sentry
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring
Monitor key metrics:
- CSV upload time
- Analysis computation time
- Graph rendering performance
- API response times

### Logging
Add structured logging:
```typescript
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  message: 'Analysis started',
  datasetId: id
}));
```

## Scaling Considerations

### Horizontal Scaling
- Stateless API design allows easy scaling
- Store datasets in shared database/storage
- Use Redis for session management

### Vertical Scaling
- Increase server resources for larger datasets
- Optimize graph analysis for memory efficiency
- Consider worker threads for heavy computation

### Database Optimization
- Add indexes on frequently queried columns
- Archive old analysis results
- Implement data retention policies

## Troubleshooting

### High Memory Usage
- Clear old datasets regularly
- Limit graph size in visualization
- Use pagination for large result sets

### Slow Analysis
- Profile the graph-analyzer.ts code
- Consider parallel processing for independent analysis steps
- Cache intermediate results

### Deployment Failures
- Check build logs for errors
- Verify all dependencies are in package.json
- Test locally first with `npm run build`

## CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Health Check Endpoint

Add a health check endpoint for monitoring:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date() });
}
```

## Rollback Strategy

If issues occur in production:

1. Revert to previous commit:
```bash
git revert HEAD
git push
```

2. Redeploy from Vercel dashboard

3. Investigate issues in staging environment

## Support & Maintenance

- Monitor application performance regularly
- Review and update dependencies monthly
- Keep Node.js version current
- Test updates in staging before production deployment

For additional help, refer to:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
