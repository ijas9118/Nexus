# **Nexus**

Welcome to **Nexus**, a blog application where users can read, write, and share tech-related blogs. Join squads specific to tech genres like JavaScript, Python, DevOps, and more. Collaborate with like-minded individuals, access premium content, and even book mentorship sessions with industry experts.

---

## **Features**
- **Blog Creation**: Users can write and publish blogs within their joined squads.
- **Squads**: Join genre-specific squads (e.g., JavaScript, Python, DevOps) to share and access blogs.
- **Premium Content**: Subscribe to access premium blogs and mentorship sessions.
- **Mentorship**: Premium users can book video call sessions with mentors.
- **Mentor Privileges**: Mentors can create premium-only squads and blogs.
- **Social Interaction**: Follow other users, send connection requests, and chat with connected users.
- **Real-Time Chat**: Chat with your connections in real-time using Socket.IO.
- **Secure Payments**: Subscription and payments handled securely using **Stripe**.

---

## **Technologies Used**

### **Frontend**
- **React.js**: Frontend library for building user interfaces.
- **React Router DOM**: For client-side routing.
- **Redux**: State management for the application.
- **TanStack Query**: Data fetching and caching.
- **React Hook Form**: Form handling and validation.
- **Zod**: Schema validation for forms.
- **Shadcn UI**: UI component library.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for API requests.
- **Socket.IO**: Real-time chat functionality.
- **WebRTC**: Video call functionality for mentorship sessions.

### **Backend**
- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Redis**: Caching and session management.
- **JWT (JSON Web Tokens)**: Authentication and authorization.
- **Socket.IO**: Real-time communication for chat.
- **WebRTC**: Video call functionality for mentorship sessions.
- **Inversify**: Dependency injection for clean and modular code.
- **Repository Pattern**: Architecture for separating business logic and data access.
- **Stripe**: Payment processing for subscriptions.
- **Swagger Docs**: API documentation.

### **Dev Tools**
- **ESLint**: Linting for code quality.
- **Prettier**: Code formatting.
- **Vite**: Frontend build tool.

---

## **Project Structure**
The project is divided into two main folders:
1. **Frontend**: Contains the React.js application.
2. **Backend**: Contains the Node.js and Express.js server.

---

## **Getting Started**

### **Prerequisites**
- **Node.js**: Make sure you have Node.js installed on your machine.
- **MongoDB**: Ensure MongoDB is installed and running.
- **Redis**: Install Redis for caching and session management.
- **Stripe Account**: Create a Stripe account for payment processing.

### **Setup Instructions**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ijas9118/Nexus.git
   cd Nexus
   ```

2. **Set Up the Backend**
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Use the `.env.example` file to create your `.env` file:
   
     ```env
     # Server Configuration
     PORT=5000
     CLIENT_URL=http://localhost:5173
      
     # Database Configuration
     MONGO_URI=mongodb://localhost:27017/nexus
      
     # Authentication Secrets
     ACCESS_TOKEN_SECRET=your_access_token_secret
     REFRESH_TOKEN_SECRET=your_refresh_token_secret
      
     # Environment Mode
     NODE_ENV=development
      
     # Google OAuth Credentials
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
      
     # Email Configuration
     USER_EMAIL=your_email@example.com
     APP_PASSWORD=your_email_app_password
      
     # Stripe Configuration
     STRIPE_SECRET_KEY=your_stripe_secret_key
     ```
   - Run the backend server:
     ```bash
     npm run dev
     ```

3. **Set Up the Frontend**
   - Navigate to the `frontend` folder:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Use the `.env.example` file to create your `.env` file:
     ```env
     VITE_API_BASE_URL=http://localhost:3000/api
     ```
   - Run the frontend application:
     ```bash
     npm run dev
     ```

4. **Access the Application**
   - Open your browser and go to `http://localhost:5173` to access the frontend.
   - The backend API will be running on `http://localhost:3000/api`.

---

## **API Documentation**
The API is documented using **Swagger**. After starting the backend server, you can access the API documentation at:
```
http://localhost:3000/api/docs
```

---

## **Key Features in Detail**

### **Blogs and Squads**
- Users can join squads based on their tech interests (e.g., JavaScript, Python, DevOps).
- Blogs can be published within a squad, and only squad members can view and interact with them.
- Premium squads and blogs are accessible only to subscribed users.

### **Mentorship**
- Premium users can book mentorship sessions with mentors.
- Mentors can create premium-only squads and blogs.

### **Social Interaction**
- Users can follow others and send connection requests.
- Once a connection request is accepted, users can chat in real-time using Socket.IO.

### **Payments**
- Subscriptions and payments are handled securely using **Stripe**.

---

## **Contributing**
Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to the branch.
4. Submit a pull request.

---

## **Acknowledgements**
- **Shadcn UI**: For providing beautiful and customizable UI components.
- **Tailwind CSS**: For making styling a breeze.
- **Stripe**: For seamless payment integration.

---

## **Contact**
For any questions or feedback, feel free to reach out:
- **Email**: ahammedijas.official@gmail.com
- **GitHub**: [ijas9118](https://github.com/ijas9118)

---

Enjoy exploring **Nexus**! ✨
