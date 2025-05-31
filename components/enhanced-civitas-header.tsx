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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import LanguageSelector from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Upload, User, Settings, LogOut, FileText, Menu, Bell, Search } from "lucide-react"

interface EnhancedCivitasHeaderProps {
  onUploadClick?: () => void
}

export default function EnhancedCivitasHeader({ onUploadClick }: EnhancedCivitasHeaderProps) {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="bg-white/95 dark:bg-black backdrop-blur-md border-b border-gray-200 dark:border-black sticky top-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-black opacity-50"></div>
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-navy to-bronze dark:from-bronze dark:to-amber-500 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg dark:shadow-amber-500/20">
                  <FileText className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-bronze dark:from-bronze dark:to-amber-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
              </div>
              <span className="text-2xl font-serif font-bold gradient-text transition-all duration-300 group-hover:scale-105">
                Civitas AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-navy dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-gray-100/50 dark:hover:bg-black group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-navy to-bronze dark:from-black dark:to-black transition-all duration-300 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 rounded-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-9 w-9 rounded-full hover:bg-gray-100/50 dark:hover:bg-black transition-all duration-300 hover:scale-105"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Upload Button */}
            <Button
              onClick={onUploadClick}
              className="hidden sm:flex button-primary rounded-full px-6 py-2 h-9 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>

            {/* Language Selector */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex relative h-9 w-9 rounded-full hover:bg-gray-100/50 dark:hover:bg-black transition-all duration-300 hover:scale-105"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs animate-pulse"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-bronze/20 dark:hover:ring-bronze/30 transition-all duration-300 hover:scale-105 glow-effect"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-bronze/30 transition-all duration-300">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-bronze to-amber-500 text-white font-medium">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 glass-effect border-white/20 dark:border-black dark:bg-black dark:text-white"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:border-black" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center cursor-pointer p-3 hover:bg-gray-100/50 dark:hover:bg-black transition-colors"
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-gray-100/50 dark:hover:bg-black transition-colors">
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:border-black" />
                <div className="md:hidden p-2">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-medium">Language</span>
                    <LanguageSelector variant="compact" />
                  </div>
                  <DropdownMenuSeparator className="dark:border-black my-2" />
                </div>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-600 dark:text-red-400 cursor-pointer p-3 hover:bg-red-50 dark:hover:bg-black transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9 rounded-full hover:bg-gray-100/50 dark:hover:bg-black transition-all duration-300"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-effect dark:border-black p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b dark:border-black">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-navy to-bronze dark:from-bronze dark:to-amber-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg font-serif font-bold gradient-text">Civitas AI</span>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-6">
                    <Button
                      onClick={() => {
                        onUploadClick?.()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full button-primary rounded-xl h-12 text-base font-medium"
                    >
                      <Upload className="h-5 w-5 mr-3" />
                      Upload Document
                    </Button>

                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100/50 dark:hover:bg-black rounded-xl transition-all duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}

                      <div className="pt-4 border-t dark:border-black space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Language</span>
                          <LanguageSelector variant="compact" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Theme</span>
                          <ThemeToggle variant="minimal" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
