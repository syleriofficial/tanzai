# Tanzai AI Multimodal V6

Features:
- Voice input using browser SpeechRecognition
- Text-to-speech replies
- Image upload preview
- Image message UI
- Streaming typing effect
- Stop generating button
- Local chat history
- Connected to Syleri Engine

Note:
Current Syleri Engine /api/chat is text-first. Image data is sent in the request, but true vision analysis needs backend multimodal model support.

Deploy:
npm install && npm run build
npm start
Port: 8080
