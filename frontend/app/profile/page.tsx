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
import { DefaultAvatar } from "../components/DefaultAvatar"

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

export default function ProfilePage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [isDoctor, setIsDoctor] = useState(false)
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form states for doctor profile
  const [specialty, setSpecialty] = useState("")
  const [bio, setBio] = useState("")
  const [appointmentCost, setAppointmentCost] = useState("")
  const [officeHoursStart, setOfficeHoursStart] = useState("")
  const [officeHoursEnd, setOfficeHoursEnd] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [officeNumber, setOfficeNumber] = useState("")
  const [officeAddress, setOfficeAddress] = useState("")
  const [yearsOfExperience, setYearsOfExperience] = useState("")
  const [education, setEducation] = useState("")

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const profile = await api.doctor.getProfile();
        setIsDoctor(true);
        setDoctorProfile(profile);
        // Set form states
        setSpecialty(profile.specialty || "");
        setBio(profile.bio || "");
        setAppointmentCost(profile.appointment_cost?.toString() || "");
        setOfficeHoursStart(profile.office_hours_start || "");
        setOfficeHoursEnd(profile.office_hours_end || "");
        setPhoneNumber(profile.phone_number || "");
        setOfficeNumber(profile.office_number || "");
        setOfficeAddress(profile.office_address || "");
        setYearsOfExperience(profile.years_of_experience?.toString() || "");
        setEducation(profile.education || "");
      } catch (error) {
        // If 404, user is not a doctor
        if ((error as any).message?.includes("404")) {
          setIsDoctor(false);
        } else {
          toast.error("Failed to fetch profile");
        }
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await api.doctor.updateProfile(formData);
      
      if (response.success && response.data) {
        setDoctorProfile(response.data);
        toast.success("Profile picture updated successfully");
      } else {
        throw new Error("Failed to upload profile picture");
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast.error("Failed to upload profile picture");
    }
  };

  const handleDoctorProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const requiredFields = ['office_address', 'phone_number', 'office_number'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        const updateData = {
            ...formData,
            specialty: selectedSpecialty,
            office_hours_start: officeHours.start,
            office_hours_end: officeHours.end,
            appointment_cost: appointmentCost,
            bio: bio,
            years_of_experience: yearsOfExperience,
            education: education
        };

        console.log('Updating doctor profile with data:', updateData);

        const formDataToSend = new FormData();
        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value);
            }
        });

        if (profilePicture) {
            formDataToSend.append('profile_picture', profilePicture);
        }

        const response = await fetch('/api/accounts/doctor/profile/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataToSend
        });

        const data = await response.json();
        console.log('Profile update response:', data);

        if (data.success) {
            setSuccess('Profile updated successfully');
            setError('');
            // Update the state with the new data
            setFormData(prev => ({
                ...prev,
                ...data.data
            }));
            // Update the profile picture URL if it exists
            if (data.data.profile_picture) {
                setProfilePictureUrl(data.data.profile_picture);
            }
        } else {
            setError(data.message || 'Failed to update profile');
        }
    } catch (err) {
        console.error('Error updating profile:', err);
        setError('An error occurred while updating the profile');
    }
  };

  // Add this useEffect to load the profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
        try {
            const response = await fetch('/api/accounts/doctor/profile/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            console.log('Loaded profile data:', data);

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    ...data.data
                }));
                if (data.data.profile_picture) {
                    setProfilePictureUrl(data.data.profile_picture);
                }
                if (data.data.specialty) {
                    setSelectedSpecialty(data.data.specialty);
                }
                if (data.data.office_hours_start && data.data.office_hours_end) {
                    setOfficeHours({
                        start: data.data.office_hours_start,
                        end: data.data.office_hours_end
                    });
                }
                if (data.data.appointment_cost) {
                    setAppointmentCost(data.data.appointment_cost);
                }
                if (data.data.bio) {
                    setBio(data.data.bio);
                }
                if (data.data.years_of_experience) {
                    setYearsOfExperience(data.data.years_of_experience);
                }
                if (data.data.education) {
                    setEducation(data.data.education);
                }
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Failed to load profile data');
        }
    };

    loadProfile();
  }, []);

  // Add useEffect to log state changes
  useEffect(() => {
    console.log('Current doctor profile state:', doctorProfile);
  }, [doctorProfile]);

  const getProfilePictureUrl = (profilePicture: string | null) => {
    if (!profilePicture) return null;
    
    // If the URL contains 'None', it's an invalid URL
    if (profilePicture.includes('None')) {
      return null;
    }
    
    // If it's already a full URL, return it
    if (profilePicture.startsWith('http')) {
      return profilePicture;
    }
    
    // For local development, prepend the API URL
    return `${process.env.NEXT_PUBLIC_API_URL}${profilePicture}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            {isDoctor && (
              <TabsTrigger value="doctor">Doctor Info</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            {/* Profile Info Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={getProfilePictureUrl(doctorProfile?.profile_picture)} 
                          alt={user?.first_name}
                        />
                        <AvatarFallback>
                          <DefaultAvatar
                            firstName={user?.first_name}
                            lastName={user?.last_name}
                            className="h-full w-full"
                          />
                        </AvatarFallback>
                      </Avatar>
                      {isDoctor && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full p-1"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{user?.first_name} {user?.last_name}</h2>
                      <p className="text-gray-500">Beirut, Lebanon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="text-base">
                      {user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username || "Not available"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <p className="text-base">{user?.email || "Not available"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isDoctor && (
            <TabsContent value="doctor">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Doctor Information</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-500 block mb-2">Specialty</label>
                      {isEditing ? (
                        <Input
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          placeholder="Enter your specialty"
                        />
                      ) : (
                        <p className="text-base">{specialty || "Not specified"}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-2">Bio</label>
                      {isEditing ? (
                        <Textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Write a short bio about yourself"
                          rows={4}
                        />
                      ) : (
                        <p className="text-base">{bio || "No bio provided"}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-2">Appointment Cost</label>
                      {isEditing ? (
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            value={appointmentCost}
                            onChange={(e) => setAppointmentCost(e.target.value)}
                            className="pl-10"
                            placeholder="Enter appointment cost"
                          />
                        </div>
                      ) : (
                        <p className="text-base">${appointmentCost || "Not specified"}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-2">Office Hours</label>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                            <Input
                              type="time"
                              value={officeHoursStart}
                              onChange={(e) => setOfficeHoursStart(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">End Time</label>
                            <Input
                              type="time"
                              value={officeHoursEnd}
                              onChange={(e) => setOfficeHoursEnd(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-base">
                          {officeHoursStart && officeHoursEnd ? (
                            `${officeHoursStart} - ${officeHoursEnd}`
                          ) : (
                            "Not specified"
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-2">Contact Information</label>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Phone Number</label>
                            <Input
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Office Number</label>
                            <Input
                              value={officeNumber}
                              onChange={(e) => setOfficeNumber(e.target.value)}
                              placeholder="Enter your office number"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Office Address</label>
                            <Input
                              value={officeAddress}
                              onChange={(e) => setOfficeAddress(e.target.value)}
                              placeholder="Enter your office address"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-base">
                            <span className="font-medium">Phone:</span> {phoneNumber || "Not specified"}
                          </p>
                          <p className="text-base">
                            <span className="font-medium">Office:</span> {officeNumber || "Not specified"}
                          </p>
                          <p className="text-base">
                            <span className="font-medium">Address:</span> {officeAddress || "Not specified"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 block mb-2">Additional Information</label>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Years of Experience</label>
                            <Input
                              type="number"
                              value={yearsOfExperience}
                              onChange={(e) => setYearsOfExperience(e.target.value)}
                              placeholder="Enter years of experience"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">Education</label>
                            <Textarea
                              value={education}
                              onChange={(e) => setEducation(e.target.value)}
                              placeholder="Enter your education details"
                              rows={3}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-base">
                            <span className="font-medium">Experience:</span> {yearsOfExperience ? `${yearsOfExperience} years` : "Not specified"}
                          </p>
                          <p className="text-base">
                            <span className="font-medium">Education:</span> {education || "Not specified"}
                          </p>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <Button onClick={handleDoctorProfileUpdate} className="w-full">
                        Save Changes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="settings">
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