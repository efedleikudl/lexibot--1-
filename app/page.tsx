import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Mic, BarChart, FileText, ArrowRight, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold">
                  <span className="gradient-text">Civitas AI</span> – Your Legal Guide
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                  Transform complex legal documents into clear, actionable insights with our AI-powered legal assistant
                  that speaks your language.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="font-medium bg-navy hover:bg-navy/90">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-medium border-navy text-navy hover:bg-navy hover:text-white"
                  >
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Civitas AI Legal Assistant"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Features That Stand Out</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                More than just a document summarizer—Civitas AI is your interactive legal assistant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="feature-card">
                <div className="mb-4 text-navy">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Plain Language Explanations</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Converts complex legal jargon into clear, understandable language that anyone can follow.
                </p>
              </div>

              <div className="feature-card">
                <div className="mb-4 text-navy">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Document Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Click on any highlighted legal element to get instant explanations and context.
                </p>
              </div>

              <div className="feature-card">
                <div className="mb-4 text-navy">
                  <Mic size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Voice-Enabled Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask questions naturally and get audio responses for hands-free legal guidance.
                </p>
              </div>

              <div className="feature-card">
                <div className="mb-4 text-bronze">
                  <BarChart size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Legal Guides</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Transform documents into flowcharts, timelines, and step-by-step visual guides.
                </p>
              </div>

              <div className="feature-card">
                <div className="mb-4 text-bronze">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Actionable Checklists</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized legal task lists with deadlines and priority levels.
                </p>
              </div>

              <div className="feature-card">
                <div className="mb-4 text-bronze">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Document Highlighting</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatically identifies and highlights key clauses, dates, parties, and penalties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Civitas AI makes legal document analysis simple and interactive in just a few steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
                <p className="text-gray-600 dark:text-gray-300">Upload PDF, Word, or image files with legal text.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">Our AI identifies and highlights key legal elements.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-bronze text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Chat</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ask questions and click elements for instant explanations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-bronze text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Action Plan</h3>
                <p className="text-gray-600 dark:text-gray-300">Receive visual guides and actionable checklists.</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button asChild size="lg" className="font-medium bg-navy hover:bg-navy/90">
                <Link href="/dashboard">
                  Try Civitas AI Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
