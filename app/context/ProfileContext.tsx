"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { Profile } from "@/core/types/Profile";
import { api } from "@/core/services/api";

interface ProfileContextProps {
  profile: Profile;
  fetchProfile: (email: string) => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
}

const initialProfile: Profile = {
  _id: "",
  dailyCost: 0,
  email: "",
  name: "",
  savingTarget: 0,
};

const ProfileContext = createContext<ProfileContextProps>({
  profile: initialProfile,
  fetchProfile: () => Promise.resolve(),
  updateProfile: () => Promise.resolve()
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      const userProfile = session.user;

      setProfile({
        ...profile,
        _id: userProfile.id ?? "",
        email: userProfile.email ?? "",
      });
    }
  }, [status, session]);

  const fetchProfile = async (email: string) => {
    const response: Profile = await api.get(`/user?email=${email}`)
    setProfile(response);
  }

  const updateProfile = async (profile: Profile) => {
    await api.put("/user", profile);
    setProfile(profile);
  };

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  return context;
};
