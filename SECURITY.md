# Security Notes

1. Never put SUPABASE_SERVICE_ROLE_KEY in this frontend dashboard.
2. This app uses VITE_SUPABASE_ANON_KEY only.
3. Use Supabase RLS for table protection.
4. Deploy admin dashboard to admin.syleri.com or status.syleri.com.
5. Set VITE_ADMIN_EMAIL to your own email.
6. Dataset export endpoint requires DATASET_ADMIN_TOKEN; do not publish it publicly.
7. For production, create backend-only admin APIs for sensitive metrics.
