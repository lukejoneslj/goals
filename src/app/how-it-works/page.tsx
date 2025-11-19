'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardNav from '@/components/DashboardNav'
import { 
  Target, 
  Heart,
  Dumbbell,
  Users,
  Brain,
  Flame,
  Trophy,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Award,
  Sparkles
} from 'lucide-react'

const categoryConfig = {
  spiritual: {
    icon: Heart,
    color: 'from-purple-300 to-purple-400',
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-50/50',
    borderColor: 'border-purple-300',
    title: '🙏 Spiritual',
    description: 'Faith, values, and character development'
  },
  physical: {
    icon: Dumbbell,
    color: 'from-rose-300 to-rose-400',
    textColor: 'text-rose-500',
    bgColor: 'bg-rose-50/50',
    borderColor: 'border-rose-300',
    title: '💪 Physical',
    description: 'Health, fitness, and physical well-being'
  },
  social: {
    icon: Users,
    color: 'from-emerald-300 to-emerald-400',
    textColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-300',
    title: '👥 Social',
    description: 'Relationships and social connections'
  },
  intellectual: {
    icon: Brain,
    color: 'from-blue-300 to-blue-400',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-300',
    title: '🧠 Intellectual',
    description: 'Learning, skills, and knowledge growth'
  }
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            How RepentDaily Works
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple guide to setting goals, building habits, and growing in all areas of life.
          </p>
        </div>

        {/* Quick Overview - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Set Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use our proven 7-step process to create meaningful goals across four life areas: spiritual, physical, social, and intellectual.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Build Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track daily habits and build streaks. Every completed habit increases your ELO rating and helps you level up your rank.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-lg transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Compete & Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See how you rank against others, climb from Bronze to Challenger, and enjoy friendly competition that keeps you motivated.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Four Categories */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">Four Areas of Life</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
            Based on Luke 2:52. Every goal and habit belongs to one category to help you maintain balance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const IconComponent = config.icon
              return (
                <Card key={key} className={`border-2 ${config.borderColor} ${config.bgColor} hover:shadow-lg transition-all`}>
                  <CardContent className="p-5 text-center">
                    <div className={`inline-flex p-4 rounded-full ${config.bgColor} mb-4`}>
                      <IconComponent className={`w-8 h-8 ${config.textColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{config.title}</h3>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Main Features - 2 Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Goals Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <CardTitle>Goals & Action Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">The 7-Step Process</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  When creating a goal, you'll walk through: Outcome → Date → Obstacles → Resources → Plan → Action Items → Why
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="font-semibold text-blue-700">1. Outcome</div>
                    <div className="text-blue-600">Be specific</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-100">
                    <div className="font-semibold text-green-700">2. Date</div>
                    <div className="text-green-600">Set deadline</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded border border-red-100">
                    <div className="font-semibold text-red-700">3. Obstacles</div>
                    <div className="text-red-600">Plan ahead</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded border border-yellow-100">
                    <div className="font-semibold text-yellow-700">4. Resources</div>
                    <div className="text-yellow-600">List tools</div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">Action Items</h3>
                <p className="text-sm text-muted-foreground">
                  Break goals into small tasks with due dates. Check them off to see your progress percentage increase automatically.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Streaks Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle>Daily Streaks</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Build Consistent Habits</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create habits like "Read scriptures" or "Exercise 30 min" and choose which days to do them. Mark complete each day to build your streak.
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-2">Track Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See your current streak and best streak. Filter by category to maintain balance across all four areas of life.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitive Features - Highlighted */}
        <Card className="mb-12 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">ELO Rankings & Competition</h2>
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Every habit you complete increases your ELO rating. Climb the ranks from Bronze III to Challenger and see how you compare to others in friendly competition.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      How It Works
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Complete habits to gain ELO points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Longer streaks = more ELO gained</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Your rank updates automatically</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      The Ranks
                    </h3>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-center">
                        <div className="font-semibold text-amber-800">Bronze</div>
                        <div className="text-amber-600">1000-1399</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
                        <div className="font-semibold text-slate-800">Silver</div>
                        <div className="text-slate-600">1400-1699</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
                        <div className="font-semibold text-yellow-800">Gold</div>
                        <div className="text-yellow-600">1700-1999</div>
                      </div>
                      <div className="bg-cyan-50 border border-cyan-200 rounded p-2 text-center">
                        <div className="font-semibold text-cyan-800">Platinum</div>
                        <div className="text-cyan-600">2000-2299</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                        <div className="font-semibold text-blue-800">Diamond</div>
                        <div className="text-blue-600">2300-2599</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded p-2 text-center">
                        <div className="font-semibold text-purple-800">Master+</div>
                        <div className="text-purple-600">2600+</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white/60 rounded-lg border border-purple-200">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Friendly Competition:</strong> Visit the Compete page to see leaderboards, compare your ELO with others, and track your percentile ranking. It's all about personal growth and staying motivated together!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Overview - Simplified */}
        <Card className="mb-12 bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <CardTitle>Your Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Total, completed, and active goals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Average progress across all goals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Your current ELO rank and rating
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Today's Focus</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Top 3 goals due soon or overdue
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Quick actions to create goals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Access to streaks and compete pages
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Create your first goal, build some habits, and start climbing the ranks!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/compete">
                  View Competition
                  <Trophy className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Luke 2:52 Quote */}
        <Card className="mt-12 bg-secondary text-secondary-foreground border-none shadow-md">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-3 sm:mb-4 leading-tight">
              &ldquo;And Jesus increased in wisdom and stature, and in favour with God and man.&rdquo;
            </h2>
            <p className="text-secondary-foreground/80 text-base sm:text-lg md:text-xl mb-2 font-medium">— Luke 2:52</p>
            <p className="text-sm sm:text-base md:text-lg text-secondary-foreground/60 mt-4 sm:mt-6 uppercase tracking-widest font-bold text-xs">
              Spiritual • Physical • Social • Intellectual
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
