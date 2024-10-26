<!-- omit in toc -->
# Truck Scout TMS

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Payload CMS Setup](#payload-cms-setup)
- [Running the Application](#running-the-application)
- [Git Flow](#git-flow)
  - [Installing Git Flow](#installing-git-flow)
    - [macOS](#macos)
    - [Linux](#linux)
    - [Windows](#windows)
  - [Git Flow Overview](#git-flow-overview)
  - [Working with Features](#working-with-features)
  - [Releases and Hotfixes](#releases-and-hotfixes)
    - [Creating a Release](#creating-a-release)
    - [Finishing a Release](#finishing-a-release)
    - [Starting a Hotfix](#starting-a-hotfix)
    - [Finishing a Hotfix](#finishing-a-hotfix)
  - [Best Practices](#best-practices)
- [Running Tests](#running-tests)
  - [Watch Mode (for development)](#watch-mode-for-development)
  - [Single-Run Mode (for CI/CD)](#single-run-mode-for-cicd)
  - [Note](#note)

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
   DATABASE_URI=postgres://tms_user:secure_password_here@localhost:5432/tms_test_db
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

## Git Flow

We use Git Flow for managing our development workflow. Git Flow provides a structured branching model that helps streamline the process of feature development, releases, and hotfixes.

### Installing Git Flow

Before using Git Flow, you need to install it. Here are instructions for different operating systems:

#### macOS
Using Homebrew:
```bash
brew install git-flow
```

#### Linux
For Ubuntu or Debian-based distributions:
```bash
sudo apt-get install git-flow
```

For Fedora:
```bash
sudo dnf install gitflow
```

#### Windows
Using Chocolatey:
```bash
choco install gitflow-avh
```

Alternatively, you can download and install Git Flow as part of the [Git for Windows](https://gitforwindows.org/) package.

After installation, you can verify that Git Flow is installed by running:
```bash
git flow version
```

### Git Flow Overview

Git Flow defines a strict branching model designed around the project release. It assigns very specific roles to different branches and defines how and when they should interact. For a comprehensive overview of the Git Flow model, refer to [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/).

![Git Flow Model](https://nvie.com/img/git-model@2x.png)

### Working with Features

To start working on a new feature:

1. Create a new feature branch:
   ```bash
   git flow feature start feature_name
   ```
   <details>
   <summary>💡 Equivalent Git commands</summary>

   The `git flow feature start` command is a convenience wrapper that executes the following Git commands under the hood:

   ```bash
   git checkout develop
   git checkout -b feature/feature_name
   ```

   This creates a new branch off of the develop branch with the prefix "feature/".
   </details>

2. Work on your feature, committing changes as usual.

3. Publish your feature branch to the remote repository:
   ```bash
   git flow feature publish feature_name
   ```
   <details>
   <summary>💡 Equivalent Git commands</summary>

   ```bash
   git push -u origin feature/feature_name
   ```

   This pushes your feature branch to the remote repository and sets up tracking.
   </details>

4. Open a Pull Request:
   - Go to your repository on GitHub/GitLab
   - Create a new Pull Request from your feature branch into `develop`
   - Add a descriptive title and description
   - Request reviews from team members
   - Once approved and all checks pass, merge using the platform's UI

When the feature is complete and the PR is merged, clean up locally:
```bash
git flow feature finish feature_name
```
<details>
<summary>💡 Equivalent Git commands</summary>

```bash
git checkout develop
git merge --no-ff feature/feature_name
git branch -d feature/feature_name
```
</details>

### Releases and Hotfixes

For creating releases and hotfixes, refer to the [Git Flow Command Cheatsheet](https://gist.github.com/JamesMGreene/cdd0ac49f90c987e45ac). This resource provides a side-by-side comparison of Git Flow commands and their equivalent raw Git commands, which is particularly helpful for developers familiar with Git but new to Git Flow.

Here are some common Git Flow commands for releases and hotfixes, along with their Git equivalents:

#### Creating a Release

```bash
git flow release start 1.0.0
```
<details>
<summary>💡 Equivalent Git commands</summary>

```bash
git checkout develop
git checkout -b release/1.0.0
```
</details>

#### Finishing a Release

```bash
git flow release finish 1.0.0
```
<details>
<summary>💡 Equivalent Git commands</summary>

```bash
git checkout main
git merge --no-ff release/1.0.0
git tag -a 1.0.0 -m "Version 1.0.0"
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0
```
</details>

#### Starting a Hotfix

```bash
git flow hotfix start 1.0.1
```
<details>
<summary>💡 Equivalent Git commands</summary>

```bash
git checkout main
git checkout -b hotfix/1.0.1
```
</details>

#### Finishing a Hotfix

```bash
git flow hotfix finish 1.0.1
```
<details>
<summary>💡 Equivalent Git commands</summary>

```bash
git checkout main
git merge --no-ff hotfix/1.0.1
git tag -a 1.0.1 -m "Version 1.0.1"
git checkout develop
git merge --no-ff hotfix/1.0.1
git branch -d hotfix/1.0.1
```
</details>

### Best Practices

- Always create feature branches from the `develop` branch.
- Keep feature branches short-lived and focused on a single feature or task.
- Regularly pull changes from `develop` into your feature branch to stay up-to-date.
- Use meaningful and descriptive names for your feature branches.

For more detailed information on Git Flow commands and their usage, refer to the [Git Flow Command Cheatsheet](https://gist.github.com/JamesMGreene/cdd0ac49f90c987e45ac).

## Running Tests

Our project uses Docker Compose for running integration tests. There are two modes available: watch mode for development and single-run mode for CI/CD pipelines.

### Watch Mode (for development)

To run tests in watch mode, which is useful during development as it re-runs tests when files change:

```bash
docker-compose -f docker-compose.test.yml up test
```

This command starts the test environment and runs tests in watch mode, which will automatically re-run tests when files are changed.

### Single-Run Mode (for CI/CD)

To run tests once and exit, which is suitable for CI/CD pipelines:

```bash
TEST_MODE=single docker-compose -f docker-compose.test.yml up --exit-code-from test test
```

This command sets the `TEST_MODE` environment variable to "single", which triggers a one-time test run. The `--exit-code-from test` flag ensures that the Docker Compose command exits with the same code as the test service, which is useful for CI/CD pipelines.

### Running Tests Locally with Docker

There are two ways to run tests locally with a Docker-managed PostgreSQL database:

#### 1. Using Docker Compose for PostgreSQL Only (Recommended for Development)

This method runs only the PostgreSQL container while running the tests directly on your machine:

1. Start the test database:
   ```bash
   npm run test:db:up
   ```

2. Start the Next.js development server in test mode:
   ```bash
   npm run dev:test
   ```

3. Run the tests:
   ```bash
   # Run tests once
   npm run test:api:local
   
   # Or run tests in watch mode
   npm run test:api:local:watch
   ```

4. When finished, clean up:
   ```bash
   npm run test:db:down
   ```

#### 2. Using Full Docker Compose Test Environment

This method runs everything in Docker containers, similar to the CI environment:

1. Run the entire test suite once:
   ```bash
   docker compose -f docker-compose.test.yml up --exit-code-from test test
   ```

2. Clean up when finished:
   ```bash
   docker compose -f docker-compose.test.yml down
   ```

Choose the first method during development for faster feedback cycles and better debugging capabilities. Use the second method to verify everything works in a containerized environment before pushing changes.

### Note

Make sure you have Docker and Docker Compose installed on your system before running these commands. The `docker-compose.test.yml` file should be present in your project root directory.
