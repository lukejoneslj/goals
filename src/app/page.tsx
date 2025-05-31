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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Master Goal Tracker
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Free Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                100% Free • No Ads • No Hidden Costs • Forever
              </Badge>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8">
              Master Your Goals
              <br />
              <span className="text-5xl sm:text-6xl">Transform Your Life</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Built specifically for LDS youth, this goal-tracking platform uses proven principles 
              to help you grow spiritually, physically, socially, and intellectually. Based on Luke 2:52 
              and the seven critical steps to effective goal setting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/signup">
                  Start Your Journey Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Free Forever</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Ads or Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">∞</div>
                <div className="text-sm text-gray-600">Goals & Dreams</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Radically Transparent. Completely Free.
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Let&rsquo;s be brutally honest: Most goal-tracking apps are designed to extract money from you through 
              subscriptions, ads, or selling your data. We&rsquo;re different.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
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
              Our only purpose is to help you succeed. That&rsquo;s it. No ulterior motives, no hidden agendas.
            </p>
          </div>
        </div>
      </section>

      {/* Four Areas of Growth */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Grow in All Four Areas of Life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on Luke 2:52: &ldquo;And Jesus increased in wisdom and stature, and in favour with God and man.&rdquo;
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Seven Steps Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seven Critical Steps to Effective Goal Setting
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven methodology guides you through each step of creating and achieving meaningful goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to keep you motivated and on track toward your goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of LDS youth who are achieving their goals and growing in all four areas of life. 
            Start your journey today—completely free, forever.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/signup">
              Get Started Free Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-blue-200 text-sm mt-4">
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
              <span className="text-xl font-bold text-white">Master Goal Tracker</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering LDS youth to achieve their goals and grow in all four areas of life.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Master Goal Tracker. Built with ❤️ for LDS youth everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
