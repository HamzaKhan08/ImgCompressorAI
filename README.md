# 🪪 Passport Photo Maker (AI-Powered ID Photo Generator)

AI-powered Passport & ID Photo Maker web app that automatically generates passport-compliant photos with face alignment, background removal, and print-ready export. Built with a privacy-first architecture where uploaded images are processed per session and automatically deleted after use.

---

## ✨ Features

- 📤 Drag & drop photo upload  
- 🤖 AI face detection & auto alignment  
- 🧠 Passport compliance auto-scaling  
- 🎨 Background removal & color change  
- ✂️ Smart crop with eye-line & margin guides  
- 🔆 Auto brightness & contrast correction  
- 🧴 Optional skin smoothing  
- 🌍 Multiple country presets (India, US, UK, Schengen, Canada, Aadhaar, Driving License)  
- 📄 Printable sheets (1 / 4 / 8 / 16 copies, A4 layout)  
- 🖼 PNG & JPG export at 300 DPI  
- ↩️ Undo / Redo edits  
- 📱 Fully responsive editor (mobile + desktop)  
- 🌙 Dark mode support  
- ⚠️ Face detection & compliance warnings  
- 🔒 Privacy-first auto image deletion  

---

## 🔐 Privacy & Security

This application stores **no images permanently**.

Uploaded photos are automatically deleted:

- When the user closes the tab  
- When session ends  
- After download  
- After 10 minutes inactivity  
- During scheduled server cleanup  

Privacy implementation:

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
- Deployable to Vercel / Render / AWS  

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
- Eye-line position  
- Background color  

---

## 🖼 Editor Workflow

Upload → Adjust → Background → Size → Download

Editor capabilities:

- Drag / Zoom / Rotate / Scale  
- Face alignment guides  
- Eye-line guides  
- Safe margin overlay  
- Live preview  
- Undo / Redo  

---

## 📁 Project Structure
passport-photo-maker/
│
├── client/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── utils/
│ └── assets/
│
├── server/
│ ├── routes/
│ ├── controllers/
│ ├── services/
│ ├── temp/
│ └── utils/
│
├── docker/
│ ├── Dockerfile.client
│ ├── Dockerfile.server
│ └── docker-compose.yml
│
└── README.md


---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/passport-photo-maker.git
cd passport-photo-maker

cd server
npm install
npm run dev


cd client
npm install
npm run dev

http://localhost:5173

📜 License

MIT License © 2026


Hamza Khan
Full-Stack Developer • AI & SaaS Builder

GitHub: https://github.com/hamzakhan08

Portfolio: https://hamzaayazkhan.netlify.app
