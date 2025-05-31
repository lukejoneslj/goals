# 🎯 RepentDaily - Next.js Edition

> Last deployed: January 31, 2025

A beautiful, modern goal-setting application built with Next.js, TypeScript, and shadcn/ui. Inspired by Luke 2:52, this app helps anyone who wants to do God's will grow in all four areas of life: Spiritual, Physical, Social, and Intellectual.

## ✨ Features

- **📋 Comprehensive Goal Setting**: Follow the 7-step framework for effective goal setting
- **📊 Progress Tracking**: Visual progress bars and milestone tracking
- **🏷️ Categorized Goals**: Organize goals by Spiritual, Physical, Social, and Intellectual categories
- **🔐 Secure Authentication**: Powered by Supabase Auth
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🎨 Modern Interface**: Built with shadcn/ui and Tailwind CSS
- **⚡ Fast & Reliable**: Next.js App Router for optimal performance
- **🙏 Faith-Centered**: Designed for anyone seeking to align their goals with God's will

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd repent-daily
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── signin/           # Authentication pages
│   ├── signup/
│   └── layout.tsx        # Root layout
├── components/
│   └── ui/               # shadcn/ui components
├── hooks/
│   └── useAuth.ts        # Authentication hook
├── lib/
│   ├── supabase.ts       # Supabase client & types
│   └── utils.ts          # Utility functions
└── middleware.ts         # Route protection
```

## 🗄️ Database Schema

The app uses three main tables:

### Goals
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `category` (Enum: spiritual, physical, social, intellectual)
- `status` (Enum: planning, active, completed, paused, abandoned)
- `outcome` (Text) - What you want to achieve
- `target_date` (Date) - When you want to achieve it
- `obstacles` (Text Array) - Potential obstacles
- `resources` (Text Array) - Available resources
- `detailed_plan` (Text) - Your action plan
- `why_leverage` (Text) - Why this goal matters
- `progress_percentage` (Integer 0-100)
- `notes` (Text)
- `created_at`, `updated_at` (Timestamps)

### Action Items
- `id` (UUID, Primary Key)
- `goal_id` (UUID, Foreign Key to goals)
- `action_description` (Text)
- `is_completed` (Boolean)
- `due_date` (Date)
- `completed_at` (Timestamp)

### Progress Updates
- `id` (UUID, Primary Key)
- `goal_id` (UUID, Foreign Key to goals)
- `update_text` (Text)
- `progress_percentage` (Integer 0-100)
- `created_at` (Timestamp)

## 🎨 Design Philosophy

This app is designed for anyone who wants to do God's will by setting meaningful goals and plans. It follows the Luke 2:52 principle of balanced growth:

- **🙏 Spiritual**: Faith, values, purpose, meditation, relationship with God
- **💪 Physical**: Health, fitness, energy, vitality, caring for your body as a temple
- **👥 Social**: Relationships, communication, community, service to others
- **🧠 Intellectual**: Learning, skills, knowledge, wisdom, developing God-given talents

The 7-step goal framework includes:
1. **Outcome** - What specifically you want to achieve
2. **Date** - Specific target date
3. **Obstacles** - What might prevent success
4. **Resources** - What you have to help you succeed
5. **Plan** - Detailed action steps
6. **Why** - Your motivation and leverage
7. **Notes** - Additional thoughts and tracking

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Luke 2:52 and the principle of balanced growth
- Designed for anyone seeking to align their goals with God's will
- Built with amazing tools from Vercel, Supabase, and the React ecosystem
- UI components from shadcn/ui
- Icons from Lucide React

---

**"And Jesus increased in wisdom and stature, and in favour with God and man."** - Luke 2:52
