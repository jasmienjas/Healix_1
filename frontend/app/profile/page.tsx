"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from '../context/auth-context'
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Phone, Calendar, Edit2, Upload, Clock, DollarSign } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { DefaultAvatar } from "@/components/DefaultAvatar"

interface DoctorProfile {
  specialty: string;
  bio: string | null;
  appointment_cost: number | null;
  office_hours_start: string | null;
  office_hours_end: string | null;
  profile_picture: string | null;
  phone_number?: string;
  office_number?: string;
  office_address?: string;
  years_of_experience?: number;
  education?: string | null;
}

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  office_address: string;
  phone_number: string;
  office_number: string;
  specialty: string;
  bio: string;
  appointment_cost: string;
  office_hours_start: string;
  office_hours_end: string;
  years_of_experience: string;
  education: string;
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [isDoctor, setIsDoctor] = useState(false)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null)
  
  // Initialize form data
  const [formData, setFormData] = useState<FormData>(() => ({
    username: "",
    first_name: "",
    last_name: "",
    office_address: "",
    phone_number: "",
    office_number: "",
    specialty: "",
    bio: "",
    appointment_cost: "",
    office_hours_start: "",
    office_hours_end: "",
    years_of_experience: "",
    education: ""
  }));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) return;

        let response;
        if (user.user_type === 'doctor') {
          response = await api.doctor.getProfile();
        } else if (user.user_type === 'patient') {
          response = await api.patient.getProfile();
        }

        console.log('Profile response:', response);
        
        if (response?.success && response?.data) {
          const profileData = response.data;
          setFormData(prevData => ({
            ...prevData,
            username: profileData.user?.username || "",
            first_name: profileData.user?.first_name || "",
            last_name: profileData.user?.last_name || "",
            office_address: profileData.office_address || "",
            phone_number: profileData.phone_number || "",
            office_number: profileData.office_number || "",
            specialty: profileData.specialty || "",
            bio: profileData.bio || "",
            appointment_cost: profileData.appointment_cost?.toString() || "",
            office_hours_start: profileData.office_hours_start || "",
            office_hours_end: profileData.office_hours_end || "",
            years_of_experience: profileData.years_of_experience?.toString() || "",
            education: profileData.education || ""
          }));

          if (user.user_type === 'doctor') {
            setIsDoctor(true);
            setDoctorProfile(profileData);
          }
          
          setProfilePictureUrl(profileData.profile_picture);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if ((error as any).message?.includes("404")) {
          setIsDoctor(false);
        } else {
          toast.error("Failed to fetch profile");
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfilePicture(file);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      console.log('Uploading profile picture...');
      const response = await api.doctor.updateProfile(formData);
      console.log('Profile picture upload response:', response);
      
      if (response.success && response.data) {
        setProfilePictureUrl(response.data.profile_picture);
        toast.success("Profile picture updated successfully");
      } else {
        throw new Error(response.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleDoctorProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requiredFields = ['office_address', 'phone_number', 'office_number'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const updateData = {
        ...formData,
        appointment_cost: formData.appointment_cost ? parseFloat(formData.appointment_cost) : null,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null
      };

      console.log('Updating doctor profile with data:', updateData);

      const formDataToSend = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (profilePicture) {
        formDataToSend.append('profile_picture', profilePicture);
      }

      const response = await api.doctor.updateProfile(formDataToSend);
      console.log('Profile update response:', response);

      if (response.success) {
        setSuccess('Profile updated successfully');
        setError(null);
        setIsEditing(false);
        
        // Update profile data
        if (response.data) {
          setDoctorProfile(response.data);
          setProfilePictureUrl(response.data.profile_picture);
        }
        
        toast.success("Profile updated successfully");
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      toast.error("Failed to update profile");
    }
  };

  const getProfilePictureUrl = (profilePicture: string | null | undefined): string | undefined => {
    if (!profilePicture) return undefined;
    
    // If it's already a full URL, return it
    if (profilePicture.startsWith('http')) {
      return profilePicture;
    }
    
    // Otherwise, construct the full URL using the API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return `${API_URL}${profilePicture}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={getProfilePictureUrl(profilePictureUrl)} 
                  alt="Profile picture"
                />
                <AvatarFallback>
                  <DefaultAvatar />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  {formData.username || user?.email}
                </h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            {isDoctor && <TabsTrigger value="doctor">Doctor Info</TabsTrigger>}
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold">General Information</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-base font-medium text-gray-600 mb-3">Name</h3>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="First Name"
                          value={formData.first_name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            first_name: e.target.value
                          }))}
                        />
                        <Input
                          placeholder="Last Name"
                          value={formData.last_name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            last_name: e.target.value
                          }))}
                        />
                      </div>
                    ) : (
                      <p className="text-lg">
                        {formData.username || "Not set"}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-600 mb-3">Email</h3>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-600 mb-3">Profile Picture</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Change Picture</span>
                      </Button>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleDoctorProfileUpdate}>Save Changes</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isDoctor && (
            <TabsContent value="doctor">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Doctor Information</h2>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <form onSubmit={handleDoctorProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Specialty</label>
                        {isEditing ? (
                          <Input
                            value={formData.specialty}
                            onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.specialty || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Appointment Cost</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.appointment_cost}
                            onChange={(e) => setFormData({...formData, appointment_cost: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">${formData.appointment_cost || "Not specified"}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      {isEditing ? (
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg">{formData.bio || "No bio provided"}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Office Hours Start</label>
                        {isEditing ? (
                          <Input
                            type="time"
                            value={formData.office_hours_start}
                            onChange={(e) => setFormData({...formData, office_hours_start: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.office_hours_start || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Office Hours End</label>
                        {isEditing ? (
                          <Input
                            type="time"
                            value={formData.office_hours_end}
                            onChange={(e) => setFormData({...formData, office_hours_end: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.office_hours_end || "Not specified"}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        {isEditing ? (
                          <Input
                            value={formData.phone_number}
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.phone_number || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Office Number</label>
                        {isEditing ? (
                          <Input
                            value={formData.office_number}
                            onChange={(e) => setFormData({...formData, office_number: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.office_number || "Not specified"}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Office Address</label>
                      {isEditing ? (
                        <Input
                          value={formData.office_address}
                          onChange={(e) => setFormData({...formData, office_address: e.target.value})}
                        />
                      ) : (
                        <p className="text-lg">{formData.office_address || "Not specified"}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Years of Experience</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.years_of_experience}
                            onChange={(e) => setFormData({...formData, years_of_experience: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.years_of_experience || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Education</label>
                        {isEditing ? (
                          <Input
                            value={formData.education}
                            onChange={(e) => setFormData({...formData, education: e.target.value})}
                          />
                        ) : (
                          <p className="text-lg">{formData.education || "Not specified"}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
} 