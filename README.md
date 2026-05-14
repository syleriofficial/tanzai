# Tanzai AI Supabase V1

Production foundation with:
- Supabase Auth
- Cloud chat history
- Cloud memory
- Feedback buttons
- Syleri Engine API connection
- SQL schema included

## Setup

1. Create Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Cloud Run frontend variables add:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SYLERI_ENGINE_URL=https://engine.syleri.com

5. Deploy.

## Cloud Run

Build command:
npm install && npm run build

Start command:
npm start

Port:
8080
