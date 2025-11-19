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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                RepentDaily
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              <Link href="/goals-guide" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-xs sm:text-sm hidden md:block">
                Goals Guide
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-xs sm:text-sm hidden md:block">
                About
              </Link>
              <Button variant="ghost" asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-3 md:px-4">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm px-2 sm:px-3 md:px-4">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Free Badge */}
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <Badge className="bg-green-100 text-green-800 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">100% Free • No Ads • No Hidden Costs • Forever</span>
                <span className="sm:hidden">100% Free Forever</span>
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8">
              Master Your Goals
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Transform Your Life</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
              Designed for anyone who wants to do God&apos;s will by setting goals and plans. This goal-tracking platform uses proven principles 
              to help you grow spiritually, physically, socially, and intellectually. Based on Luke 2:52 
              and the seven critical steps to effective goal setting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 md:mb-16 px-2">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
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
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto px-2">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">100%</div>
                <div className="text-xs sm:text-sm text-gray-600">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">0</div>
                <div className="text-xs sm:text-sm text-gray-600">Ads or Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">∞</div>
                <div className="text-xs sm:text-sm text-gray-600">Goals & Dreams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Radically Transparent. Completely Free.
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 md:p-8 border border-blue-100">
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Let&apos;s be brutally honest: Most goal-tracking apps are designed to extract money from you through 
              subscriptions, ads, or selling your data. We&apos;re different.
            </p>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 text-left">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">No Subscription Fees</div>
                  <div className="text-sm text-gray-600">Never pay a cent. Ever.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">No Advertisements</div>
                  <div className="text-sm text-gray-600">Zero ads, zero distractions.</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">No Data Selling</div>
                  <div className="text-sm text-gray-600">Your goals stay private.</div>
                </div>
              </div>
            </div>
            <p className="text-base text-gray-600 mt-8 italic">
              Our only purpose is to help you succeed. That&apos;s it. No ulterior motives, no hidden agendas.
            </p>
          </div>
          
          {/* Prominent Goals Guide Link */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-white mr-4" />
              <h3 className="text-3xl font-bold">Complete Goal Mastery Guide</h3>
            </div>
            <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
              Master the seven critical steps to effective goal setting. Learn the proven methodology that transforms dreams into reality.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
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
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Grow in All Four Areas of Life
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Based on Luke 2:52: &ldquo;And Jesus increased in wisdom and stature, and in favour with God and man.&rdquo;
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">🙏 Spiritual</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Faith, values, and character development. Strengthen your relationship with God and develop Christlike attributes.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">💪 Physical</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Health, fitness, and physical well-being. Honor your body as a temple and build healthy habits.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">👥 Social</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Relationships and social connections. Build meaningful friendships and strengthen family bonds.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">🧠 Intellectual</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Learning, skills, and knowledge growth. Develop your mind and acquire valuable skills for life.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two Approaches Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Two Powerful Approaches to Growth
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Whether you&apos;re pursuing major life changes or building simple daily habits, we&apos;ve got you covered.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Goal Setting */}
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">🎯 Seven-Step Goal Setting</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  For your biggest dreams and life-changing aspirations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Perfect for major goals that require planning, strategy, and sustained effort. Whether it&apos;s getting in shape, 
                  advancing your career, strengthening relationships, or deepening your faith—our comprehensive seven-step process 
                  guides you from dream to reality.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-3"><strong>Examples:</strong></p>
                  <ul className="text-sm text-gray-600 space-y-1">
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
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
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
            <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center">
                    <span className="text-4xl">🔥</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">🔥 Daily Streaks</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  For the small, consistent habits that transform your character
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Some of life&apos;s most important practices don&apos;t need elaborate plans—they just need consistency. 
                  Daily Streaks helps you build momentum with simple habits that compound over time, creating lasting change 
                  through small, faithful actions.
                </p>
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-gray-600 mb-3"><strong>Examples:</strong></p>
                  <ul className="text-sm text-gray-600 space-y-1">
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
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
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
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-blue-100">
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                <strong>The beautiful truth:</strong> Both approaches work together. Use goal setting for your big dreams 
                and daily streaks for building character. Small, consistent habits create the foundation for achieving larger aspirations.
              </p>
              <p className="text-base text-gray-600 italic">
                &ldquo;By small and simple things are great things brought to pass.&rdquo; —Alma 37:6
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Steps Process */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Seven Critical Steps to Effective Goal Setting
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Our proven methodology guides you through each step of creating and achieving meaningful goals.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <Badge className="bg-blue-600 text-white mr-3 px-3 py-1 text-sm font-bold">1</Badge>
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Write Down Your Outcome</h3>
              <p className="text-sm text-gray-600">Define exactly what you want to achieve.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Badge className="bg-green-600 text-white mr-3 px-3 py-1 text-sm font-bold">2</Badge>
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Set a Target Date</h3>
              <p className="text-sm text-gray-600">Give yourself a specific deadline.</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center mb-4">
                <Badge className="bg-red-600 text-white mr-3 px-3 py-1 text-sm font-bold">3</Badge>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Identify Obstacles</h3>
              <p className="text-sm text-gray-600">Plan for what might hold you back.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center mb-4">
                <Badge className="bg-yellow-600 text-white mr-3 px-3 py-1 text-sm font-bold">4</Badge>
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">List Resources</h3>
              <p className="text-sm text-gray-600">Identify what will help you succeed.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <Badge className="bg-purple-600 text-white mr-3 px-3 py-1 text-sm font-bold">5</Badge>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Create Detailed Plan</h3>
              <p className="text-sm text-gray-600">Map out your strategy step by step.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <Badge className="bg-orange-600 text-white mr-3 px-3 py-1 text-sm font-bold">6</Badge>
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Take Massive Action</h3>
              <p className="text-sm text-gray-600">Break it into manageable chunks.</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 lg:col-span-2">
              <div className="flex items-center mb-4">
                <Badge className="bg-indigo-600 text-white mr-3 px-3 py-1 text-sm font-bold">7</Badge>
                <MessageCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Know Your Why</h3>
              <p className="text-sm text-gray-600">Understand the deeper purpose behind your goal.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Want to master each step and learn how to stay motivated? Get the complete guide.
            </p>
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
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
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Powerful features designed to keep you motivated and on track toward your goals and daily habits.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <BarChart3 className="w-12 h-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Visual progress bars, completion percentages, and milestone celebrations to keep you motivated.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <ClipboardList className="w-12 h-12 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Action Item Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Break down big goals into actionable tasks with due dates and completion tracking.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Daily Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Build consistent daily habits with streak tracking. Perfect for simple routines that build character over time.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Trophy className="w-12 h-12 text-yellow-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Achievement System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Celebrate your wins and build momentum with our achievement and milestone system.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of people from all walks of life who are achieving their goals and growing in all four areas of life. 
            Start your journey today—completely free, forever.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
          >
            <Link href="/signup">
              Get Started Free Today
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Button>
          <p className="text-blue-200 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
            No credit card required • No hidden fees • Start in 30 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RepentDaily</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering anyone who seeks to do God&apos;s will to achieve their goals and grow in all four areas of life.
            </p>
            
            {/* About Link */}
            <div className="mb-6">
              <Button 
                asChild 
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-all duration-300"
              >
                <Link href="/about">
                  Learn Our Story
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <p className="text-gray-500 text-sm">
              &copy; 2024 RepentDaily. Built with ❤️ for all who desire to follow Christ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
