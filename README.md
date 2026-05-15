# Tanzai AI Cloud Memory V1

Features:
- Supabase login/signup
- Supabase chat history
- Supabase cloud memory table
- Memory importance score
- Memory sync across devices
- Syleri Engine prompt includes cloud memory

## Setup

1. Run `supabase/cloud-memory.sql` in Supabase SQL Editor.
2. Edit `src/supabaseClient.js`.
3. Paste your Supabase Publishable key.
4. Deploy to Cloud Run.

## Important

Do NOT paste Supabase Secret key in frontend.
Use only Publishable key.

Cloud Run:
Build command: npm install && npm run build
Start command: npm start
Port: 8080
