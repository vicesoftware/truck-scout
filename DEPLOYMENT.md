# Deployment Configuration <!-- omit in toc -->

This document details the deployment configuration and build pipeline for Truck Scout TMS.

- [Overview](#overview)
  - [Build Pipeline](#build-pipeline)
- [Build Pipeline Details](#build-pipeline-details)
  - [Code Flow](#code-flow)
- [Current Setup](#current-setup)
  - [Environment Configuration](#environment-configuration)
  - [Build Process](#build-process)
- [Deployment Workflow](#deployment-workflow)
- [Reference](#reference)


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

## Current Setup

### Environment Configuration

The application uses Digital Ocean's App Platform for deployment, configured via `app.yml`. Key environment variables are managed through the Digital Ocean dashboard and include:

- `NODE_ENV`: Production environment indicator
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: API endpoint configuration
- `ENVIRONMENT`: Deployment environment identifier
- `BRANCH_NAME`: Source control branch reference

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

## Reference

- [Digital Ocean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PostgreSQL Configuration Guide](https://docs.digitalocean.com/products/databases/postgresql/)
