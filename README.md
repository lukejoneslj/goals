# 🎯 Goal Setting App

A beautiful, modern goal setting web application built with Supabase for authentication and data management.

## Features

- ✨ Beautiful, responsive UI with Tailwind CSS
- 🔐 Secure user authentication with Supabase
- 📱 Mobile-friendly design
- 🎯 Goal tracking and management (placeholder UI)
- 📊 Progress visualization (placeholder)
- 🏆 Achievement system (placeholder)

## Project Structure

```
.
├── index.html          # Landing page
├── signup.html         # User registration
├── signin.html         # User login
├── dashboard.html      # Authenticated user dashboard
├── config.js          # Supabase configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js installed on your system
- A Supabase account and project

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Test the authentication:
   - Sign up for a new account
   - Check your email for verification (if email confirmation is enabled)
   - Sign in to access the dashboard

## Supabase Configuration

The app is connected to a Supabase project with the following details:
- **Project URL**: `https://zivunqqfxbrzabjinrjz.supabase.co`
- **Project ID**: `zivunqqfxbrzabjinrjz`

Authentication is handled entirely by Supabase, providing secure user management out of the box.

## Next Steps

This is a foundation for a goal setting app. To extend it, you could add:

1. **Database Schema**: Create tables for goals, progress tracking, etc.
2. **Goal CRUD Operations**: Add, edit, delete, and update goals
3. **Progress Tracking**: Real progress updates and visualization
4. **Notifications**: Reminders and achievement notifications
5. **Analytics**: Goal completion statistics and insights

## Technologies Used

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Development**: http-server for local development

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - see LICENSE file for details. 