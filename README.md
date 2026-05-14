# Syleri Admin Dashboard V1

Admin dashboard for Tanzai AI + Syleri Engine.

## Features

- Supabase admin login
- Total users count
- Total chats count
- Total messages count
- Total memories count
- Good/bad feedback count
- Recent messages
- Recent feedback
- Syleri Engine health
- Dataset Builder preview

## Required env variables

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email@example.com

Optional:

VITE_SYLERI_ENGINE_URL=https://engine.syleri.com
VITE_DATASET_BUILDER_URL=https://your-dataset-builder.run.app
VITE_DATASET_ADMIN_TOKEN=your_dataset_admin_token

## Important

This dashboard uses Supabase anon key and RLS. 
For real production, keep admin access restricted by:
- VITE_ADMIN_EMAIL check
- Supabase RLS policies
- deploy dashboard on private/admin domain
- never expose service role key in frontend

## Cloud Run

Build command:
npm install && npm run build

Start command:
npm start

Port:
8080
