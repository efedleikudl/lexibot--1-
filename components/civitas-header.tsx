"use client"

import Link from "next/link"
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
import { Upload, User, Settings, LogOut, FileText } from "lucide-react"

interface CivitasHeaderProps {
  onUploadClick?: () => void
}

export default function CivitasHeader({ onUploadClick }: CivitasHeaderProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-black sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-navy to-bronze rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold gradient-text dark:text-white">Civitas AI</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 dark:text-white hover:text-navy dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-700 dark:text-white hover:text-navy dark:hover:text-white transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={onUploadClick} className="bg-navy hover:bg-navy/90 text-white font-medium dark:bg-black dark:hover:bg-gray-900 dark:text-white border dark:border-black">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full dark:bg-black dark:hover:bg-gray-900 dark:text-white">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                    <AvatarFallback className="bg-bronze text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 dark:bg-black dark:text-white dark:border-black" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-800" />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-800" />
                <DropdownMenuItem onClick={() => signOut()} className="dark:hover:bg-gray-900">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
