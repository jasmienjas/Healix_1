'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getDoctorProfile, updateDoctorProfile } from '@/services/api';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';

interface DoctorProfileData {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  specialty: string;
  office_address: string;
  office_number: string;
  phone_number: string;
  profile_picture_url: string | null;
  appointment_cost: number;
  office_hours_start: string;
  office_hours_end: string;
  bio: string;
  years_of_experience: number;
  education: string;
}

export default function DoctorProfile() {
  const [profile, setProfile] = useState<DoctorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DoctorProfileData>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getDoctorProfile();
      setProfile(data);
      setFormData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append profile picture if selected
      if (selectedImage) {
        formDataToSend.append('profile_picture', selectedImage);
      }

      await updateDoctorProfile(formDataToSend);
      await fetchProfile();
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update profile',
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-start space-x-6">
              <div className="relative h-40 w-40">
                {(profile.profile_picture_url || selectedImage) && (
                  <Image
                    src={selectedImage ? URL.createObjectURL(selectedImage) : profile.profile_picture_url!}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                )}
              </div>
              {isEditing && (
                <div>
                  <Label htmlFor="profile_picture">Profile Picture</Label>
                  <Input
                    id="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  value={isEditing ? formData.specialty : profile.specialty}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="appointment_cost">Appointment Cost ($)</Label>
                <Input
                  id="appointment_cost"
                  name="appointment_cost"
                  type="number"
                  value={isEditing ? formData.appointment_cost : profile.appointment_cost}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="office_hours_start">Office Hours Start</Label>
                <Input
                  id="office_hours_start"
                  name="office_hours_start"
                  type="time"
                  value={isEditing ? formData.office_hours_start : profile.office_hours_start}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="office_hours_end">Office Hours End</Label>
                <Input
                  id="office_hours_end"
                  name="office_hours_end"
                  type="time"
                  value={isEditing ? formData.office_hours_end : profile.office_hours_end}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={isEditing ? formData.phone_number : profile.phone_number}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="office_number">Office Number</Label>
                <Input
                  id="office_number"
                  name="office_number"
                  value={isEditing ? formData.office_number : profile.office_number}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="office_address">Office Address</Label>
              <Input
                id="office_address"
                name="office_address"
                value={isEditing ? formData.office_address : profile.office_address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={isEditing ? formData.bio : profile.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-32"
              />
            </div>

            <div>
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                name="education"
                value={isEditing ? formData.education : profile.education}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-32"
              />
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button type="submit" variant="default">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 