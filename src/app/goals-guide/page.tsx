import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  ClipboardList, 
  BarChart3, 
  Trophy, 
  Heart,
  Users,
  Brain,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Lightbulb,
  FileText,
  MessageCircle,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shield,
  Flame,
  Mountain,
  Coffee,
  RefreshCw
} from 'lucide-react'

export default function GoalsGuide() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RepentDaily
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/goals-guide" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Goals Guide
              </Link>
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
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
                <Mountain className="w-4 h-4 mr-2" />
                The Complete Guide to Goal Mastery
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8">
              Master Your Goals,
              <br />
              <span className="text-4xl sm:text-5xl">Change Your Life</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's get real about goal setting. Most people fail not because they lack ambition, but because they lack a system. 
              Here's the truth about turning dreams into reality—no fluff, no corporate BS, just what actually works.
            </p>
          </div>
        </div>
      </section>

      {/* Reality Check Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border-l-4 border-red-400 mb-16">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's Be Brutally Honest</h2>
                <p className="text-lg text-gray-700 mb-4">
                  <strong>92% of people</strong> abandon their goals within the first few months. You've probably been there—excited about a new goal, 
                  motivated for a few weeks, then... life happens. You lose steam. You make excuses. You quit.
                </p>
                <p className="text-lg text-gray-700">
                  Here's the thing: <strong>That's completely normal.</strong> The problem isn't you—it's that nobody taught you the actual system 
                  for goal achievement. Time to change that.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Steps Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The 7 Critical Steps That Actually Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This isn't theory—this is the proven system used by high achievers. Follow these steps, and you'll join the 8% who actually reach their goals.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-blue-600 text-lg font-bold px-4 py-2">1</Badge>
                  <Target className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Write Down Your Desired OUTCOME</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Not "I want to be healthier."</strong> That's wishful thinking. Write: <strong>"I want to weigh 165 pounds and run a 5K in under 25 minutes."</strong>
                    </p>
                    <p className="text-gray-600 mb-6">
                      Your brain needs specificity. Vague goals get vague results. Crystal clear goals get crystal clear results.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm font-semibold text-blue-800">Pro Tip:</p>
                      <p className="text-sm text-blue-700">Use numbers, dates, and concrete descriptions. If you can't measure it, you can't manage it.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4">❌ Vague vs ✅ Specific</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="line-through text-gray-500">"Get in shape"</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">"Lose 20 pounds and deadlift 200 lbs by June 1st"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-green-600 text-lg font-bold px-4 py-2">2</Badge>
                  <Calendar className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Put a Specific DATE on It</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>"Someday" is not a day of the week.</strong> Deadlines create urgency. Urgency creates action. No deadline? No urgency. No urgency? No results.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Pick a date that's challenging but realistic. Too easy and you'll procrastinate. Too hard and you'll give up.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-sm font-semibold text-green-800">Reality Check:</p>
                      <p className="text-sm text-green-700">Add 25% more time than you think you need. Life will throw curveballs.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                    <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 mb-2">June 1, 2024</p>
                      <p className="text-sm text-gray-600">Not "this summer" or "eventually"—a real date that you write in your calendar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-red-600 text-lg font-bold px-4 py-2">3</Badge>
                  <AlertTriangle className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Identify Your OBSTACLES</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>What's going to try to stop you?</strong> Be honest. Really honest. Time constraints? Money? Energy? That little voice in your head that says "you can't do this"?
                    </p>
                    <p className="text-gray-600 mb-6">
                      Most people ignore obstacles until they hit them face-first. Smart people identify them early and plan around them.
                    </p>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-sm font-semibold text-red-800">Hard Truth:</p>
                      <p className="text-sm text-red-700">Your biggest obstacle is usually yourself—your habits, fears, and excuses.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4">Common Goal Killers:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>"I don't have time"</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Coffee className="w-4 h-4 text-red-500" />
                        <span>"I'm too tired after work"</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-red-500" />
                        <span>"My family doesn't support this"</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Brain className="w-4 h-4 text-red-500" />
                        <span>"I always quit when it gets hard"</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-yellow-600 text-lg font-bold px-4 py-2">4</Badge>
                  <Lightbulb className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">List Your RESOURCES</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>You have more than you think.</strong> Time, money, skills, connections, knowledge, tools, apps (like this one!). 
                      Write them all down—even the ones that seem obvious.
                    </p>
                    <p className="text-gray-600 mb-6">
                      When you hit obstacles, you'll need to deploy these resources strategically. Can't remember what you have? You can't use what you forget.
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <p className="text-sm font-semibold text-yellow-800">Hidden Resource:</p>
                      <p className="text-sm text-yellow-700">That friend who's already done what you're trying to do. Ask them how.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4">Your Arsenal:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Time slots</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Budget</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Skills</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Network</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Tools & Apps</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Knowledge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 5 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-purple-600 text-lg font-bold px-4 py-2">5</Badge>
                  <FileText className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Create a DETAILED PLAN</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>Break it down until it's stupid simple.</strong> If your plan is "get fit," you'll fail. If your plan is "walk 20 minutes after dinner Monday through Friday," you might actually do it.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Make each step so small that you'd feel silly NOT doing it. Big goals are achieved through tiny, consistent actions.
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <p className="text-sm font-semibold text-purple-800">The 2-Minute Rule:</p>
                      <p className="text-sm text-purple-700">Start with actions that take less than 2 minutes. Build the habit first, then scale up.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4">Planning Hierarchy:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <span className="text-sm font-semibold">Big Goal</span>
                      </div>
                      <div className="flex items-center space-x-3 ml-6">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm">Milestones</span>
                      </div>
                      <div className="flex items-center space-x-3 ml-12">
                        <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                        <span className="text-xs">Weekly actions</span>
                      </div>
                      <div className="flex items-center space-x-3 ml-16">
                        <div className="w-1 h-1 bg-purple-200 rounded-full"></div>
                        <span className="text-xs text-gray-600">Daily habits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 6 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-orange-600 text-lg font-bold px-4 py-2">6</Badge>
                  <Zap className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Take MASSIVE ACTION</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>This is where dreams die or come alive.</strong> You can plan perfectly, but if you don't execute, you have nothing. 
                      Start messy. Start scared. But start.
                    </p>
                    <p className="text-gray-600 mb-6">
                      "Massive" doesn't mean overwhelming yourself. It means consistent, persistent action. A little bit every day beats a lot once in a while.
                    </p>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                      <p className="text-sm font-semibold text-orange-800">Action Beats Perfection:</p>
                      <p className="text-sm text-orange-700">A mediocre plan executed consistently beats a perfect plan that never gets started.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                    <Flame className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">The Action Formula</h4>
                    <div className="text-sm space-y-2">
                      <p><strong>Consistency</strong> &gt; Intensity</p>
                      <p><strong>Progress</strong> &gt; Perfection</p>
                      <p><strong>Starting</strong> &gt; Stalling</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 7 */}
            <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-white text-indigo-600 text-lg font-bold px-4 py-2">7</Badge>
                  <MessageCircle className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Know Your WHY (Leverage)</h3>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-4">
                      <strong>This is your secret weapon.</strong> When motivation fades (and it will), your WHY pulls you through. 
                      It's not just "I want to be healthy"—it's "I want to be here for my daughter's wedding."
                    </p>
                    <p className="text-gray-600 mb-6">
                      Connect your goal to something deeper. Pain motivates more than pleasure, so think about what you'll lose if you don't follow through.
                    </p>
                    <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
                      <p className="text-sm font-semibold text-indigo-800">The WHY Question:</p>
                      <p className="text-sm text-indigo-700">Ask "why" five times in a row to get to your real motivation.</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-4">Finding Your WHY:</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <Heart className="w-4 h-4 text-indigo-500 mt-1" />
                        <span>What will this goal do for the people you love?</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Trophy className="w-4 h-4 text-indigo-500 mt-1" />
                        <span>How will you feel when you achieve this?</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <XCircle className="w-4 h-4 text-indigo-500 mt-1" />
                        <span>What happens if you don't follow through?</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              When Motivation Dies (And It Will)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's talk about the elephant in the room. You're going to lose motivation. You're going to want to quit. Here's how to keep going anyway.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <CardTitle className="text-2xl text-gray-900">The Motivation Myth</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  <strong>Motivation is not reliable.</strong> It comes and goes like the weather. Successful people don't depend on feeling motivated—they depend on systems and habits.
                </p>
                <p className="text-gray-600 mb-4">
                  You don't brush your teeth because you're motivated. You do it because it's a habit. That's how goals should work too.
                </p>
                <div className="bg-red-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-red-800">Reality Check:</p>
                  <p className="text-sm text-red-700">If you only work on your goals when you feel like it, you'll quit within 30 days. Guaranteed.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <CardTitle className="text-2xl text-gray-900">The System Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  <strong>Systems beat motivation every time.</strong> Create an environment that makes success inevitable and failure difficult.
                </p>
                <p className="text-gray-600 mb-4">
                  Use apps like this one. Set reminders. Create accountability. Make it harder to fail than to succeed.
                </p>
                <div className="bg-green-200 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">The Truth:</p>
                  <p className="text-sm text-green-700">Motivation gets you started. Systems keep you going. This app is your system.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
              <CardHeader>
                <RotateCcw className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">It's Okay to Restart</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fell off the wagon? So what. Get back on. The only real failure is not trying again. Every restart is practice for the final success.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Progress &gt; Perfection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Did 80% this week instead of 100%? That's still 80% more than doing nothing. Celebrate small wins—they compound into big victories.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg">
              <CardHeader>
                <RefreshCw className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">The Comeback Kid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your past failures don't define your future success. Every expert was once a beginner. Every champion was once a quitter who got back up.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How This App Helps Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How This App Becomes Your Secret Weapon
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We built this to be your accountability partner, your progress tracker, and your motivation keeper all in one. Here's how it works:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <ClipboardList className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Organizes Everything</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  All 7 steps in one place. Your goals, deadlines, obstacles, resources, and action plans—organized so you can focus on doing instead of remembering.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Tracks Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Visual progress bars show you how far you've come. On rough days, seeing your progress can be the difference between quitting and pushing through.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-gray-900">Keeps You Accountable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Gentle reminders, milestone celebrations, and honest progress tracking. It's like having a coach who never judges but never lets you off the hook.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">But Here's the Hard Truth...</h3>
              <p className="text-xl mb-6 text-blue-100">
                This app can organize everything for you, track your progress, and send you reminders. But it can't do the work for you.
              </p>
              <p className="text-lg text-blue-100">
                <strong>You</strong> have to be accountable. <strong>You</strong> have to be responsible. <strong>You</strong> have to show up—even when you don't feel like it. 
                The app is just your tool. You're the craftsperson.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Your Goals Are Waiting for You
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            You now know the system. You understand what it takes. The only question left is: 
            <strong> Are you ready to stop making excuses and start making progress?</strong>
          </p>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-12">
            <p className="text-lg text-gray-700 italic">
              "When you know how to effectively set meaningful goals, make detailed plans and take massive action, you can achieve almost anything! BE A MASTER PLANNER."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/signup">
                Start Your Journey Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Still 100% free. Still no ads. Still rooting for your success.
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
            <p className="text-gray-400 mb-4">
              Empowering anyone who seeks to do God&apos;s will to achieve their goals and grow in all four areas of life.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 RepentDaily. Built with ❤️ for all who desire to follow Christ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 