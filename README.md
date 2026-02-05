# POS-System

A Point of Sale (POS) system.

## Features

- Track sales reports
  - Total Sales of Today, Last Month, and All
  - Total Discount of Today, Last Month, and All
  - Comprison of Current Month Sales with Last Month Sales
  - Pie Chart of sales per category
- Process sales transactions
- Add new orders
- Pay order (change status)
- Generate receipts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm
- Docker Engine or PostgreSQL DB

### Installation

```bash
# Clone the repository
git clone https://github.com/Suntoh/LMWN-POS-System

# Navigate to the project directory
cd LMWN-POS-System

# Install dependencies
pnpm install
```

### Set up environment variable

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

### Set up the database:

**Option 1: Using Docker (Recommended)**

```bash
docker compose up
```

**Option 2: Using Existing PostgreSQL Database**
Set up your database connection by configuring environment variables:

Then update the database credentials in `apps/server/.env`.

### Running the Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

See in the console for the URL of the development server. Basically, as shown below.

|   app   |            URL             | Description         |
| :-----: | :------------------------: | ------------------- |
|   web   |   http://localhost:3000    | Landing Client Page |
|   api   |   http://localhost:8080    | Backend API         |
| swagger | http://localhost:8080/docs | API Doc s           |

## Folder Structure

```
POS-System/
├── apps/
|   ├── server/
|   |    ├── src/
|   |    |    ├── controllers/  # Request handlers and business logic
|   |    |    ├── modules/      # Feature modules
|   |    |    ├── routes/       # API route definitions
|   |    |    ├── seed/         # Database seed data
|   |    |    ├── db.js         # Database connection setup
|   |    |    ├── server.js     # Server entry point
|   |    |    └── swagger.js    # API documentation config
|   |    └── .env.example       # Environment variables template
|   └── web/
|        ├── app/               # Pages and route
|        ├── components/        # UI components
|        ├── public/            # Static assets
|        └── .env.example       # Environment variables template
├── packages/                   # Repository Config
├── docker-compose.yaml         # Development Database config
└── README.md                   # Project documentation
```
