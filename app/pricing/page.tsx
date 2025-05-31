"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Check, X, Star, Zap, Crown, FileText, MessageSquare, Sparkles, ArrowRight } from "lucide-react"

interface PricingTier {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  limitations: string[]
  popular?: boolean
  enterprise?: boolean
  icon: React.ReactNode
  color: string
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const pricingTiers: PricingTier[] = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for trying out Civitas AI with basic legal document analysis",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <FileText className="h-6 w-6" />,
      color: "text-gray-600",
      features: [
        "5 document uploads per month",
        "Basic AI analysis",
        "Plain language explanations",
        "Document highlighting",
        "Chat with AI assistant",
        "Export to PDF",
      ],
      limitations: [
        "Limited to 50 AI queries per month",
        "Basic document formats only (PDF, DOCX)",
        "Standard processing speed",
        "Community support only",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      description: "Ideal for legal professionals and frequent users who need advanced features",
      monthlyPrice: 29,
      yearlyPrice: 290,
      popular: true,
      icon: <Star className="h-6 w-6" />,
      color: "text-bronze",
      features: [
        "Unlimited document uploads",
        "Advanced AI analysis with legal precedents",
        "Multi-language translation (12+ languages)",
        "Visual legal guides and flowcharts",
        "Priority processing speed",
        "Advanced document comparison",
        "Custom legal checklists",
        "Email support",
        "Document version history",
        "Bulk document processing",
      ],
      limitations: ["Up to 500 AI queries per month", "Standard integrations"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Comprehensive solution for law firms and organizations with advanced needs",
      monthlyPrice: 99,
      yearlyPrice: 990,
      enterprise: true,
      icon: <Crown className="h-6 w-6" />,
      color: "text-navy",
      features: [
        "Everything in Professional",
        "Unlimited AI queries",
        "Custom AI model training",
        "Advanced security & compliance",
        "SSO integration",
        "API access",
        "White-label options",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom integrations",
        "Advanced analytics dashboard",
        "Team collaboration tools",
        "Custom legal templates",
      ],
      limitations: [],
    },
  ]

  const handleSubscribe = (tierId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      })
      return
    }

    if (tierId === "free") {
      toast({
        title: "You're already on the free plan",
        description: "Start uploading documents to begin using Civitas AI!",
      })
      return
    }

    toast({
      title: "Redirecting to checkout",
      description: `Setting up your ${pricingTiers.find((t) => t.id === tierId)?.name} subscription...`,
    })

    // In a real app, this would redirect to Stripe or another payment processor
    setTimeout(() => {
      toast({
        title: "Subscription activated!",
        description: "Welcome to your new plan. Enjoy the enhanced features!",
      })
    }, 2000)
  }

  const getPrice = (tier: PricingTier) => {
    if (tier.monthlyPrice === 0) return "Free"
    const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice
    const period = isYearly ? "year" : "month"
    return `$${price}/${period}`
  }

  const getSavings = (tier: PricingTier) => {
    if (tier.monthlyPrice === 0) return null
    const monthlyCost = tier.monthlyPrice * 12
    const savings = monthlyCost - tier.yearlyPrice
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { amount: savings, percentage }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-navy/10 to-bronze/10 dark:from-bronze/20 dark:to-amber-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-bronze" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose Your Plan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            <span className="gradient-text">Simple, Transparent Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your legal document analysis needs. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-bronze" />
            <span className={`text-sm font-medium ${isYearly ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => {
            const savings = getSavings(tier)
            return (
              <Card
                key={tier.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  tier.popular
                    ? "ring-2 ring-bronze dark:ring-bronze/50 shadow-lg scale-105"
                    : "hover:shadow-lg hover:-translate-y-1"
                } ${tier.enterprise ? "border-navy dark:border-navy/50" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-bronze to-amber-500 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                )}

                <CardHeader className={`text-center ${tier.popular ? "pt-12" : "pt-6"}`}>
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${
                      tier.id === "free"
                        ? "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
                        : tier.id === "professional"
                          ? "from-bronze to-amber-500"
                          : "from-navy to-blue-700"
                    } flex items-center justify-center`}
                  >
                    <div className={tier.id === "free" ? "text-gray-600" : "text-white"}>{tier.icon}</div>
                  </div>
                  <CardTitle className="text-2xl font-serif">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{tier.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      {getPrice(tier)}
                      {tier.monthlyPrice > 0 && (
                        <span className="text-lg font-normal text-gray-500">{isYearly ? "/year" : "/month"}</span>
                      )}
                    </div>
                    {isYearly && savings && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${savings.amount} ({savings.percentage}% off)
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      What's included
                    </h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {tier.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center text-gray-600 dark:text-gray-400">
                        <X className="h-4 w-4 text-gray-400 mr-2" />
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {tier.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <X className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    className={`w-full ${
                      tier.popular
                        ? "bg-bronze hover:bg-bronze/90 text-white"
                        : tier.enterprise
                          ? "bg-navy hover:bg-navy/90 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
                    }`}
                    size="lg"
                  >
                    {tier.id === "free" ? "Get Started" : `Choose ${tier.name}`}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-4 font-semibold">Features</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Professional</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: "Document Uploads", free: "5/month", pro: "Unlimited", enterprise: "Unlimited" },
                  { feature: "AI Queries", free: "50/month", pro: "500/month", enterprise: "Unlimited" },
                  { feature: "Document Formats", free: "PDF, DOCX", pro: "All formats", enterprise: "All formats" },
                  {
                    feature: "Translation Languages",
                    free: "English only",
                    pro: "12+ languages",
                    enterprise: "12+ languages",
                  },
                  { feature: "Processing Speed", free: "Standard", pro: "Priority", enterprise: "Instant" },
                  { feature: "Support", free: "Community", pro: "Email", enterprise: "24/7 Priority" },
                  { feature: "API Access", free: false, pro: false, enterprise: true },
                  { feature: "Custom Training", free: false, pro: false, enterprise: true },
                  { feature: "SSO Integration", free: false, pro: false, enterprise: true },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        row.enterprise
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change my plan at any time?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay by invoice.",
              },
              {
                question: "Is there a free trial for paid plans?",
                answer:
                  "Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.",
              },
              {
                question: "What happens to my documents if I cancel?",
                answer:
                  "Your documents remain accessible for 30 days after cancellation. You can export them during this period. After 30 days, they are permanently deleted.",
              },
              {
                question: "Do you offer discounts for students or nonprofits?",
                answer:
                  "Yes, we offer 50% discounts for students and qualified nonprofit organizations. Contact our support team to apply.",
              },
              {
                question: "Is my data secure and private?",
                answer:
                  "Absolutely. We use enterprise-grade encryption and never share your documents with third parties. All data is processed securely and stored with bank-level security.",
              },
            ].map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-navy/5 to-bronze/5 dark:from-bronze/10 dark:to-amber-500/10 rounded-2xl p-12">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust Civitas AI for their document analysis needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-bronze hover:bg-bronze/90 text-white px-8">
              <Zap className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 px-8">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
