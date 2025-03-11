# Supabase Setup Guide for iPavePro

This guide will help you set up your Supabase database to work with the iPavePro app.

## 1. Access Your Supabase Project

1. Go to [https://app.supabase.io/](https://app.supabase.io/) and sign in
2. Select your project (URL: `https://dsvgoyeyhjahefrlipjy.supabase.co`)

## 2. Create the Database Schema

1. In the Supabase dashboard, navigate to the "SQL Editor" tab
2. Click "New Query"
3. Copy and paste the contents of the `database-schema.sql` file from this repository
4. Click "Run" to execute the SQL commands

The SQL script will:
- Create the `customers` table with proper fields
- Create the `jobs` table with a foreign key relationship to customers
- Insert sample data for testing

## 3. Verify the Schema

After running the SQL script, you can verify the schema by:

1. Navigate to the "Table Editor" in the Supabase dashboard
2. You should see two tables: `customers` and `jobs`
3. Check that the customers table has the field `customer_id` as its primary key
4. Check that the jobs table has the field `job_id` as its primary key and `customer_id` as a foreign key

## 4. Test the Connection in the App

1. Launch the iPavePro app
2. Navigate to the Customers or Jobs screens
3. The app should now be able to fetch data from your Supabase instance
4. Try creating a new customer or job to test that data can be written to the database

## Troubleshooting

If you encounter issues:

1. Check the app console logs for specific error messages
2. Verify that your Supabase URL and anonymous key in `src/api/supabase.ts` are correct
3. Make sure the tables have the exact field names specified in the schema
4. Ensure your Supabase instance is online and accessible

## Database Schema Overview

### Customers Table
- `customer_id`: UUID (Primary Key)
- `first_name`: Text (Required)
- `last_name`: Text (Required)
- `company`: Text
- `email`: Text
- `phone`: Text
- `address`: Text
- `city`: Text
- `province`: Text
- `postal_code`: Text
- `notes`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Jobs Table
- `job_id`: UUID (Primary Key)
- `customer_id`: UUID (Foreign Key to customers)
- `name`: Text (Required)
- `number`: Text
- `status`: Text (Default: 'lead')
- `description`: Text
- `address`: Text
- `city`: Text
- `province`: Text
- `postal_code`: Text
- `amount`: Decimal
- `start_date`: Date
- `end_date`: Date
- `created_at`: Timestamp
- `updated_at`: Timestamp
