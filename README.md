<!-- omit in toc -->
# Truck Scout TMS

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Payload CMS Setup](#payload-cms-setup)
- [Running the Application](#running-the-application)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

## Overview

Truck Scout TMS is a [Next.js](https://nextjs.org/) project integrated with [Payload CMS](https://payloadcms.com/) and PostgreSQL. It uses Docker for database management.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the project root with the following content:
   ```
   DATABASE_URI=postgres://tms_user:secure_password_here@localhost:5432/tms_db
   PAYLOAD_SECRET=your_long_random_string_here
   ```
   Replace the values with your desired settings. Note that the database credentials in the `DATABASE_URI` should match those defined in your `docker-compose.yml` file.

## Database Setup

1. Ensure Docker and Docker Compose are installed on your system.

2. Review the `docker-compose.yml` file to ensure the database and pgAdmin settings match your preferences. The file should contain environment variables for:
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `PGADMIN_DEFAULT_EMAIL`
   - `PGADMIN_DEFAULT_PASSWORD`

3. Start the PostgreSQL and pgAdmin services:
   ```bash
   docker-compose up -d
   ```

   This will also automatically seed the database with sample carrier data.

4. Verify the containers are running:
   ```bash
   docker-compose ps
   ```

5. Access pgAdmin:
   - Open your browser and go to `http://localhost:5050`
   - Log in using the email and password set in the `docker-compose.yml` file

6. Connect to the PostgreSQL database in pgAdmin:
   - Right-click on "Servers" in the left panel and select "Create" > "Server"
   - In the "General" tab, name your server (e.g., "TMS Database")
   - In the "Connection" tab, enter:
     - Host name/address: tms_postgres
     - Port: 5432
     - Maintenance database: (the value of POSTGRES_DB from docker-compose.yml)
     - Username: (the value of POSTGRES_USER from docker-compose.yml)
     - Password: (the value of POSTGRES_PASSWORD from docker-compose.yml)

[The rest of the README remains the same...]

## Payload CMS Setup

1. Ensure the `payload.config.js` file is properly configured with your collections and settings.

2. The first time you run the application, Payload will automatically set up the necessary tables in your PostgreSQL database.

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the main application.

3. Access the Payload CMS admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

4. On first run, you'll be prompted to create an admin user for Payload CMS.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Note: When deploying, ensure you set up the necessary environment variables in your deployment platform.