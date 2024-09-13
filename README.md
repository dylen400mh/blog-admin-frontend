# Blog Post Management Frontend

This is the frontend for managing blog posts. It is designed to create, edit, publish, and manage posts. Comments can also be managed through this interface.

## Features
- Create, edit, and delete blog posts
- Publish and unpublish posts
- View post status (published/unpublished)
- Manage comments (edit, delete)
- JWT authentication for protected actions (If the user is not an Admin, they will be unable to login)

## Technology Stack
- React (with TypeScript)
- Tailwind CSS for styling
- Fetch API to interact with the backend
- JWT Authentication for secure routes

## Pages
### Dashboard
Displays a list of all posts, showing their published status. You can create new posts or edit existing ones by clicking the post.
![image](https://github.com/user-attachments/assets/3772ae91-dd71-4b4d-ab9d-b684bd8b6f60)

### New Post
A form to create a new blog post. You can write the post title, content, and save it as either a published or unpublished post.
![image](https://github.com/user-attachments/assets/ae86241f-98ad-4877-b876-4b8b83c9c465)

### Post/Comment Editing
Allows you to view and manage a post and its comments. You can delete or edit inappropriate comments.
![image](https://github.com/user-attachments/assets/30c83a7b-8e58-45ca-84f5-b12822c1820d)

## Getting Started

### Prerequisites
- Node.js

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/dylen400mh/blog-admin-frontend.git
2. Install dependencies:
   ```bash
   npm install
3. Setup environment variables (create a .env file):
   ```plaintext
   REACT_APP_BASE_URL=your_backend_api_url
4. Run the development server
   ```bash
   npm run start

### Deployment
This application can be deployed on any hosting service for React apps (e.g., Vercel, Netlify). Make sure to configure your environment variables for the production build.

### Demo
You can find a demo of the application deployed in [this video](https://www.youtube.com/watch?v=4OSidLXTCLw)
