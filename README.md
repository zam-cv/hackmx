# HackMx

HackMx is a platform for hosting hackathons in Mexico.

## Development

### Prerequisites

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [VSCode](https://code.visualstudio.com/download)

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
DATABASE_URL=postgres://admin:awdrqwer12@127.0.0.1:5432/hackmx

POSTGRES_USER=admin
POSTGRES_PASSWORD=awdrqwer12
POSTGRES_DB=hackmx
```

5. Open the project in a container

- Press `F1` and select `Dev Containers: Reopen in Container`

6. Install the project dependencies

- Open a terminal and run the following commands:

```bash
cd platform
npm install

cd page
npm install
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