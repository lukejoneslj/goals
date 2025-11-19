'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DashboardNav from '@/components/DashboardNav'
import { 
  Target, 
  Heart,
  Dumbbell,
  Users,
  Brain,
  Calendar,
  AlertTriangle,
  Lightbulb,
  FileText,
  MessageCircle,
  Zap,
  Flame,
  Trophy,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  BarChart3
} from 'lucide-react'

const categoryConfig = {
  spiritual: {
    icon: Heart,
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    title: '🙏 Spiritual',
    description: 'Faith, values, and character development'
  },
  physical: {
    icon: Dumbbell,
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    title: '💪 Physical',
    description: 'Health, fitness, and physical well-being'
  },
  social: {
    icon: Users,
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    title: '👥 Social',
    description: 'Relationships and social connections'
  },
  intellectual: {
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    title: '🧠 Intellectual',
    description: 'Learning, skills, and knowledge growth'
  }
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            How RepentDaily Works
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about setting meaningful goals, building consistent habits, and growing in all areas of life.
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 sm:mb-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Welcome to RepentDaily</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  RepentDaily is built on a simple but powerful idea: true growth happens when we intentionally develop ourselves in four key areas of life. 
                  Inspired by Luke 2:52, where Jesus grew in wisdom (intellectual), stature (physical), favor with God (spiritual), and favor with man (social), 
                  this app helps you set meaningful goals and build consistent habits across all four dimensions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're looking to deepen your faith, get in better shape, strengthen relationships, or learn something new, 
                  RepentDaily gives you the tools to track your progress and stay motivated along the way.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Four Categories */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">The Four Areas of Life</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
            Every goal and habit in RepentDaily belongs to one of four categories. This helps you maintain balance and ensure you're growing in all areas, not just one.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const IconComponent = config.icon
              return (
                <Card key={key} className={`border-2 ${config.borderColor} ${config.bgColor} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-5 sm:p-6 text-center">
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

        {/* The 7 Steps */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">The 7 Critical Steps to Effective Goal Setting</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            When you create a goal in RepentDaily, you'll walk through these seven steps. This proven methodology ensures your goals are specific, actionable, and meaningful.
          </p>
          
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-blue-500 text-white text-lg px-3 py-1 flex-shrink-0">1</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-bold text-foreground">Write Down Your Desired OUTCOME</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Start with clarity. What exactly do you want to achieve? Be specific. Instead of "get healthier," 
                      try "lose 20 pounds" or "run a 5K without stopping." The more specific your outcome, the easier it is to track progress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 bg-green-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-green-500 text-white text-lg px-3 py-1 flex-shrink-0">2</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-bold text-foreground">Put a Specific DATE of Accomplishment</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Deadlines create urgency. When do you want to achieve this goal? Pick a real date on the calendar. 
                      This isn't just wishful thinking—it's a commitment. The date helps you break down your goal into manageable chunks and stay on track.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500 bg-red-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-500 text-white text-lg px-3 py-1 flex-shrink-0">3</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-bold text-foreground">Identify the OBSTACLES to Achievement</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Be honest with yourself. What could get in your way? Maybe it's lack of time, money, knowledge, or motivation. 
                      By identifying obstacles upfront, you can plan around them. If you know you'll be busy on weekends, 
                      plan your workouts for weekdays. If money is tight, find free resources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-yellow-500 text-white text-lg px-3 py-1 flex-shrink-0">4</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <h3 className="text-lg font-bold text-foreground">Identify and List the RESOURCES Available to You</h3>
                    </div>
                    <p className="text-muted-foreground">
                      What do you have going for you? This could be books, courses, friends who can help, apps, equipment, 
                      or even your own past experiences. Listing your resources reminds you that you're not starting from zero—you have tools and support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-purple-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-purple-500 text-white text-lg px-3 py-1 flex-shrink-0">5</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-foreground">Establish a DETAILED PLAN or Strategy</h3>
                    </div>
                    <p className="text-muted-foreground">
                      How are you actually going to do this? Break it down. If your goal is to read the Bible daily, 
                      your plan might be: "Read one chapter every morning after breakfast using the YouVersion app." 
                      The more detailed your plan, the less you have to think about it each day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 bg-orange-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-orange-500 text-white text-lg px-3 py-1 flex-shrink-0">6</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-foreground">Take MASSIVE ACTION - Break It Down Into Manageable Chunks</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Big goals can feel overwhelming. That's why you break them into action items—small, specific tasks you can actually complete. 
                      Each action item has its own due date, and as you check them off, you'll see your progress percentage increase. 
                      This is where the rubber meets the road. You're not just planning—you're doing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/30">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-indigo-500 text-white text-lg px-3 py-1 flex-shrink-0">7</Badge>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-foreground">Know WHY You Are Doing It (Leverage)</h3>
                    </div>
                    <p className="text-muted-foreground">
                      This might be the most important step. Why does this goal matter to you? What will achieving it mean for your life? 
                      How will it impact your relationships, your faith, your future? When motivation wanes (and it will), 
                      your "why" is what pulls you back. It's your leverage—the emotional reason that makes the hard work worth it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Goals Page */}
        <section className="mb-8 sm:mb-12">
          <Card className="bg-card border-border">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Your Goals Page</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The Goals page is where you manage all your goals. Here's what you can do:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Create Goals:</strong> Use the 7-step process to set meaningful, actionable goals in any of the four categories.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Track Progress:</strong> Each goal shows your completion percentage, calculated automatically from your action items.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Manage Action Items:</strong> Break your goals into specific tasks with due dates. Check them off as you complete them.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Filter & Search:</strong> Find goals by category, status (active, completed, planning), or search by name.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Update Status:</strong> Mark goals as planning, active, completed, paused, or abandoned as your journey evolves.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Daily Streaks */}
        <section className="mb-8 sm:mb-12">
          <Card className="bg-card border-border">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Daily Streaks & Habits</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    While goals are big-picture achievements, habits are the daily actions that get you there. The Streaks page helps you build consistency.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        Building Habits
                      </h3>
                      <p className="text-muted-foreground">
                        Create habits like "Read Bible for 15 minutes" or "Exercise for 30 minutes" and choose which days of the week you want to do them. 
                        Each time you complete a habit, your streak increases. The longer your streak, the more momentum you build.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        Tracking Streaks
                      </h3>
                      <p className="text-muted-foreground">
                        Your current streak shows how many consecutive days you've completed a habit. Your best streak shows your personal record. 
                        Both help you stay motivated and see your progress over time.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        Categories
                      </h3>
                      <p className="text-muted-foreground">
                        Just like goals, habits can be categorized as spiritual, physical, social, or intellectual. 
                        This helps you see if you're maintaining balance across all areas of life. You can filter habits by category to focus on specific areas.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        Date Selection
                      </h3>
                      <p className="text-muted-foreground">
                        You can view and mark habits complete for any date—today, yesterday, or even future dates. 
                        This is helpful if you forgot to mark something complete or want to plan ahead.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ELO System */}
        <section className="mb-8 sm:mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">The ELO Ranking System</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    RepentDaily uses an ELO ranking system (similar to chess or competitive gaming) to gamify your habit-building journey. 
                    It's a fun way to see your progress and stay motivated.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How It Works</h3>
                      <p className="text-muted-foreground">
                        Every time you complete a habit, you "win" and gain ELO points. Every time you break a streak, you "lose" and lose some points. 
                        Your ELO rating determines your rank, from Bronze III all the way up to Challenger. 
                        The longer your streak when you complete a habit, the more ELO you gain—so consistency really pays off!
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">The Ranks</h3>
                      <p className="text-muted-foreground mb-3">
                        Starting at 1000 ELO (Bronze III), you'll progress through:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                          <div className="font-semibold text-amber-800">Bronze</div>
                          <div className="text-xs text-amber-600">0-1399 ELO</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                          <div className="font-semibold text-slate-800">Silver</div>
                          <div className="text-xs text-slate-600">1400-1699 ELO</div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                          <div className="font-semibold text-yellow-800">Gold</div>
                          <div className="text-xs text-yellow-600">1700-1999 ELO</div>
                        </div>
                        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center">
                          <div className="font-semibold text-cyan-800">Platinum</div>
                          <div className="text-xs text-cyan-600">2000-2299 ELO</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                          <div className="font-semibold text-blue-800">Diamond</div>
                          <div className="text-xs text-blue-600">2300-2599 ELO</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
                          <div className="font-semibold text-purple-800">Master+</div>
                          <div className="text-xs text-purple-600">2600+ ELO</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Win Rate & Progress</h3>
                      <p className="text-muted-foreground">
                        Your dashboard shows your win rate (how often you maintain streaks vs. break them) and your progress toward the next rank. 
                        Don't worry if you lose some ELO—everyone has off days. The important thing is getting back on track and building consistency over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dashboard Overview */}
        <section className="mb-8 sm:mb-12">
          <Card className="bg-card border-border">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Your Dashboard</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    The dashboard is your command center. Here's what you'll see:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Quick Stats:</strong> Total goals, completed goals, active goals, and your average progress across all goals.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Trophy className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Your Habit Rank:</strong> Your current ELO rank and rating, displayed prominently so you always know where you stand.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Today's Focus:</strong> Your top 3 active goals that are due soon or overdue, so you know what needs attention right now.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong className="text-foreground">Quick Actions:</strong> One-click access to create new goals or view your daily streaks.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Getting Started */}
        <section className="mb-8 sm:mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 sm:p-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Now that you understand how everything works, it's time to start your journey. 
                Create your first goal, set up some daily habits, and watch yourself grow in all four areas of life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/goals">
                    View Goals Page
                    <Target className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/streaks">
                    View Streaks Page
                    <Flame className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Luke 2:52 Quote */}
        <Card className="bg-secondary text-secondary-foreground border-none shadow-md">
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

