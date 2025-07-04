# 🖊️ Collaborative Whiteboard

A real-time, multi-user collaborative whiteboard web application built with the **MERN Stack** and **Socket.IO**. Users can draw together on a shared canvas, track each other's cursor movements, and see changes in real-time — all without needing authentication.

---

## 🚀 Features

### ✅ Core Functionality
- Join a room with a 6–8 character alphanumeric code
- Auto-creates room if the code doesn’t exist
- Real-time drawing with:
  - Pencil tool
  - Color selection (black, red, blue, green)
  - Adjustable stroke width (2px, 5px, 10px, 15px)
  - Clear canvas
- Real-time cursor tracking for all users in the room
- Displays number of connected users

### 🧠 Technical Highlights
- **Frontend:** React.js (with Context API and hooks)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB for room persistence and drawing data
- **WebSockets:** Powered by Socket.IO
- **Canvas:** HTML5 Canvas API
- **Styling:** CSS

---

## 📁 Project Structure

project-root/
├── client/ # React Frontend
│ ├── src/
│ └── public/
├── server/ # Express Backend
│ ├── models/
│ ├── routes/
│ ├── socket/
│ ├── utils/
│ └── server.js
├── .env
├── .gitignore
├── README.md
└── package.json

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/collaborative-whiteboard.git
cd collaborative-whiteboard
2. Set up the Backend
bash
Copy
Edit
cd server
npm install
Create a .env file in the server/ directory:

env
Copy
Edit
MONGODB_URI=mongodb://localhost:27017/whiteboard
CORS_ORIGIN=http://localhost:3000
PORT=5000
Start the server:

bash
Copy
Edit
npm start
3. Set up the Frontend
bash
Copy
Edit
cd ../client
npm install
Create a .env file in the client/ directory:

env
Copy
Edit
REACT_APP_SOCKET_URL=http://localhost:5000
Start the React app:

bash
Copy
Edit
npm start
🔌 API Endpoints
Method	Endpoint	Description
POST	/api/rooms/join	Join or create a room
GET	/api/rooms/:roomId	Get room data

🔄 Socket Events
🔧 Client ↔ Server
'join-room': Join/create a room

'draw-start', 'draw-move', 'draw-end': Drawing strokes

'set-color', 'set-size': Update tool settings

'clear-canvas': Clear the entire canvas

'cursor-move': Update user cursor position

'user-count': Number of users in room

🧹 Room Cleanup
Rooms inactive for more than 24 hours are automatically deleted by a scheduled cleanup process (runs hourly on the server).

🖼️ Demo Screenshot
(You can insert an image here later once deployed)

🛠️ Future Enhancements (Optional Ideas)
Add user nicknames or avatars

Save canvas snapshots

Undo/redo drawing actions

Export canvas to image/PDF

🧑‍💻 Author
Deepak Singh
B.Tech CSE | Full Stack Developer | MERN, DSA, C++
LinkedIn • GitHub

