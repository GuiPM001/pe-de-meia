"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { Profile } from "@/core/types/Profile";
import { jwtDecode } from "jwt-decode";

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
  setProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>(initialState);

  const getAuthTokenData = (): Profile | null => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith("authToken=")
    );

    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (!token) return null;

    return jwtDecode(token!);
  };

  useEffect(() => {
    if (profile._id) return;

    const tokenData = getAuthTokenData();
    if (!tokenData) return;

    setProfile(tokenData);
  }, [profile._id]);

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
