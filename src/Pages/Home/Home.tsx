import { useEffect, useState } from "react";
import { TableStore, ToastStore, UserStore } from "../../Context/States";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { Medication, PersonAdd, ShowChart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../Utils/helpers";
import DataTable from "../../Components/DataTable";

type statsType = {
  patientsNumber: number;
  patientsOnMedication: number;
  vitalCount: { warningCount: number; badCount: number };
};
function Home() {
  const openToast = ToastStore((store) => store.openToast);
  const [stats, setStats] = useState<statsType | null>(null);
  const setUser = UserStore((store) => store.setUser);
  const setTableData = TableStore((store) => store.setTableData);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((response) => {
      if (!response.auth) {
        setUser(null, false);
        openToast("Please Log in", "error");
        return navigate("/signin");
      } else {
        setUser(response.user, true);
      }
    });
    return;
  }, []);
  useEffect(() => {
    axios
      .get("https://medguard.vercel.app/api/healthworker/dashboardstatistics", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((statistics) => {
        setStats(statistics.data);
      })
      .catch((error) => {
        if (error.response.status != 401) {
          openToast(error.message, "error");
        }
      });
    axios
      .get("https://medguard.vercel.app/api/healthworker/patients", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((response) => {
        setTableData(response.data.patients);
      })
      .catch((error) => {
        if (error.response.status != 401) {
          openToast(error.message, "error");
        }
      });
  }, []);
  return (
    <div className="bg-white overflow-auto w-full h-full min-h-screen">
      <section className="mt-[100px] p-5 h-full">
        <div className="flex gap-5 mx-auto justify-evenly">
          <div className="flex flex-col justify-between rounded-xl border-2 border-green-500 h-[140px] w-[200px] px-3 py-3 bg-green-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-7xl max-w-[70%] text-black">
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
          <div className="flex flex-col justify-between rounded-xl border-2 border-sky-500 h-[140px] w-[200px] px-3 py-3 bg-sky-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-7xl max-w-[70%] text-black">
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
          <div className="flex flex-col justify-between rounded-xl border-2 border-yellow-500 h-[140px] w-[200px] px-3 py-3 bg-orange-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-7xl max-w-[70%] text-black">
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
          <div className="flex flex-col justify-between rounded-xl border-2 border-red-500 h-[140px] w-[200px] px-3 py-3 bg-red-200">
            <div className="flex items-center justify-evenly">
              {stats ? (
                <p className="text-7xl max-w-[70%] text-black">
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
        <div className="mt-9 w-full px-5 table-container">
          <DataTable />
        </div>
      </section>
    </div>
  );
}

export default Home;
