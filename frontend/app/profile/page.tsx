"use client"

import { useState, useEffect } from "react"
import { useAuth } from '../context/auth-context'
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Phone, Calendar, Edit2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [diseases, setDiseases] = useState({
    speech: ["Dysarthria", "Apraxia"],
    physical: ["Arthritis"]
  })

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="consultation">Consultation History</TabsTrigger>
            <TabsTrigger value="documents">Patient Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            {/* Profile Info Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/avatars/01.png" alt={user?.first_name} />
                      <AvatarFallback>{user?.first_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
                      <p className="text-gray-500">Beirut, Lebanon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="text-base">{user?.first_name} {user?.last_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <p className="text-base">07/01/1997</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone Number</label>
                    <p className="text-base">+961 71 346 347</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <p className="text-base">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pre-existing Diseases */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Pre-existing Diseases</h3>
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Speech</h4>
                    <div className="flex gap-2">
                      {diseases.speech.map((disease, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Physical</h4>
                    <div className="flex gap-2">
                      {diseases.physical.map((disease, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">General</h3>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <span>Enable Notifications</span>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
} 