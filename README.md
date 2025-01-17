# HackMx

HackMx is a platform for hosting hackathons in Mexico.

## Development

### Prerequisites

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [VSCode](https://code.visualstudio.com/download)

## If you are in Windows follow the following additional steps

1. [Install WSL](https://learn.microsoft.com/es-es/windows/wsl/install/)
2. [Install Docker Compose for Windows](https://www.ionos.com/digitalguide/server/configuration/install-docker-compose-on-windows/) You have to run a terminal with administrator permissions

### Getting Started

1. Install the following extensions in VSCode:

- [DevContainers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. Clone the repository

```bash
git clone https://github.com/zam-cv/hackmx
```

3. Change to the project directory

```bash
# Open the project directory in VSCode or use the terminal
code hackmx
```

4. Set environment variables

- Create a `.env` file inside the backend folder and add the following environment variables:

```bash
# backend/.env
RUST_LOG=debug
HOST=0.0.0.0
PORT=8080
DATABASE_URL=postgres://admin:awdrqwer12@database-server:5432/hackmx

ADMIN_DEFAULT_EMAIL=admin@hackmx.mx
ADMIN_DEFAULT_PASSWORD=awdrqwer12

USER_SECRET_KEY=secret
ADMIN_SECRET_KEY=secret2

USER_COOKIE_NAME=token_page
ADMIN_COOKIE_NAME=token_platform

POSTGRES_USER=admin
POSTGRES_PASSWORD=awdrqwer12
POSTGRES_DB=hackmx

SMTP_HOST=smtp-mail.outlook.com
SMTP_USERNAME=test@outlook.com
SMTP_PASSWORD=test
SMTP_SENDER="HackMx <test@outlook.com>"
```

- Create a `.env` file inside the page folder and add the following environment variables:

```bash
# page/.env
VITE_APP_SERVER_PROTOCOL="http"
VITE_APP_SERVER_HOST="0.0.0.0"
VITE_APP_SERVER_PORT=8080
VITE_APP_API_ROUTE="api"
```

- Create a `.env` file inside the platform folder and add the following environment variables:

```bash
# platform/.env
VITE_APP_SERVER_PROTOCOL = "http"
VITE_APP_SERVER_HOST = "0.0.0.0"
VITE_APP_SERVER_PORT = 8080
VITE_APP_API_ROUTE = "api"
```

5. Open the project in a container

- Press `F1` and select `Dev Containers: Reopen in Container`

6. Install the project dependencies

- Open a terminal and run the following commands:

```bash
cd platform
npm install

cd ../page
npm install

cd ../backend
diesel setup
```

7. Start the project

```bash
cd backend
cargo run
```

```bash
cd platform
npm run dev
```

```bash
cd page
npm run dev
```
