# 🪪 Passport Photo Maker (AI-Powered ID Photo Generator)

A production-ready, privacy-first Passport Size Photo Maker web application that allows users to upload their photo and automatically generate passport-compliant ID photos for multiple countries and document types with AI-assisted face alignment, background removal, and print-ready export.

---

## ✨ Features

- 📤 Drag & drop photo upload  
- 🤖 AI face detection & auto alignment  
- 🧠 Passport compliance auto-scaling  
- 🎨 Background removal & color change  
- ✂️ Smart crop with eye-line & margin guides  
- 🔆 Auto brightness & contrast correction  
- 🧴 Optional skin smoothing  
- 🌍 Multiple country presets (India, US, UK, Schengen, Canada, Aadhaar, DL)  
- 📄 Printable sheets (1 / 4 / 8 / 16 copies, A4 layout)  
- 🖼 PNG & JPG export at 300 DPI  
- ↩️ Undo / Redo edits  
- 📱 Fully responsive editor (mobile + desktop)  
- 🌙 Dark mode toggle  
- ⚠️ Face detection & compliance warnings  
- 🔒 Privacy-first auto image deletion  

---

## 🔐 Privacy & Security

This application is designed with **zero persistent image storage**.

Images are automatically deleted:

- When user closes tab  
- When session ends  
- After download  
- After 10 minutes inactivity  
- On scheduled server cleanup  

Implementation:

- Session-scoped temp folders  
- WebSocket disconnect cleanup  
- Cron deletion job  
- No database image storage  

---

## 🧱 Tech Stack

### Frontend
- React.js + Vite  
- TailwindCSS  
- Framer Motion  
- React Dropzone  
- Konva.js / Fabric.js  

### Backend
- Node.js  
- Express.js  
- Multer  
- Sharp  
- face-api.js / OpenCV  
- Background removal API or local model  

### DevOps
- Docker  
- docker-compose  
- Nginx ready  
- Vercel / Render / AWS deployable  

---

## 🌍 Passport Presets Included

- India Passport  
- US Passport  
- UK Passport  
- Schengen Visa  
- Canada Visa  
- Aadhaar Card  
- Driving License  
- Custom Size  

Each preset defines:

- Width / Height (mm)  
- DPI  
- Head ratio  
- Eye line position  
- Background color  

---

## 🖼 Editor Workflow
