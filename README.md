# Tanzai AI V11

**Company:** Syleri  
**Product:** Tanzai AI  
**Engine:** Syleri Engine  
**Domain:** tanzaiai.com

## V11 includes
- Premium landing page
- AI chat with OpenRouter backend
- Syleri Engine model routing
- Firebase client config file
- Chat history placeholder
- Stripe checkout API placeholder
- File upload API stub
- Dashboard
- Tools, Agents, Files, History, Settings
- Pricing with checkout button
- Privacy / Terms / Contact
- Google Cloud Run ready Dockerfile

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Google Cloud Run deploy
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tanzai-ai-v11

gcloud run deploy tanzai-ai-v11 \
  --image gcr.io/YOUR_PROJECT_ID/tanzai-ai-v11 \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars OPENROUTER_API_KEY=YOUR_KEY,OPENROUTER_SITE_URL=https://tanzaiai.com,OPENROUTER_APP_NAME="Tanzai AI"
```

## V12 next
- Real Firebase signup/login
- Firestore chat save/list
- Firebase Storage file upload
- Stripe webhook
- Real AI tools execution
