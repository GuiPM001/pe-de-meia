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

interface ProfileContextProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
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
  setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session)

    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      const userProfile = session.user;

      setProfile({
        _id: userProfile.id ?? "",
        dailyCost: userProfile.dailyCost ?? 0,
        email: userProfile.email ?? "",
        name: userProfile.name ?? "",
        savingTarget: userProfile.savingTarget ?? 0,
      });
    }
  }, [status, session]);

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
