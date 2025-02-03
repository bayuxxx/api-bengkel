# Project Setup Guide

## Installation
1. Install the required dependencies:
   ```bash
   npm i
   ```

2. Run the Prisma database migration:
   ```bash
   npx prisma migrate
   ```

3. Seed the database with initial data:
   ```bash
   npm run seed
   ```

4. Start the application:
   ```bash
   node index.js
   ```

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=db_bengkel
DB_PROVIDER=mysql

DATABASE_URL="${DB_PROVIDER}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

JWT_SECRET=your_jwt_secret_here
```

### Environment Variable Descriptions:
- **DB_HOST:** Database server host (default: `localhost`)
- **DB_PORT:** Database server port (default: `3306` for MySQL)
- **DB_USERNAME:** Database username (default: `root`)
- **DB_PASSWORD:** Password for the database (leave empty if no password)
- **DB_NAME:** Name of the database (default: `db_bengkel`)
- **DB_PROVIDER:** Database provider (default: `mysql`)
- **DATABASE_URL:** Full database connection string
- **JWT_SECRET:** Secret key for JWT token generation

## Usage
To use the application:
1. Ensure that the database is running.
2. Run the setup commands mentioned above.
3. Start the server using `node index.js`.

## Notes
- Prisma is required for database migrations.
- Ensure that your `.env` file is correctly configured before starting the application.
