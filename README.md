# OAuth2 with GitHub & Postgres Sessions

This project demonstrates a practical implementation of the OAuth2 authorization code flow using GitHub as the provider, session management using Postgres, all built with Hono.js. This provides a solid foundation for creating secure web applications that authenticate users via third-party services.

## Features

*   **OAuth2 Authorization Code Flow:** Securely authenticates users using GitHub OAuth2.
*   **Session Management:** Stores user session data in a Postgres database.
*   **Hono.js:** Uses the lightweight and efficient Hono.js framework for routing and handling requests.
*   **Environment Configuration:** Utilizes environment variables for sensitive information.

## Prerequisites

Before getting started, ensure you have the following installed:

*   **Node.js (v18 or higher):** [https://nodejs.org](https://nodejs.org)
*   **npm (or yarn/pnpm):** Comes with Node.js.
*   **Postgres:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
*   **GitHub Account:** You'll need a GitHub account to register your OAuth application.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aksbuzz/github-oauth.git
    cd github-oauth
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create a .env file:**
    Copy the contents of `.env.example` to `.env` and fill in your values:

    ```env
    GITHUB_CLIENT_ID=<your_github_client_id>
    GITHUB_CLIENT_SECRET=<your_github_client_secret>

    POSTGRES_HOST=localhost
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    POSTGRES_DB=your_db_name
    ```

    *   **`GITHUB_CLIENT_ID`**: Get this from your GitHub OAuth application settings.
    *   **`GITHUB_CLIENT_SECRET`**: Get this from your GitHub OAuth application settings.
    *   **`POSTGRES_*`**: Your Postgres database credentials.

4.  **Configure GitHub OAuth Application:**

    *   Go to [https://github.com/settings/developers](https://github.com/settings/developers) and register a new OAuth application.
    *   Set the **Homepage URL** to `http://localhost:3000`.
    *   Set the **Authorization callback URL** to `http://localhost:3000/login/github/callback`.
    *   Copy the Client ID and Client Secret and paste them into your `.env` file.

5. **Run schema.sql file**
    This will create the required `session` and `users` table in your postgres database.

## Running the Application

```bash
npm run dev # starts the dev server with hot reloading
```

## Using Docker

You can also use `docker-compose` to run the app

```
docker compose -f "docker-compose.yml" up -d --build
```