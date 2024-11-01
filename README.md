<!-- omit in toc -->
# Truck Scout TMS

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Payload CMS Setup](#payload-cms-setup)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
  - [Docker Environment (Recommended for CI/CD)](#docker-environment-recommended-for-cicd)
  - [Local Development Environment](#local-development-environment)
- [AI-Assisted Development](#ai-assisted-development)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Best Practices](#best-practices)
  - [Note](#note)
- [Process for Git Flow](#process-for-git-flow)
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
  - [Best Practices](#best-practices-1)

## Overview

Truck Scout TMS is a [Next.js](https://nextjs.org/) project integrated with [Payload CMS](https://payloadcms.com/) and PostgreSQL. It uses Docker for database management.

> 🤖 **Note:** This project is optomized for [AI-Assisted Development](#ai-assisted-development) so take a look at that section for more information before getting too far into your coding.

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

## Running Tests

### Docker Environment (Recommended for CI/CD)
```bash
# Run tests once (CI mode)
npm run test:api:ci

# Run tests in watch mode
npm run test:api:watch

# Clean up test containers when done
npm run test:api:clean
```

### Local Development Environment
For quick local development, you'll need three terminal windows:

1. Start the test database:
```bash
npm run test:db:up
```

2. Start the Next.js dev server in test mode:
```bash
npm run dev:test
```

3. Run the tests:
```bash
npm run test:api:local
```

4. When finished, clean up:
```bash
npm run test:db:down
```

The test environment uses `.env.test.local` for configuration. Make sure this file contains:
```env
DATABASE_URL=postgresql://tms_test_user:test_password@localhost:5433/tms_test_db
NEXT_PUBLIC_API_URL=http://localhost:3000
TEST_ENV=local
```

## AI-Assisted Development

This project leverages Anthropic's Claude AI for development assistance through the Aider tool, enhancing productivity and code quality.

### Setup

1. Install Aider using pip:
   ```bash
   pip install aider-chat
   ```

2. Create an `aider.conf.yml` file in the project root:
   ```yaml
   anthropic_api_key: your_anthropic_api_key_here
   auto-test: true
   test-cmd: npm run test:local:all
   ```

3. Add your Anthropic API key to the configuration file or set it as an environment variable `ANTHROPIC_API_KEY`. You can get an API key from the [Anthropic Console](https://console.anthropic.com/).

### Usage

1. Start an AI-assisted coding session:
   ```bash
   aider --sonnet --architect --editor-model claude-3-5-sonnet-20241022
   ```

2. Common Aider Commands:
   ```
   /ask    - Ask questions about the code without making changes
             Example: /ask How does the carrier type interface work?

   /add    - Add files to the chat context for Claude to analyze
             Example: /add src/components/carriers/CarrierList.tsx

   /reset  - Clear the chat context and start fresh
             Example: /reset

   /git    - Run git commands or check status
             Example: /git status
             Example: /git commit -m "Update carrier interface"

   /test   - Run the configured test suite
             Example: /test
   ```

3. Workflow Examples:
   - Code Analysis:
     ```
     /add src/components/CarrierForm.tsx
     /ask Can you explain how form validation works in this component?
     ```
   
   - Making Changes:
     ```
     /add src/types/carrier.ts
     I need to add a new field called 'insurance_expiry' to the carrier type
     ```
   
   - Testing Changes:
     ```
     /test
     /git status
     /git commit -m "Add insurance expiry field to carrier type"
     ```

4. Review all proposed changes before accepting them. The configured test command will run automatically after changes.

### Best Practices

- Keep your API key secure and never commit it to version control
- Use specific, clear prompts for best results
- Review all AI-suggested changes carefully
- Commit changes regularly
- Use version control to track AI-assisted modifications

### Note

The `.gitignore` file is already configured to exclude the `aider.conf.yml` file to prevent accidentally committing your API key.

## Process for Git Flow

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

3. When the feature is complete, finish it:
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

This will merge the feature branch into `develop` and delete the feature branch.

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
