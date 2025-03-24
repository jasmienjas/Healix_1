"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, MapPin, Search } from "lucide-react"
import Layout from "../components/layout"
import { useAuth } from '../context/auth-context'
import Link from "next/link"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: number
  image: string
  location: string
  address: string
  availability: {
    days: string
    hours: string
  }
  fee: number
}

interface Appointment {
  id: string
  doctorName: string
  time: string
  date: Date
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [date, setDate] = useState<Date>(new Date(2025, 1, 1))
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name)
      setGreeting(`Hi, ${user.first_name}`)
    }
  }, [user])

  const onlineDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Salim Makarem",
      specialty: "Heart health",
      experience: 15,
      image: "/placeholder.svg?height=80&width=80",
      location: "1 km",
      address: "Rua São Salvador 57, Braga",
      availability: {
        days: "Tue, Thu",
        hours: "10:00 AM-01:00 PM",
      },
      fee: 35,
    },
    {
      id: "2",
      name: "Dr. Akram Karim",
      specialty: "Cardiologist",
      experience: 12,
      image: "/placeholder.svg?height=80&width=80",
      location: "1 km",
      address: "Largo Dragões 120, Canedo",
      availability: {
        days: "Mon, Wed",
        hours: "09:00 AM-12:00 PM",
      },
      fee: 40,
    },
    {
      id: "3",
      name: "Dr. Salwa Malik",
      specialty: "Pediatric",
      experience: 10,
      image: "/placeholder.svg?height=80&width=80",
      location: "1 km",
      address: "R. velhos 92, Vieira do Castelo",
      availability: {
        days: "Wed, Fri",
        hours: "02:00 PM-05:00 PM",
      },
      fee: 45,
    },
  ]

  const recommendedDoctors: Doctor[] = [
    {
      id: "4",
      name: "Dr. Amira Hussein",
      specialty: "Pediatric",
      experience: 12,
      image: "/placeholder.svg?height=80&width=80",
      location: "2 km",
      address: "Medical Center A",
      availability: {
        days: "Tue, Thu",
        hours: "10:00 AM-01:00 PM",
      },
      fee: 25,
    },
    {
      id: "5",
      name: "Dr. Jason Hattab",
      specialty: "Surgical",
      experience: 10,
      image: "/placeholder.svg?height=80&width=80",
      location: "3 km",
      address: "Medical Center B",
      availability: {
        days: "Tue, Thu",
        hours: "09:00 AM-12:00 PM",
      },
      fee: 35,
    },
    {
      id: "6",
      name: "Dr. Jessie Saliba",
      specialty: "Gastroenterology",
      experience: 7,
      image: "/placeholder.svg?height=80&width=80",
      location: "1.5 km",
      address: "Medical Center C",
      availability: {
        days: "Tue, Thu",
        hours: "02:00 PM-05:00 PM",
      },
      fee: 15,
    },
  ]

  const appointments: Appointment[] = [
    {
      id: "1",
      doctorName: "Dr. Amin Jaber",
      time: "10:00am - 10:30am",
      date: new Date(2025, 1, 14),
    },
    {
      id: "2",
      doctorName: "Dr. Hassan Ismail",
      time: "09:00am - 10:30am",
      date: new Date(2025, 1, 15),
    },
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">{greeting}</h1>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
        </div>

        {/* Updated Hero Section with Image */}
        <Card className="mb-8 bg-[#023664] text-white overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Your Heath Journey Starts Here</h3>
              <p className="text-lg">Book Consultations on Your Own Terms</p>
              <p className="text-sm">Find the Best Doctors Near you</p>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/20" />
                  ))}
                </div>
                <span className="text-sm">+180 doctors are available</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 relative w-[200px] h-[150px]">
              <img
                src="/images/doctor-consultation.jpg"
                alt="Doctor Consultation"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Find doctors"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
            <span>Location</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Link href="/doctors">
            <Button className="bg-blue-700">Search</Button>
          </Link>
        </div>

        
        

        {/* Nearby Doctors */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Nearby Doctors</h3>
            <Button variant="link" className="text-blue-600">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {onlineDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Image
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                        <MapPin size={14} />
                        <span>{doctor.location}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Doctors */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recommended Doctors</h3>
            <Button variant="link" className="text-blue-600">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <Image
                        src={doctor.image || "/placeholder.svg"}
                        alt={doctor.name}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">specialist | {doctor.experience} years experience</p>
                        <Badge variant="outline" className="mt-2">
                          {doctor.specialty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{doctor.availability.days}</span>
                      </div>
                      <span>${doctor.fee} Starting</span>
                    </div>
                    <Button className="w-full">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
            <Button variant="link" className="text-blue-600">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Feb 2025</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newDate = new Date(date)
                        newDate.setMonth(date.getMonth() - 1)
                        setDate(newDate)
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newDate = new Date(date)
                        newDate.setMonth(date.getMonth() + 1)
                        setDate(newDate)
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-center min-w-[60px]">
                        <div className="text-sm font-semibold">{appointment.date.getDate()}</div>
                        <div className="text-xs">{appointment.date.toLocaleString("default", { month: "short" })}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

