'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Menu, X, Code, Sparkles, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                API <span className="text-primary">Flow</span> Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#demo" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </Link>
            <Link 
              href="/docs" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Profile */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>

                {/* Dashboard Button */}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

               

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="gap-2">
                    Get Started Free
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="#features" 
              className="block py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#demo" 
              className="block py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link 
              href="/docs" 
              className="block py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            
            {/* User Profile Mobile */}
            {isAuthenticated && user && (
              <div className="py-3 px-4 rounded-lg bg-secondary/30 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-border/40 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2 text-red-500 hover:text-red-600 hover:border-red-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center gap-2">
                      Get Started Free
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}