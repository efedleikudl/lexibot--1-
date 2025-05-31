"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accessibility } from "lucide-react"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Accessibility className="h-5 w-5 text-navy" />
              <h2 className="text-lg font-serif font-semibold">Accessibility Settings</h2>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              Accessibility settings have been removed in this version.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
