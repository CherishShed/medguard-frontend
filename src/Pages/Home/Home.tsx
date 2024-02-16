import { SignOutButton, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { ToastStore, userStore } from "../../Context/States";
import { ToastContainer, toast } from "react-toastify";
import { AlertColor } from "@mui/material";

export type ClerkUser = {
  pathRoot: string;
  id: string;
  externalId: string | null;
  username: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  passwordEnabled: boolean;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  primaryEmailAddressId: string | null;
  primaryEmailAddress: string | null;
  primaryPhoneNumberId: string | null;
  primaryPhoneNumber: string | null;
  primaryWeb3WalletId: string | null;
  primaryWeb3Wallet: string | null;
  imageUrl: string;
  hasImage: boolean;
  twoFactorEnabled: boolean;
  totpEnabled: boolean;
  backupCodeEnabled: boolean;
  createOrganizationEnabled: boolean;
  deleteSelfEnabled: boolean;
  lastSignInAt: string;
  updatedAt: string;
  createdAt: string;
};

export type ClerkResponseObject = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: ClerkUser | null;
};

function Home() {
  const toastSeverity = ToastStore((store) => store.severity);
  const openToast = ToastStore((store) => store.openToast);
  const closeToast = ToastStore((store) => store.closeToast);
  const toastStatus = ToastStore((store) => store.open);
  const setUser = userStore((store) => store.setUser);
  const toastText = ToastStore((store) => store.message);
  const navigate = useNavigate();
  const loggedInUser = useUser() as ClerkResponseObject;
  const isAuthenticated = userStore((store) => store.isAuthenticated);

  function notify(toastText: string, toastSeverity: AlertColor | null) {
    if (toastStatus) {
      if (toastSeverity === "error") {
        toast.error(toastText, {
          position: "top-right",
          className: "foo-bar",
          pauseOnHover: false,
          onClose: closeToast,
          autoClose: 1000,
          theme: "light",
        });
      } else if (toastSeverity === "success") {
        toast.success(toastText, {
          position: "top-right",
          onClose: closeToast,
          className: "foo-bar",
          pauseOnHover: false,
          autoClose: 1000,
          theme: "light",
        });
      } else {
        return;
      }
    }
  }
  useEffect(() => {
    setUser(loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    if (isAuthenticated) {
      openToast("Log in successful", "success");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    notify(toastText, toastSeverity);
  }, [toastText]);

  return (
    <div>
      <ToastContainer />
      Home
      <button className="border rounded-md bg-red-500 text-white p-4">
        <SignOutButton
          signOutCallback={() => {
            openToast("Sign Out Successful", "success");
            navigate("/signin");
          }}
        />
      </button>
    </div>
  );
}

export default Home;
