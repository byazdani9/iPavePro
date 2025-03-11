# Supabase Troubleshooting Guide

This guide helps diagnose and fix common issues when connecting your iPavePro app to Supabase.

## Common Errors and Solutions

### 1. "Could not find the 'company' column of 'customers' in the schema cache"

**Problem**: The app is trying to save data to a field named `company` but the database table has a field named `company_name`.

**Solution**: 
- Make sure your app code uses `company_name` instead of `company` when saving to Supabase
- Check all models and forms to ensure they use the correct field names

### 2. "Could not find the 'created_at' column of 'customers' in the schema cache"

**Problem**: The app is trying to manually set the `created_at` timestamp, but Supabase is set to handle this automatically.

**Solution**:
- Remove any manual setting of `created_at` in your insert operations
- Let Supabase handle timestamp fields automatically with its default values
- Make sure your SQL schema uses `DEFAULT CURRENT_TIMESTAMP` for timestamp fields

## How to Debug Supabase Issues

When encountering database errors:

1. **Check the error messages in the console**: They usually contain specific information about the problematic field.

2. **Verify your database schema**: 
   - Open the Supabase dashboard
   - Go to the Table Editor to inspect your tables
   - Make sure field names in your app match exactly with column names in Supabase

3. **Use console logging before database operations**:
   ```javascript
   console.log('Data being sent:', data);
   const { data: result, error } = await supabase.from('table').insert(data);
   if (error) console.error('Error details:', error);
   ```

4. **Test with minimal data**: When debugging, try inserting just the minimum required fields first.

## Timestamp Handling

For timestamp fields like `created_at` and `updated_at`:

- Let Supabase handle these automatically
- Set them up in your SQL schema with appropriate defaults
- Don't manually set them in your insert/update operations unless necessary

## Database Schema Reference

The current schema has these fields for customers:

```sql
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Make sure your app's data models match this schema exactly.
