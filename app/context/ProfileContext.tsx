"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Profile } from "../types/Profile";
import profileMock from "../../__mock/profile.json";

interface ProfileContextProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextProps>({
  profile: { name: "", savingTarget: 0 },
  setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(profileMock);

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
