import { useEffect, useState } from "react";
import { ToastStore, userStore } from "../../Context/States";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { Medication, PersonAdd, ShowChart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SideNav from "../../Layout/SideNav";

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
type statsType = {
  patientsNumber: number;
  patientsOnMedication: number;
  vitalCount: { warningCount: number; badCount: number };
};
function Home() {
  const toastSeverity = ToastStore((store) => store.severity);
  // const openToast = ToastStore((store) => store.openToast);
  const closeToast = ToastStore((store) => store.closeToast);
  const toastText = ToastStore((store) => store.message);
  const [stats, setStats] = useState<statsType | null>(null);
  const isAuthenticated = userStore((store) => store.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
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
  }, [toastText]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    axios
      .get("https://medguard.vercel.app/api/healthworker/dashboardstatistics", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((statistics) => {
        setStats(statistics.data);
      });
  }, []);
  return (
    <div className="bg-white h-screen">
      {!isAuthenticated && (
        <CircularProgress className="!w-[200px] !h-[200px] mx-auto mt-[10%] !text-blue-500 !block" />
      )}
      <SideNav />
      <section className="ml-[100px] mt-[100px]">
        <div className="flex gap-5 mx-auto justify-evenly">
          <div className="flex flex-col justify-between rounded-xl border-2 border-lime-500 h-[170px] w-[200px] px-3 py-3 bg-lime-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-8xl max-w-[70%] text-black">
                  {stats?.patientsNumber}
                </p>
              ) : (
                <CircularProgress className="!w-[50px] !h-[50px] mx-auto mt-[10%] !text-black !block" />
              )}

              <PersonAdd color="success" className="!text-5xl" />
            </div>
            <p className="text-xl font-bold block text-green-700 text-center">
              Total Patients
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-xl border-2 border-sky-500 h-[170px] w-[200px] px-3 py-3 bg-sky-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-8xl max-w-[70%] text-black">
                  {stats?.patientsOnMedication}
                </p>
              ) : (
                <CircularProgress className="!w-[50px] !h-[50px] mx-auto mt-[10%] !text-black !block" />
              )}
              <Medication color="primary" className="!text-5xl" />
            </div>
            <p className="text-xl font-bold block text-sky-700 text-center">
              Active Medications
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-xl border-2 border-yellow-500 h-[170px] w-[200px] px-3 py-3 bg-orange-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-8xl max-w-[70%] text-black">
                  {stats?.vitalCount.warningCount}
                </p>
              ) : (
                <CircularProgress className="!w-[50px] !h-[50px] mx-auto mt-[10%] !text-black !block" />
              )}
              <ShowChart color="warning" className="!text-5xl" />
            </div>
            <p className="text-xl font-bold block text-yellow-700 text-center">
              Abormal Readings
            </p>
          </div>
          <div className="flex flex-col justify-between rounded-xl border-2 border-red-500 h-[170px] w-[200px] px-3 py-3 bg-red-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-8xl max-w-[70%] text-black">
                  {stats?.vitalCount.badCount}
                </p>
              ) : (
                <CircularProgress className="!w-[50px] !h-[50px] mx-auto mt-[10%] !text-black !block" />
              )}
              <ShowChart color="error" className="!text-5xl" />
            </div>
            <p className="text-xl font-bold block text-red-700 text-center">
              Dangerous Readings
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
