"use client";

import React, { createContext, useState, ReactNode, useContext } from "react";
import { Profile } from "../types/Profile";

interface ProfileContextProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

const initialState: Profile = {
  _id: "",
  name: "",
  savingTarget: 0,
  email: "",
};

const ProfileContext = createContext<ProfileContextProps>({
  profile: initialState,
  setProfile: () => {}
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(initialState);

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
