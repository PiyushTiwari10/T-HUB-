# Migrating from Render to Neon Database

This guide will help you migrate your T-HUB application from Render's PostgreSQL to Neon database.

## Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Node.js**: Ensure you have Node.js installed
3. **Environment Variables**: You'll need to set up your environment variables

## Step 1: Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Create a new project
3. Choose a region close to your users
4. Note down your connection string

## Step 2: Update Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Neon Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Server Configuration
PORT=10000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important**: Replace the `DATABASE_URL` with your actual Neon connection string.

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Setup Neon Database

Run the setup script to create all necessary tables:

```bash
npm run setup-neon
```

This will:
- Test the database connection
- Create the `technologies` table
- Create all chat-related tables (`chat_rooms`, `messages`, `chat_room_members`, `message_reactions`)

## Step 5: Populate Database (Optional)

If you have existing data, you can populate the database:

```bash
node populateDB.js
```

## Step 6: Test the Application

Start the development server:

```bash
npm run dev
```

## Key Differences from Render

1. **SSL Configuration**: Neon uses different SSL settings
2. **Connection String**: Neon provides a different connection string format
3. **Performance**: Neon is generally faster and more reliable

## Troubleshooting

### Connection Issues
- Ensure your `DATABASE_URL` is correct
- Check that your Neon database is active
- Verify your IP is not blocked by Neon's firewall

### SSL Issues
- The updated `db.js` handles SSL automatically
- In development, SSL is disabled
- In production, SSL is enabled with proper settings

### Migration Issues
- If tables already exist, the setup script will skip creation
- Check the console output for any error messages

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `PORT` | Server port | `10000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Support

If you encounter issues:
1. Check the Neon documentation: [docs.neon.tech](https://docs.neon.tech)
2. Verify your connection string format
3. Ensure all environment variables are set correctly 