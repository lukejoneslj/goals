import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AutoHideHeader from '@/components/AutoHideHeader'
import { 
  Target, 
  Heart,
  BookOpen,
  Users,
  ExternalLink,
  Youtube,
  Linkedin,
  Github,
  Quote,
  User,
  Lightbulb
} from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Auto-Hide Navigation */}
      <AutoHideHeader className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RepentDaily
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/goals-guide" className="text-gray-600 hover:text-gray-900 font-medium transition-colors hidden md:block">
                Goals Guide
              </Link>
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </AutoHideHeader>

      {/* Hero Section with top padding for fixed header */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
            About RepentDaily
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A simple, free goal-setting platform designed to help you grow spiritually, physically, socially, and intellectually through the power of daily repentance and intentional living.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <Quote className="w-12 h-12 text-purple-200 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Our Single Purpose</h2>
              <p className="text-xl text-purple-100 leading-relaxed">
                RepentDaily exists for one reason only: to help you repent daily and become more like Jesus Christ. 
                There are no ulterior motives, no hidden agendas, no profit margins—just a sincere desire to help 
                you grow in all four areas of life as taught in Luke 2:52.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Story Behind RepentDaily */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Story Behind RepentDaily</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This platform is the result of blending inspired teachings from modern prophets, missionary experiences, and youth programs into one cohesive goal-setting methodology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Creator */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Built by Luke Jones</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  As a returned missionary and lifelong member of The Church of Jesus Christ of Latter-day Saints, 
                  I've seen firsthand how powerful goal setting can be when combined with daily repentance and faith in Jesus Christ.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.youtube.com/@NCMO-News" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.linkedin.com/in/lukejoneslwj/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/lukejoneslj" target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Missionary Experience */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <Lightbulb className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">A Life-Changing Lesson</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  The core goal-setting methodology came from Kevin Pearson of the Seventy during a zone conference 
                  while I was serving as a missionary. His teachings on the seven critical steps to effective goal 
                  setting transformed how I approach personal growth and have guided me throughout my life.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Inspirations */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Youth Program</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Inspired by the Children and Youth program's focus on growth in all four areas of life.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href="https://www.churchofjesuschrist.org/youth/childrenandyouth/general-overview?lang=eng" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Learn More
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Daily Repentance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Built on President Nelson's powerful teachings about making daily repentance central to our lives.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href="https://www.churchofjesuschrist.org/study/general-conference/2019/04/36nelson?lang=eng" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Read Talk
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Preach My Gospel</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Based on Chapter 8's teachings about accomplishing work through goals and plans.
                </p>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href="https://www.churchofjesuschrist.org/study/manual/preach-my-gospel-2023/16-chapter-8?lang=eng" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    Study Chapter
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Luke 2:52 Foundation */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built on Eternal Truth</h2>
              <blockquote className="text-2xl font-semibold text-gray-800 mb-4 italic">
                "And Jesus increased in wisdom and stature, and in favour with God and man."
              </blockquote>
              <p className="text-lg text-gray-600 mb-6">— Luke 2:52</p>
              <p className="text-lg text-gray-700 leading-relaxed">
                This single verse encapsulates the four areas of growth that RepentDaily focuses on: 
                <strong> Intellectual</strong> (wisdom), <strong>Physical</strong> (stature), 
                <strong>Spiritual</strong> (favour with God), and <strong>Social</strong> (favour with man). 
                By following Christ's pattern of growth, we can become more like Him.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands who are growing spiritually, physically, socially, and intellectually through 
            the power of daily repentance and intentional goal setting.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/signup">
              Start Your Journey Free
            </Link>
          </Button>
          <p className="text-blue-200 text-sm mt-4">
            100% Free • No Ads • No Hidden Costs • Forever
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
              Empowering anyone who seeks to do God's will to achieve their goals and grow in all four areas of life.
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