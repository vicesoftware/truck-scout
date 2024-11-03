# Deployment Configuration

This document details the deployment configuration and build pipeline for Truck Scout TMS.

## Overview

Our deployment infrastructure consists of several key components working together:

### Build Pipeline
1. GitHub Repository
   - Source code storage
   - Branch protection rules
   - PR workflows

2. Digital Ocean App Platform
   - Automated builds from GitHub
   - Environment-specific deployments
   - Resource management
   - Environment variable management

3. Database Management
   - PostgreSQL database
   - Connection string management
   - Migration handling

## Build Pipeline Details

### Code Flow
1. Local Development
   - Developer works in feature branch
   - Local testing via `npm run test:local:all`
   - Changes committed and pushed

2. Continuous Integration
   - GitHub Actions triggered on PR
   - Runs `npm run ci:check`
   - Type checking and linting
   - Test suite execution

3. Build Process
   - Triggered on merge to main branches
   - Uses Node 20.x (specified in package.json)
   - Leverages build caching via cacheDirectories
   - Build steps:
     1. `npm install`
     2. `npm run build`
     3. Asset optimization
     4. Environment configuration

4. Deployment
   - Digital Ocean App Platform configuration via app.yml
   - Environment-specific variable injection
   - Health check verification
   - Zero-downtime deployment

### Current Implementation Phases

1. Application Configuration Optimization ✅
   - Optimized package.json scripts
   - Build caching configuration
   - Node/npm version specifications

2. Environment Variable Standardization ✅
   - Standardized env vars in app.yml
   - Production vs Development configurations
   - Secure credential management

3. App Spec Template Implementation (Planned)
   - Template-based configuration
   - Environment-specific overrides
   - Standardized service definitions

4. Monitoring Enhancement (Planned)
   - Alert configurations
   - Performance monitoring
   - Error tracking

5. App Spec Optimization (Planned)
   - Service configuration optimization
   - Resource allocation improvements
   - Scaling configurations

## Current Setup

### Environment Configuration

The application uses Digital Ocean's App Platform for deployment, configured via `app.yml`. Key environment variables are managed through the Digital Ocean dashboard and include:

- `NODE_ENV`: Production environment indicator
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: API endpoint configuration
- `ENVIRONMENT`: Deployment environment identifier (local|development|staging|production)
- `BRANCH_NAME`: Source control branch reference

Note: Instance size configuration (basic/professional/professional-l/professional-xl) will be added in a future phase when we implement automated scaling rules. See Future Improvements section for details.

### Build Process

1. **Source Code**
   - Code is pulled from the GitHub repository
   - Branch is determined by deployment environment

2. **Build Stage**
   - Runs `npm run build`
   - Executes in controlled build environment
   - Caches dependencies for faster builds

3. **Runtime Configuration**
   - Uses `npm start` for production server
   - Runs on Node.js 20.x
   - Serves on port 3000

### Resource Management

Resources are allocated based on environment needs:
- Development: Basic resources for testing
- Staging: Moderate resources for QA
- Production: Scaled resources for live traffic

### Database Configuration

PostgreSQL databases are provisioned per environment:
- Automated backups enabled
- Secure connection strings
- Migration handling during deployment

## Deployment Workflow

1. **Code Push**
   - Developer pushes to feature branch
   - PR created for review
   - CI/CD pipeline triggered

2. **Build & Test**
   - Automated tests run
   - Build process executed
   - Environment variables validated

3. **Deployment**
   - App Platform builds container
   - Environment configured
   - Service deployed
   - Health checks performed

4. **Monitoring**
   - Application metrics tracked
   - Error reporting enabled
   - Performance monitored
   - Alerts configured

## Troubleshooting

Common deployment issues and solutions:

1. **Build Failures**
   - Check build logs in Digital Ocean
   - Verify package.json scripts
   - Confirm environment variables

2. **Runtime Errors**
   - Review application logs
   - Check environment configuration
   - Verify database connectivity

3. **Performance Issues**
   - Monitor resource usage
   - Check database queries
   - Review application metrics

## Future Improvements

1. **Infrastructure as Code**
   - Template-based configurations
   - Automated environment setup
   - Consistent deployments

2. **Enhanced Monitoring**
   - Advanced metrics collection
   - Automated scaling rules
   - Comprehensive alerting
   - Instance size configuration (basic/professional/professional-l/professional-xl) for different environments

3. **Security Enhancements**
   - Secret rotation
   - Access control refinement
   - Security scanning integration

## Reference

- [Digital Ocean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PostgreSQL Configuration Guide](https://docs.digitalocean.com/products/databases/postgresql/)
