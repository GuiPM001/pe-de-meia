"use client";

import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { Profile } from "@/core/types/Profile";
import { api } from "@/core/services/api";

interface ProfileContextProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

const initialState: Profile = {
  _id: "",
  name: "",
  savingTarget: 0,
  email: "",
  dailyCost: 0
};

const ProfileContext = createContext<ProfileContextProps>({
  profile: initialState,
  setProfile: () => {},
});

export const ProfileProvider = ({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile: Profile;
}) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      const response: Profile = await api.get(`/user?id=${profile._id}`);
      setProfile(response);
    }

    if (profile?._id) fetchProfile();
  }, [profile?._id]);
  
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  return context;
};
