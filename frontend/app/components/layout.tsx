"use client"

import type React from "react"

import { useState } from "react"
import { User, Calendar, MessageSquare, HelpCircle, LogOut, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "../context/auth-context"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === "/dashboard" && "text-primary font-semibold bg-blue-50",
                )}
                asChild
              >
                <Link href="/dashboard">
                  <User className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/home" && "text-primary font-semibold bg-blue-50")}
                asChild
              >
                <Link href="/home">
                  <User className="h-5 w-5 mr-3" />
                  Home
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === "/profile" && "text-primary font-semibold bg-blue-50",
                )}
                asChild
              >
                <Link href="/profile">
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === "/calendar" && "text-primary font-semibold bg-blue-50",
                )}
                asChild
              >
                <Link href="/calendar">
                  <Calendar className="h-5 w-5 mr-3" />
                  Calendar
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === "/Notifications" && "text-primary font-semibold bg-blue-50",
                )}
                asChild
              >
                <Link href="/messages">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Notifications
                </Link>
              </Button>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/help" && "text-primary font-semibold bg-blue-50")}
                asChild
              >
                <Link href="/help">
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help
                </Link>
              </Button>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

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
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{user?.name || "User"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

