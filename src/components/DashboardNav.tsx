'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Target, LogOut, Home, ListTodo, Flame } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/goals', label: 'Goals', icon: ListTodo },
    { href: '/streaks', label: 'Streaks', icon: Flame },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">
              RepentDaily
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`transition-all duration-300 ${
                      isActive 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3 bg-secondary/50 rounded-full px-2 md:px-4 py-1.5 md:py-2 border border-border/50">
              <Avatar className="w-6 h-6 md:w-8 md:h-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs md:text-sm">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground font-medium text-xs md:text-sm hidden md:inline truncate max-w-[120px] lg:max-w-none">
                {user?.email || user?.displayName}
              </span>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 md:px-4"
            >
              <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-2 flex items-center space-x-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

