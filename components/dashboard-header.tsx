"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { Moon, Sun, Menu, X, Settings, LogOut, User } from "lucide-react"

export default function DashboardHeader() {
  const { user, signOut } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark")
      setIsDarkMode(!isDarkMode)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">LexiBot</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-10 space-x-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/documents"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              >
                Documents
              </Link>
              <Link
                href="/dashboard/history"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              >
                History
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden md:flex">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="/dashboard"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/documents"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documents
            </Link>
            <Link
              href="/dashboard/history"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              History
            </Link>
            <Link
              href="/dashboard/settings"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
            <div className="pt-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
