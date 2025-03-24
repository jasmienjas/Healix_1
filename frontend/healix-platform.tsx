"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  User,
  Calendar,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronDown,
  Check,
  Bell,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Doctor {
  id: number
  name: string
  specialty: string
  experience: number
  location: string
  hospital: string
  availability: {
    days: string
    hours: string
  }
  fee: number
  rating: number
  patientStories: number
  image: string
}

export default function HealixPlatform() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("Relevance")
  const [selectedAvailability, setSelectedAvailability] = useState("Any time")
  const [filterOptions, setFilterOptions] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Karim Mansour",
      specialty: "Psychiatrist",
      experience: 15,
      location: "Beirut",
      hospital: "AUBMC",
      availability: {
        days: "Tue, Thu",
        hours: "10:00 AM-01:00 PM",
      },
      fee: 35,
      rating: 99,
      patientStories: 23,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Dr. Linda Hamouche",
      specialty: "Specialist in ear, throat and nose diseases",
      experience: 18,
      location: "Beirut",
      hospital: "AUBMC",
      availability: {
        days: "Mon, Thu",
        hours: "10:00 AM-01:00 PM",
      },
      fee: 40,
      rating: 99,
      patientStories: 120,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Dr. Asmaa Kharat",
      specialty: "Cardiologist",
      experience: 9,
      location: "Beirut",
      hospital: "BMC",
      availability: {
        days: "Wed, Fri",
        hours: "09:00 AM-12:00 PM",
      },
      fee: 45,
      rating: 98,
      patientStories: 87,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const [favoriteDoctor, setFavoriteDoctor] = useState<number | null>(null)

  const toggleFavorite = (doctorId: number) => {
    if (favoriteDoctor === doctorId) {
      setFavoriteDoctor(null)
    } else {
      setFavoriteDoctor(doctorId)
    }
  }

  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null)
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))]

  const filteredBySpecialtyDoctors = activeSpecialty
    ? filteredDoctors.filter((doctor) => doctor.specialty === activeSpecialty)
    : filteredDoctors

  const finalFilteredDoctors = showOnlyAvailable
    ? filteredBySpecialtyDoctors.filter(
        (doctor) => doctor.availability.days.includes("Mon") || doctor.availability.days.includes("Tue"),
      )
    : filteredBySpecialtyDoctors

  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard")
  }, [router])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Reduced height */}
      <header className="bg-[#023664] text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
              alt="HEALIX - Where Every Click Heals"
              width={90}
              height={40}
              className="object-contain"
            />
          </div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:sticky md:transform-none md:top-0 md:h-[calc(100vh-3rem)]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="pt-16 md:pt-4 pb-6 px-4 h-full flex flex-col">
            <div className="flex-1 space-y-1">
              <Button variant="ghost" className="w-full justify-start text-primary font-semibold bg-blue-50" asChild>
                <Link href="/dashboard">
                  <User className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-5 w-5 mr-3" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-5 w-5 mr-3" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="h-5 w-5 mr-3" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <HelpCircle className="h-5 w-5 mr-3" />
                Help
              </Button>
            </div>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            {/* Search Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input type="text" placeholder="Set your location" className="pl-10" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Dr, Doctor, Hospital"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button>
                  <Search className="mr-2" size={18} />
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      Availability <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["Any time", "Today", "Tomorrow", "This week"].map((option) => (
                      <DropdownMenuItem key={option} onClick={() => setSelectedAvailability(option)}>
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      Filter <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["All", "Online consultation", "Physical visit"].map((option) => (
                      <DropdownMenuItem key={option} onClick={() => setFilterOptions(option)}>
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      Sort By: {selectedFilter} <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["Relevance", "Lowest fee", "Highest rated", "Experience"].map((option) => (
                      <DropdownMenuItem key={option} onClick={() => setSelectedFilter(option)}>
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-6 mt-4">
              <h3 className="text-lg font-medium mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeSpecialty === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSpecialty(null)}
                >
                  All
                </Button>
                {specialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={activeSpecialty === specialty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSpecialty(specialty)}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id="available-today"
                  checked={showOnlyAvailable}
                  onChange={() => setShowOnlyAvailable(!showOnlyAvailable)}
                  className="mr-2"
                />
                <label htmlFor="available-today">Show only doctors available today/tomorrow</label>
              </div>
            </div>

            {/* Doctors List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{finalFilteredDoctors.length} doctors available in Beirut</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Check size={16} className="mr-1 text-gray-500" />
                  Book appointments with minimum wait-time & verified doctor details
                </div>
              </div>

              {finalFilteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md mb-6 p-6 transition-all hover:shadow-lg">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                        <AvatarImage src={doctor.image} alt={doctor.name} />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1">
                        <Check size={14} />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-blue-700">{doctor.name}</h3>
                        <button
                          onClick={() => toggleFavorite(doctor.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={favoriteDoctor === doctor.id ? "Remove from favorites" : "Add to favorites"}
                        >
                          {favoriteDoctor === doctor.id ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="#ef4444"
                              stroke="#ef4444"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-gray-600">{doctor.specialty}</p>
                      <p className="text-gray-500 text-sm">{doctor.experience} years experience overall</p>
                      <div className="mt-2">
                        <p className="text-gray-700 font-medium">{doctor.location}</p>
                        <p className="text-gray-500 text-sm">{doctor.hospital}</p>
                      </div>

                      <div className="flex flex-wrap items-center mt-4 gap-4">
                        <div className="flex items-center text-gray-700">
                          <Clock size={16} className="mr-1" />
                          <span>{doctor.availability.days}</span>
                        </div>
                        <div className="text-gray-500 text-sm">{doctor.availability.hours}</div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-1 text-gray-600" />
                          <span className="font-bold">${doctor.fee}</span>
                          <span className="text-gray-500 text-sm ml-1">Starting</span>
                        </div>
                        <div className="flex items-center">
                          <Badge className="bg-green-600 hover:bg-green-700">{doctor.rating}%</Badge>
                          <span className="text-gray-500 text-sm ml-2">{doctor.patientStories} Patient Stories</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:min-w-[160px] mt-4 md:mt-0">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                      <Button className="w-full bg-blue-700 hover:bg-blue-800">Book Appointment</Button>
                    </div>
                  </div>
                </div>
              ))}

              {finalFilteredDoctors.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-lg text-gray-600">No doctors match your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* User panel for desktop */}
        <div className="hidden lg:block w-64 p-4">
          <div className="flex items-center gap-4 justify-end">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <span>EN</span>
                  <ChevronDown size={14} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>EN</DropdownMenuItem>
                <DropdownMenuItem>FR</DropdownMenuItem>
                <DropdownMenuItem>AR</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <span className="font-medium">Amany Sal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

