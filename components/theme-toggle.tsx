"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { useDarkMode } from "@/components/dark-mode-provider"

interface ThemeToggleProps {
  variant?: "default" | "minimal"
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme, isDarkMode } = useDarkMode()
  const [isOpen, setIsOpen] = useState(false)

  if (variant === "minimal") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        className="h-9 w-9 rounded-full transition-transform hover:scale-110"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-200 transition-all" />
        ) : (
          <Moon className="h-5 w-5 transition-all" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full transition-all hover:bg-muted/50 dark:hover:bg-muted/20"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 text-yellow-200 transition-all" />
          ) : theme === "light" ? (
            <Sun className="h-5 w-5 text-amber-500 transition-all" />
          ) : (
            <Monitor className="h-5 w-5 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 dark:glass-effect">
        <DropdownMenuItem
          onClick={() => {
            setTheme("light")
            setIsOpen(false)
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="h-4 w-4 text-amber-500" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark")
            setIsOpen(false)
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="h-4 w-4 text-yellow-200" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system")
            setIsOpen(false)
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
