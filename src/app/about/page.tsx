import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight">
                RepentDaily
              </span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <Link href="/goals-guide" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-xs sm:text-sm hidden md:block">
                Goals Guide
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
      <section className="pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-14 md:pb-16 bg-secondary/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
            About RepentDaily
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            A simple, free goal-setting platform designed to help you grow spiritually, physically, socially, and intellectually through the power of daily repentance and intentional living.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Card className="bg-primary text-primary-foreground border-none shadow-xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground/80 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight">Our Single Purpose</h2>
              <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
                RepentDaily exists for one reason only: to help you repent daily and become more like Jesus Christ. 
                There are no ulterior motives, no hidden agendas, no profit margins—just a sincere desire to help 
                you grow in all four areas of life as taught in Luke 2:52.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Story Behind RepentDaily */}
      <section className="py-12 sm:py-16 bg-secondary/5 border-y border-border">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">The Story Behind RepentDaily</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              This platform is the result of blending inspired teachings from modern prophets, missionary experiences, and youth programs into one cohesive goal-setting methodology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 md:mb-16">
            {/* Creator */}
            <Card className="border border-border bg-card shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Built by Luke Jones</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  As a returned missionary and lifelong member of The Church of Jesus Christ of Latter-day Saints, 
                  I've seen firsthand how powerful goal setting can be when combined with daily repentance and faith in Jesus Christ.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
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
            <Card className="border border-border bg-card shadow-md hover:shadow-lg transition-all">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">A Life-Changing Lesson</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  The core goal-setting methodology came from Kevin Pearson of the Seventy during a zone conference 
                  while I was serving as a missionary. His teachings on the seven critical steps to effective goal 
                  setting transformed how I approach personal growth and have guided me throughout my life.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Inspirations */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
              <CardHeader className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-violet-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Youth Program</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
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

            <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
              <CardHeader className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Daily Repentance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
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

            <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all">
              <CardHeader className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Preach My Gospel</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
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
      <section className="py-12 sm:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <Card className="bg-secondary/30 border border-border shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">Built on Eternal Truth</h2>
              <blockquote className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4 italic font-serif">
                "And Jesus increased in wisdom and stature, and in favour with God and man."
              </blockquote>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">— Luke 2:52</p>
              <p className="text-base sm:text-lg text-foreground leading-relaxed">
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
      <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 tracking-tight">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands who are growing spiritually, physically, socially, and intellectually through 
            the power of daily repentance and intentional goal setting.
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
            className="bg-background text-foreground hover:bg-background/90 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-xl w-full sm:w-auto"
          >
            <Link href="/signup">
              Start Your Journey Free
            </Link>
          </Button>
          <p className="text-primary-foreground/60 text-xs sm:text-sm mt-4">
            100% Free • No Ads • No Hidden Costs • Forever
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
            <p className="text-background/60 mb-4 max-w-md mx-auto">
              Empowering anyone who seeks to do God's will to achieve their goals and grow in all four areas of life.
            </p>
            <p className="text-background/40 text-sm">
              &copy; 2024 RepentDaily. Built with ❤️ for all who desire to follow Christ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 