"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useLanguage, supportedLanguages } from "@/lib/language-context"
import { Globe, Check } from "lucide-react"

interface LanguageSelectorProps {
  variant?: "header" | "compact"
}

export default function LanguageSelector({ variant = "header" }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2">
            <span className="mr-1">{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {supportedLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => {
                setLanguage(language)
                setIsOpen(false)
              }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.nativeName}</span>
              </div>
              {currentLanguage.code === language.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          <Globe className="h-4 w-4 mr-2" />
          <span className="mr-1">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Choose Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-1 gap-1 p-1">
          {supportedLanguages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => {
                setLanguage(language)
                setIsOpen(false)
              }}
              className="flex items-center justify-between p-2 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <div>
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{language.name}</div>
                </div>
              </div>
              {currentLanguage.code === language.code && (
                <Badge variant="secondary" className="ml-2">
                  <Check className="h-3 w-3" />
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
