
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/15770c0b-47a8-4101-8256-7925008c6bad

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/15770c0b-47a8-4101-8256-7925008c6bad) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase for backend services

## Supabase Row Level Security (RLS) Policies

This project uses Supabase for data storage and retrieval. For secure data access, it's important to set up proper Row Level Security (RLS) policies in your Supabase project.

### Current Tables

- `strains`: This table contains strain data with their properties.

### Setting Up RLS for Public Read Access

If you want to make strain data publicly readable but require authentication for modifications:

```sql
-- Enable RLS on the strains table
ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;

-- Create policy for public reading
CREATE POLICY "Allow public read access" ON public.strains
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own data
CREATE POLICY "Allow authenticated insert" ON public.strains
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow row owners to update/delete their data
CREATE POLICY "Allow owners to update" ON public.strains
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Allow owners to delete" ON public.strains
    FOR DELETE USING (auth.uid() = created_by);
```

### Setting Up User-Specific Data Access

If you want each user to only see their own data:

```sql
-- Enable RLS on the strains table
ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own data
CREATE POLICY "Allow users to read own data" ON public.strains
    FOR SELECT USING (auth.uid() = created_by);

-- Allow users to insert their own data
CREATE POLICY "Allow users to insert own data" ON public.strains
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own data
CREATE POLICY "Allow users to update own data" ON public.strains
    FOR UPDATE USING (auth.uid() = created_by);

-- Allow users to delete their own data
CREATE POLICY "Allow users to delete own data" ON public.strains
    FOR DELETE USING (auth.uid() = created_by);
```

> **Note**: Make sure to add a `created_by` column to your table to use these policies. The column should reference the authenticated user's UUID.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/15770c0b-47a8-4101-8256-7925008c6bad) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
