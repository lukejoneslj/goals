import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  ClipboardList, 
  BarChart3, 
  Trophy, 
  Heart,
  Dumbbell,
  Users,
  Brain,
  CheckCircle,
  Shield,
  Zap,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Lightbulb,
  FileText,
  MessageCircle
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">
                RepentDaily
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              <Link href="/goals-guide" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-xs sm:text-sm hidden md:block">
                Goals Guide
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-xs sm:text-sm hidden md:block">
                About
              </Link>
              <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-3 md:px-4 hover:bg-secondary">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:opacity-90 text-xs sm:text-sm px-2 sm:px-3 md:px-4 shadow-sm">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Free Badge */}
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">100% Free • No Ads • No Hidden Costs • Forever</span>
                <span className="sm:hidden">100% Free Forever</span>
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tighter mb-4 sm:mb-6 md:mb-8">
              Master Your Goals,
              <br />
              <span className="text-muted-foreground">Transform Your Life</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
              Designed for anyone who wants to do God&apos;s will by setting goals and plans. This goal-tracking platform uses proven principles 
              to help you grow spiritually, physically, socially, and intellectually. Based on Luke 2:52 
              and the seven critical steps to effective goal setting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 md:mb-16 px-2">
              <Button 
                asChild 
                size="lg" 
                className="bg-primary text-primary-foreground hover:opacity-90 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto rounded-full"
              >
                <Link href="/signup">
                  Start Your Journey Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-border text-foreground hover:bg-secondary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium w-full sm:w-auto rounded-full"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto px-2 border-t border-border pt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Free Forever</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">0</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Ads or Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">∞</div>
                <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Goals & Dreams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background border-y border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 tracking-tight">
            Radically Transparent. Completely Free.
          </h2>
          <div className="bg-secondary/30 rounded-2xl p-4 sm:p-6 md:p-8 border border-border">
            <p className="text-base sm:text-lg text-foreground mb-4 sm:mb-6 leading-relaxed">
              Let&apos;s be brutally honest: Most goal-tracking apps are designed to extract money from you through 
              subscriptions, ads, or selling your data. We&apos;re different.
            </p>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 text-left">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold text-foreground">No Fees</div>
                  <div className="text-sm text-muted-foreground">Never pay a cent. Ever.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold text-foreground">No Ads</div>
                  <div className="text-sm text-muted-foreground">Zero ads, zero distractions.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-bold text-foreground">No Data Selling</div>
                  <div className="text-sm text-muted-foreground">Your goals stay private.</div>
                </div>
              </div>
            </div>
            <p className="text-base text-muted-foreground mt-8 italic">
              Our only purpose is to help you succeed. That&apos;s it. No ulterior motives, no hidden agendas.
            </p>
          </div>
          
          {/* Prominent Goals Guide Link */}
          <div className="mt-12 bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 mr-4" />
              <h3 className="text-3xl font-bold">Complete Goal Mastery Guide</h3>
            </div>
            <p className="text-xl text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Master the seven critical steps to effective goal setting. Learn the proven methodology that transforms dreams into reality.
            </p>
            <Button 
              asChild 
              size="lg"
              variant="secondary"
              className="text-secondary-foreground font-bold px-8 py-4 text-lg shadow-md"
            >
              <Link href="/goals-guide">
                Read the Complete Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Four Areas of Growth */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              Grow in All Four Areas of Life
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Based on Luke 2:52: &ldquo;And Jesus increased in wisdom and stature, and in favour with God and man.&rdquo;
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center">
                    <Heart className="w-8 h-8 text-violet-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">🙏 Spiritual</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground text-base">
                  Faith, values, and character development. Strengthen your relationship with God and develop Christlike attributes.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-rose-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">💪 Physical</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground text-base">
                  Health, fitness, and physical well-being. Honor your body as a temple and build healthy habits.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">👥 Social</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground text-base">
                  Relationships and social connections. Build meaningful friendships and strengthen family bonds.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">🧠 Intellectual</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground text-base">
                  Learning, skills, and knowledge growth. Develop your mind and acquire valuable skills for life.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two Approaches Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              Two Powerful Approaches to Growth
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Whether you&apos;re pursuing major life changes or building simple daily habits, we&apos;ve got you covered.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Goal Setting */}
            <Card className="hover:shadow-lg transition-all duration-300 bg-secondary/10 border border-border group">
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">🎯 Seven-Step Goal Setting</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  For your biggest dreams and life-changing aspirations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-foreground leading-relaxed">
                  Perfect for major goals that require planning, strategy, and sustained effort. Whether it&apos;s getting in shape, 
                  advancing your career, strengthening relationships, or deepening your faith—our comprehensive seven-step process 
                  guides you from dream to reality.
                </p>
                <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                  <p className="text-sm text-foreground mb-3 font-semibold">Examples:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• Complete a degree or certification</li>
                    <li>• Run a marathon or lose 30 pounds</li>
                    <li>• Read the entire Book of Mormon</li>
                    <li>• Build an emergency fund of $10,000</li>
                    <li>• Strengthen your marriage relationship</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center pt-4">
                  <Button 
                    asChild 
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Link href="/goals-guide">
                      Learn the Seven Steps
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Streaks */}
            <Card className="hover:shadow-lg transition-all duration-300 bg-orange-50/30 border border-orange-100 group">
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-4xl">🔥</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">🔥 Daily Streaks</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  For the small, consistent habits that transform your character
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-foreground leading-relaxed">
                  Some of life&apos;s most important practices don&apos;t need elaborate plans—they just need consistency. 
                  Daily Streaks helps you build momentum with simple habits that compound over time, creating lasting change 
                  through small, faithful actions.
                </p>
                <div className="bg-card rounded-lg p-4 border border-orange-100 shadow-sm">
                  <p className="text-sm text-foreground mb-3 font-semibold">Examples:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• Daily scripture study and prayer</li>
                    <li>• Take vitamins or medications</li>
                    <li>• Clean up before bed each night</li>
                    <li>• Write in a gratitude journal</li>
                    <li>• Call a family member or friend</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center pt-4">
                  <Button 
                    asChild 
                    variant="outline"
                    className="border-orange-500/20 text-orange-600 hover:bg-orange-50"
                  >
                    <Link href="/signup">
                      Start Building Streaks
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="bg-secondary/20 rounded-2xl p-8 border border-border max-w-3xl mx-auto">
              <p className="text-lg text-foreground mb-4 leading-relaxed">
                <strong>The beautiful truth:</strong> Both approaches work together. Use goal setting for your big dreams 
                and daily streaks for building character. Small, consistent habits create the foundation for achieving larger aspirations.
              </p>
              <p className="text-base text-muted-foreground italic">
                &ldquo;By small and simple things are great things brought to pass.&rdquo; —Alma 37:6
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Steps Process */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              Seven Critical Steps to Effective Goal Setting
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Our proven methodology guides you through each step of creating and achieving meaningful goals.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center mb-4">
                <Badge variant="default" className="bg-primary text-primary-foreground mr-3 px-2.5 py-0.5 text-xs font-bold">1</Badge>
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Write Down Your Outcome</h3>
              <p className="text-sm text-muted-foreground">Define exactly what you want to achieve.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground mr-3 px-2.5 py-0.5 text-xs font-bold border border-border">2</Badge>
                <Calendar className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Set a Target Date</h3>
              <p className="text-sm text-muted-foreground">Give yourself a specific deadline.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="bg-red-50 text-red-700 mr-3 px-2.5 py-0.5 text-xs font-bold border border-red-100">3</Badge>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Identify Obstacles</h3>
              <p className="text-sm text-muted-foreground">Plan for what might hold you back.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 mr-3 px-2.5 py-0.5 text-xs font-bold border border-amber-100">4</Badge>
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">List Resources</h3>
              <p className="text-sm text-muted-foreground">Identify what will help you succeed.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="bg-violet-50 text-violet-700 mr-3 px-2.5 py-0.5 text-xs font-bold border border-violet-100">5</Badge>
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Create Detailed Plan</h3>
              <p className="text-sm text-muted-foreground">Map out your strategy step by step.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 mr-3 px-2.5 py-0.5 text-xs font-bold border border-orange-100">6</Badge>
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Take Massive Action</h3>
              <p className="text-sm text-muted-foreground">Break it into manageable chunks.</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm lg:col-span-2">
              <div className="flex items-center mb-4">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 mr-3 px-2.5 py-0.5 text-xs font-bold border border-indigo-100">7</Badge>
                <MessageCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Know Your Why</h3>
              <p className="text-sm text-muted-foreground">Understand the deeper purpose behind your goal.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Want to master each step and learn how to stay motivated? Get the complete guide.
            </p>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="border-primary/20 text-primary hover:bg-primary/5 px-8"
            >
              <Link href="/goals-guide">
                Read the Complete Goal Mastery Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Powerful features designed to keep you motivated and on track toward your goals and daily habits.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <BarChart3 className="w-12 h-12 text-primary/80" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Visual progress bars, completion percentages, and milestone celebrations to keep you motivated.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <ClipboardList className="w-12 h-12 text-emerald-600/80" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Action Item Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Break down big goals into actionable tasks with due dates and completion tracking.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    🔥
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Daily Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Build consistent daily habits with streak tracking. Perfect for simple routines that build character over time.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300 border border-border bg-card">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Trophy className="w-12 h-12 text-amber-500/80" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Achievement System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Celebrate your wins and build momentum with our achievement and milestone system.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
            Ready to Transform Your Life?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of people from all walks of life who are achieving their goals and growing in all four areas of life. 
            Start your journey today—completely free, forever.
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="bg-background text-foreground hover:bg-background/90 px-8 py-4 text-lg font-bold shadow-xl w-full sm:w-auto"
          >
            <Link href="/signup">
              Get Started Free Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-primary-foreground/60 text-xs sm:text-sm mt-4 px-2">
            No credit card required • No hidden fees • Start in 30 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background border-t border-border/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">RepentDaily</span>
            </div>
            <p className="text-background/60 mb-6 max-w-md mx-auto">
              Empowering anyone who seeks to do God&apos;s will to achieve their goals and grow in all four areas of life.
            </p>
            
            {/* About Link */}
            <div className="mb-8">
              <Button 
                asChild 
                variant="outline"
                size="sm"
                className="border-background/20 text-background hover:bg-background/10 hover:text-white transition-all duration-300 bg-transparent"
              >
                <Link href="/about">
                  Learn Our Story
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <p className="text-background/40 text-sm">
              &copy; 2024 RepentDaily. Built with ❤️ for all who desire to follow Christ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
