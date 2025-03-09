# Inventory Manager

## 📌 Project Overview
Inventory Manager is a web application designed to help businesses efficiently track and manage their inventory. It features **role-based access control**, activity logs, and **real-time stock alerts** to improve operational efficiency.

## 🚀 Features
- **Role-Based Access:**
  - 🏢 Store Managers: Full CRUD access (Create, Read, Update, Delete inventory items, manage users, view logs).
  - 👷 Staff Members: Can only view inventory and track stock levels.
- **Activity Logs:** Track changes made by users for transparency.
- **Notifications:** Get **email and in-app alerts** for low-stock items.
- **Authentication:** Secure login/signup using JWT (Google OAuth optional).
- **CRUD Operations:** Easily manage inventory through an intuitive interface.
- **Responsive UI:** A modern, mobile-friendly interface with animations.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT-based auth, Google OAuth (optional)
- **Deployment:** Vercel (Frontend), Render/Heroku (Backend)

## 📂 Folder Structure
```
📦 inventory-manager
 ┣ 📂 client         # React.js frontend
 ┣ 📂 server         # Node.js backend
 ┣ 📜 .gitignore     # Ignore unnecessary files
 ┣ 📜 README.md      # Project documentation
 ┣ 📜 package.json   # Dependencies
 ┗ 📜 LICENSE        # License details
```

## 🚀 Installation & Setup
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/inventory-manager.git
cd inventory-manager
```
### **2️⃣ Install Dependencies**
```sh
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```
### **3️⃣ Setup Environment Variables**
Create a `.env` file inside `server/` and add:
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```
### **4️⃣ Run the Project**
```sh
# Start backend server
cd server
npm start

# Start frontend
cd ../client
npm run dev
```

## 🌍 Deployment
- **Frontend:** Hosted on Vercel → [Live Link](#)
- **Backend:** Hosted on Render/Heroku → [API Docs](#)

## 📌 Roadmap
- [x] Role-based access control ✅
- [x] CRUD operations for inventory ✅
- [ ] Implement Google OAuth 🔄
- [ ] Add unit tests using Jest 🔄
- [ ] Dockerize the application 🔄
- [ ] Implement a dashboard with analytics for inventory trends 📊
- [ ] Add support for barcode scanning for faster inventory management 🔄
- [ ] Introduce multi-language support for better accessibility 🌍
- [ ] Enable export/import functionality for inventory data 📂
- [ ] Optimize performance and reduce API response time 🚀

## 📄 License
This project is licensed under the **MIT License**.

---

💡 **Contributions are welcome!** Feel free to open an issue or submit a pull request. 🚀

