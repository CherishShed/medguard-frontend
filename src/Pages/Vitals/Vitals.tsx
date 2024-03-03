import { ToastStore, UserStore, patientType } from "@/Context/States";
import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Skeleton,
  Tab,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  URLSearchParamsInit,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { checkAuth, formatDate } from "@/Utils/helpers";

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Search } from "@mui/icons-material";
function Vitals() {
  const [patient, setPatient] = useState<patientType | null>(null);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("1");
  const openToast = ToastStore((store) => store.openToast);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const setUser = UserStore((store) => store.setUser);
  const [searchValue, setSearchValue] = useState(getQueryParameters());
  function getQueryParameters() {
    const extractedSearchParams = new URLSearchParams(searchParams);

    const params: { hospitalNumber: string } = { hospitalNumber: "" };
    for (const [key, value] of extractedSearchParams) {
      if (key === "hospitalNumber") {
        params.hospitalNumber = value;
      }
    }

    return params.hospitalNumber;
  }
  useEffect(() => {
    const params = createSearchParams({
      hospitalNumber: searchValue,
    } as URLSearchParamsInit);
    setSearchParams(params);
  }, [searchValue]);
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
  const getVitalsDetails = () => {
    setLoading(true);
    axios
      .get(
        `https://medguard.vercel.app/api/healthworker/patient/vitals?hospitalNumber=${searchValue}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        console.log(response);
        setPatient(response.data.patientDetails);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          openToast(error.response.data.message, "error");
        } else {
          openToast(error.message, "error");
        }
      });
  };
  useEffect(() => {
    if (getQueryParameters()) {
      getVitalsDetails();
    }
    return;
  }, []);
  return (
    <div className="bg-white overflow-auto w-full h-full min-h-screen">
      <section className="mt-[100px] p-5 w-full h-full">
        <div>
          <OutlinedInput
            className="mb-3"
            id="outlined-adornment-password"
            fullWidth
            placeholder="Enter Hospital Number"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value as string);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setPatient(null);
                    getVitalsDetails();
                  }}
                  edge="end"
                >
                  <Search
                    className="border-l-2 border-lime-400 text-green-800"
                    fontSize="large"
                  />
                </IconButton>
              </InputAdornment>
            }
          />
          {!loading && !patient && (
            <p className="text-center text-2xl font-medium mt-8">
              Enter Hospital Number to View Patient's Vitals
            </p>
          )}
        </div>
        {(loading || patient) && (
          <div>
            <div className="my-4 w-3/4 mx-auto border flex justify-between p-4 text-normal">
              <div className="leading-9">
                <p className="font-bold flex gap-2">
                  <span>Hospital Number: </span>
                  <span className="font-normal">
                    {!patient ? (
                      <Skeleton width={"100px"} />
                    ) : (
                      patient.hospitalNumber
                    )}
                  </span>
                </p>
                <p className="font-bold flex gap-2">
                  <span>Name: </span>
                  <span className="font-normal">
                    {!patient ? (
                      <Skeleton width={"100px"} />
                    ) : (
                      `${patient.firstName}
                ${patient.lastName}`
                    )}
                  </span>
                </p>
              </div>
              <div className="leading-9">
                <p className="font-bold flex gap-2">
                  <span>Gender: </span>
                  <span className="font-normal">
                    {!patient ? <Skeleton width={"100px"} /> : patient?.gender}
                  </span>
                </p>
                <p className="font-bold flex gap-2">
                  <span>Phone Number: </span>
                  <span className="font-normal">
                    {!patient ? (
                      <Skeleton width={"100px"} />
                    ) : (
                      patient?.phone_number
                    )}
                  </span>
                </p>
              </div>
            </div>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={(
                      event: React.SyntheticEvent,
                      newValue: string
                    ) => {
                      event.preventDefault();
                      setValue(newValue);
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Blood Pressure" value="1" />
                    <Tab label="Heart Beat" value="2" />
                    <Tab label="Blood Oxygen" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {patient ? (
                    <LineChart
                      width={1000}
                      height={250}
                      className="!w-full !h-[300px]"
                      data={patient.vitals}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={(e) => formatDate(e.createdAt)}
                        name="mmm"
                        fontSize={8}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={(e) => e.blood_pressure.split("/")[0]}
                        stroke="Green"
                        name="Systolic Pressure"
                      />
                      <Line
                        type="monotone"
                        dataKey={(e) => e.blood_pressure.split("/")[1]}
                        stroke="Blue"
                        name="Diastolic Pressure"
                      />
                    </LineChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
                <TabPanel value="2">
                  {patient ? (
                    <AreaChart
                      width={1000}
                      height={250}
                      className="!w-full !h-[300px]"
                      data={patient.vitals}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey={(e) => formatDate(e.createdAt)}
                        fontSize={8}
                      />
                      <YAxis />
                      <Legend />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="heart_beat"
                        stroke="red"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        name="Heartbeat"
                      />
                    </AreaChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
                <TabPanel value="3">
                  {patient ? (
                    <BarChart
                      width={730}
                      height={250}
                      data={patient.vitals}
                      className="!w-full !h-[300px]"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={(e) => formatDate(e.createdAt)} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="blood_oxygen" fill="orange" />
                    </BarChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        )}
      </section>
    </div>
  );
}

export default Vitals;
