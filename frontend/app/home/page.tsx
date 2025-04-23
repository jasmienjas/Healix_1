import Link from "next/link"
import { ArrowRight, Calendar, ChevronRight, Phone } from "lucide-react"
import ContactModal from "@/components/home/contact-window"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-950 to-navy-900 text-white">
        <div className="container px-4 py-20 md:py-28 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Advanced Healthcare <span className="text-blue-400">Solutions</span>
              </h1>
              <p className="max-w-[600px] text-navy-100 md:text-xl">
                Healix provides exceptional medical care with a focus on patient comfort and cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Book an Appointment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="bg-navy-700 border-navy-700 text-white hover:bg-navy-800">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative mx-auto lg:ml-auto flex items-center justify-center">
              <div className="medical-emblem">
                <div className="pulse-ring"></div>
                <div className="emblem-container">
                  <div className="cross">
                    <div className="cross-vertical"></div>
                    <div className="cross-horizontal"></div>
                  </div>
                  <div className="circle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="bg-white py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Excellence in Healthcare</h2>
            <p className="mt-4 text-lg text-navy-600">
              Providing exceptional medical services with a commitment to patient care and innovation
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 items-start">
            {[
              {
                title: "Patient-Centered Care",
                description: "We prioritize your comfort and well-being throughout your healthcare journey.",
                icon: "🏥",
              },
              {
                title: "Advanced Technology",
                description:
                  "Our facilities are equipped with the latest medical technology for accurate diagnostics and treatment.",
                icon: "🔬",
              },
              {
                title: "Expert Medical Team",
                description: "Our board-certified physicians bring years of experience and specialized knowledge.",
                icon: "👨‍⚕️",
              },
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-md bg-white">
                <CardContent className="p-8">
                  <div className="mb-6 text-3xl">{feature.icon}</div>
                  <h3 className="mb-3 text-xl font-bold text-navy-900">{feature.title}</h3>
                  <p className="text-navy-600">{feature.description}</p>
                  <Link
                    href="#"
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy-50 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Our Impact</h2>
            <p className="mt-4 text-lg text-navy-600">Delivering exceptional healthcare outcomes for our patients</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "100+", label: "Expert Physicians" },
              { number: "25,000+", label: "Patients Served" },
              { number: "15+", label: "Years of Excellence" },
              { number: "99%", label: "Patient Satisfaction" },
            ].map((stat, i) => (
              <Card key={i} className="overflow-hidden border-none bg-white shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</p>
                  <p className="text-navy-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Patient Testimonials</h2>
            <p className="mt-4 text-lg text-navy-600">What our patients say about their experience with Healix</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "The doctors at Healix are exceptional. They took the time to understand my condition and provide the best care possible.",
                name: "Sarah Johnson",
                role: "Patient",
              },
              {
                quote:
                  "I've never had such a smooth experience scheduling appointments and getting the care I need. Highly recommended!",
                name: "Michael Chen",
                role: "Patient",
              },
              {
                quote:
                  "The online consultation feature saved me so much time. I got the medical advice I needed without leaving my home.",
                name: "Aisha Rahman",
                role: "Patient",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border-none shadow-md bg-navy-50">
                <CardContent className="p-8">
                  <div className="mb-6 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                  <p className="mb-6 text-navy-700 italic">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-navy-200 mr-3"></div>
                    <div>
                      <p className="font-medium text-navy-900">{testimonial.name}</p>
                      <p className="text-sm text-navy-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* CTA Section */}
  <section className="bg-navy-900 py-20 text-white">
    <div className="container px-4">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Experience Premium Healthcare</h2>
        <p className="text-lg text-navy-100 mb-8">Schedule a consultation with one of our specialists today</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/login">
              <Calendar className="mr-2 h-5 w-5" />
              Book an Appointment
            </Link>
          </Button>

          <ContactModal
            trigger={
              <Button
                size="lg"
                variant="outline"
                className="bg-navy-700 border-navy-700 text-white hover:bg-navy-800"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            }
          />
        </div>
      </div>
    </div>
  </section>

    </div>
  )
}
