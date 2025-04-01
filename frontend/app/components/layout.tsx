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
import {
  LayoutDashboard,
  Home,
} from "lucide-react"

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

  const userFirstName = user?.first_name || 'Guest'

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Home",
      href: "/home",
      icon: Home,
      current: pathname === "/home",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
      current: pathname === "/calendar",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      current: pathname === "/profile",
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
      current: pathname === "/messages",
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
      current: pathname === "/help",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#023664] text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iPLCdILTkVCTPt0ecxQ9Si1shZBv8k.png"
              alt="HEALIX"
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
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    item.current && "text-primary font-semibold bg-blue-50",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </Button>
              ))}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt={userFirstName} />
                    <AvatarFallback>{userFirstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{userFirstName}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

