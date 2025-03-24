import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, BarChart3, ArrowRight, Hourglass, Heart, Lightbulb } from "lucide-react"
import Image from "next/image"

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-black mb-2">Time Wealth Guide</h2>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-black">
                  Align Your Time With What Truly Matters
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  In a world of endless distractions, discover how to spend your precious time in alignment with your
                  core values.
                </p>
              </div>
              <div className="flex flex-row">
                <Link href="#why-values">
                  <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white px-8 py-6 text-base rounded-r-none w-[200px]">
                    Learn More
                  </Button>
                </Link>
                <Link href="/onboarding/values-discovery">
                  <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-base rounded-l-none w-[200px]">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square">
              <Image
                src="/images/good-life.jpg"
                alt="A serene scene representing a balanced and fulfilling life"
                fill
                className="object-cover rounded-2xl shadow-xl grayscale"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Values Matter Section */}
      <section id="why-values" className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">The Finite Nature of Time</h2>
            <p className="max-w-[700px] text-gray-600 md:text-lg">
              We all have the same 24 hours each day, but our time on Earth is limited. How we choose to spend this
              precious resource defines our legacy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-gray-100 rounded-full">
                <Hourglass className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Our Limited Time</h3>
              <p className="text-gray-600">
                The average person lives for about 27,375 days. Each day spent misaligned with your values is a day you
                can&apos;t get back.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-gray-100 rounded-full">
                <Heart className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Values as Compass</h3>
              <p className="text-gray-600">
                Your core values serve as an internal compass, guiding your decisions and helping you navigate life&apos;s
                complex choices.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-gray-100 rounded-full">
                <Lightbulb className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Alignment Brings Fulfillment</h3>
              <p className="text-gray-600">
                When your daily activities align with your core values, you experience greater satisfaction, purpose,
                and joy in life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-black text-white">
        <div className="container px-4 md:px-6">
          <blockquote className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-xl md:text-2xl italic">
              &ldquo;How we spend our days is, of course, how we spend our lives. What we do with this hour, and that one, is
              what we are doing.&rdquo;
            </p>
            <cite className="text-gray-300 not-italic">— Annie Dillard</cite>
          </blockquote>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">Your Journey to Aligned Living</h2>
            <p className="max-w-[700px] text-gray-600 md:text-lg">
              Our thoughtfully designed process helps you discover, track, and optimize how you spend your time.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="aspect-video relative bg-gray-50 flex items-center justify-center">
                <Heart className="h-12 w-12 text-black animate-float" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Discover Your Values</h3>
                <p className="text-gray-600 mb-4">
                  Through thoughtful exploration, identify the core values that are most meaningful to you.
                </p>
                <Link href="/onboarding/values-discovery">
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                    Start Discovery
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="aspect-video relative bg-gray-50 flex items-center justify-center">
                <Clock className="h-12 w-12 text-black animate-float" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Track Your Time</h3>
                <p className="text-gray-600 mb-4">
                  Log your activities and connect them to your values, gaining clarity on how you spend your time.
                </p>
                <Link href="/tracker">
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                    Begin Tracking
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="aspect-video relative bg-gray-50 flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-black animate-float" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Gain Valuable Insights</h3>
                <p className="text-gray-600 mb-4">
                  Visualize the alignment between your time and values, empowering you to make mindful adjustments.
                </p>
                <Link href="/insights">
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                    View Insights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="rounded-2xl bg-black p-8 md:p-12 text-white">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Begin Your Journey Toward Aligned Living</h2>
              <p className="text-gray-300 md:text-lg mb-4">
                Every moment is an opportunity to live according to what matters most to you. Don&apos;t let another day slip
                by unexamined.
              </p>
              <Link href="/onboarding/values-discovery">
                <Button className="bg-white text-black hover:bg-gray-100 transition-colors px-8 py-6 text-base">
                  Start Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Clock className="h-5 w-5 text-black mr-2" />
              <span className="text-sm font-medium text-black">Time Wealth Guide</span>
            </div>
            <div className="text-sm text-gray-500">Designed to help you live your values every day</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

