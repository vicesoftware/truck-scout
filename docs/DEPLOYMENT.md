# Deployment Configuration <!-- omit in toc -->

This document details the deployment configuration and build pipeline for Truck Scout TMS.

- [Overview](#overview)
  - [Build Pipeline](#build-pipeline)
- [CI/CD Pipeline Visualization](#cicd-pipeline-visualization)
- [Deployment Process](#deployment-process)
- [Environment Configuration](#environment-configuration)
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

## CI/CD Pipeline Visualization

```mermaid
flowchart TD
    subgraph Local ["Local Development"]
        A([Developer Commits Code]) 
        style A fill:#d1f2d1,stroke:#2e8b57,stroke-width:2px,color:#000
    end

    subgraph GitHub ["GitHub CI"]
        direction TB
        B{Pull Request}
        C[GitHub Actions]
        D[Type Checking]
        E[Linting]
        F[Jest API Tests]
        G[Cypress E2E Tests]
        H{Checks Pass?}
        I[Build Application]
        J[Block Merge]

        style GitHub fill:#e6f2ff,stroke:#4169e1,stroke-width:2px,rx:5,ry:5,color:#000
        style B fill:#b0e0e6,stroke:#4169e1,stroke-width:2px,color:#000
        style C fill:#b0e0e6,stroke:#4169e1,stroke-width:2px,color:#000
        style D fill:#fffacd,stroke:#daa520,stroke-width:2px,color:#000
        style E fill:#fffacd,stroke:#daa520,stroke-width:2px,color:#000
        style F fill:#fffacd,stroke:#daa520,stroke-width:2px,color:#000
        style G fill:#fffacd,stroke:#daa520,stroke-width:2px,color:#000
        style H fill:#dda0dd,stroke:#8a2be2,stroke-width:2px,color:#000
        style I fill:#dda0dd,stroke:#8a2be2,stroke-width:2px,color:#000
        style J fill:#ffb6c1,stroke:#dc143c,stroke-width:2px,color:#000
    end

    subgraph DigitalOcean ["Digital Ocean Deployment"]
        direction TB
        K[Deploy to Environment]
        L[Run Application]
        M[Set Environment Variables]
        N[Health Checks]

        style DigitalOcean fill:#f0f0f0,stroke:#8a2be2,stroke-width:2px,rx:5,ry:5,color:#000
        style K fill:#98fb98,stroke:#2e8b57,stroke-width:2px,color:#000
        style L fill:#98fb98,stroke:#2e8b57,stroke-width:2px,color:#000
        style M fill:#87cefa,stroke:#4169e1,stroke-width:2px,color:#000
        style N fill:#87cefa,stroke:#4169e1,stroke-width:2px,color:#000
    end

    A --> B
    B --> |Trigger CI| C
    C --> D
    C --> E
    C --> F
    C --> G
    D --> H
    E --> H
    F --> H
    G --> H
    H --> |Yes| I
    H --> |No| J
    I --> K
    K --> L
    L --> M
    M --> N
```

## Deployment Process

The deployment process consists of four key stages:

1. **Local Development**
   - Developers work in feature branches
   - Local testing using `npm run test:local:all`
   - Code changes committed and pushed to GitHub

2. **Continuous Integration**
   - GitHub Actions triggered on Pull Request
   - Automated checks:
     * Type checking
     * Linting
     * Jest API tests
     * Cypress E2E tests
   - Build process using Node.js 20.x
   - Caching of dependencies and build artifacts

3. **Build and Deployment**
   - Successful PRs trigger build process
   - Application built using `npm run build`
   - Deployment to Digital Ocean App Platform
   - Environment-specific variables injected
   - Zero-downtime deployment strategy

4. **Post-Deployment**
   - Automated health checks
   - Performance monitoring
   - Error reporting enabled

## Environment Configuration

The application uses Digital Ocean's App Platform with the following key environment variables:

- `NODE_ENV`: Production environment indicator
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: API endpoint configuration
- `ENVIRONMENT`: Deployment environment identifier
- `BRANCH_NAME`: Source control branch reference

**Runtime Configuration**:
- Production server started via `npm start`
- Runs on Node.js 20.x
- Serves on port 3000

## Deployment Workflow

1. **Code Submission**
   - Feature branch development
   - Pull request creation
   - CI/CD pipeline automatically triggered

2. **Validation**
   - Comprehensive automated testing
   - Build process verification
   - Environment variable validation

3. **Deployment**
   - Container build
   - Environment configuration
   - Service deployment
   - Comprehensive health checks

4. **Monitoring**
   - Continuous performance tracking
   - Error reporting
   - Proactive alerting

## Reference

- [Digital Ocean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PostgreSQL Configuration Guide](https://docs.digitalocean.com/products/databases/postgresql/)
