import { ToastStore, patientType } from "@/Context/States";
import {
  Box,
  Chip,
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
  useSearchParams,
} from "react-router-dom";
import { formatDate, formatToOriginalDate } from "@/Utils/helpers";

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
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { Search } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

function Vitals() {
  const [patient, setPatient] = useState<patientType | null>(null);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("1");
  const openToast = ToastStore((store) => store.openToast);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(getQueryParameters());
  const [currentPatient, setCurrentPatient] = useState(searchValue);
  const [range, setRange] = useState({ fromDate: "", toDate: "" });
  useEffect(() => {
    const params = createSearchParams({
      hospitalNumber: searchValue,
    } as URLSearchParamsInit);
    setSearchParams(params);
  }, [searchValue]);
  const getVitalsDetails = (hosNum: string) => {
    setCurrentPatient(searchValue);
    setLoading(true);
    axios
      .get(
        `https://medguard.vercel.app/api/healthworker/patient/vitals?hospitalNumber=${hosNum}`,
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
      getVitalsDetails(searchValue);
    }
    return;
  }, []);

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
                    getVitalsDetails(searchValue);
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
              <Chip
                label={patient?.status.toLocaleUpperCase()}
                className={`!h-12 ${
                  patient?.status === "good"
                    ? "!bg-[rgb(94,218,94,0.5)]"
                    : patient?.status === "abnormal"
                    ? "!bg-[rgb(227,189,51,0.5)]"
                    : "!bg-[rgb(218,94,94,0.5)]"
                } font-bold !rounded-3xl min-w-fit !w-[300px]`}
              />
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
                    <Tab label="Temperature" value="1" />
                    <Tab label="Heart Beat" value="2" />
                    <Tab label="Blood Oxygen" value="3" />
                    <Tab label="Blood Pressure" value="4" />
                    <LoadingButton
                      className="right-0"
                      variant="contained"
                      color="success"
                      loading={loading}
                      onClick={() => getVitalsDetails(currentPatient)}
                    >
                      Refresh Vitals
                    </LoadingButton>
                  </TabList>
                </Box>
                <TabPanel value="1" className="overflow-x-scroll !w-full">
                  {patient ? (
                    <LineChart
                      width={1000}
                      height={250}
                      className="!min-w-fit !h-[300px] mx-auto"
                      data={patient.vitals}
                      margin={{ top: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={(e) => formatDate(e.createdAt)}
                        fontSize={8}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={(e) => e.temperature}
                        stroke="Green"
                        unit={"°C"}
                        name="Temperature"
                      />
                    </LineChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
                <TabPanel value="2" className="overflow-x-scroll !w-full">
                  {patient ? (
                    <AreaChart
                      width={1000}
                      height={250}
                      className="!min-w-fit !h-[300px] mx-auto"
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
                        unit={"bpm"}
                      />
                    </AreaChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
                <TabPanel value="3" className="overflow-x-scroll !w-full">
                  {patient ? (
                    <BarChart
                      width={730}
                      height={250}
                      data={patient.vitals}
                      className="!min-w-fit !h-[300px] mx-auto"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey={(e) => formatDate(e.createdAt)}
                        fontSize={8}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="blood_oxygen" fill="orange" unit={"%"} />
                    </BarChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
                <TabPanel value="4" className="!w-full">
                  {patient ? (
                    <LineChart
                      width={1000}
                      height={250}
                      className="!min-w-fit !h-[300px] mx-auto"
                      data={patient.vitals}
                      margin={{ top: 5, bottom: 5 }}
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
                        unit={"mmHg"}
                        name="Systolic Pressure"
                      />
                      <Line
                        type="monotone"
                        dataKey={(e) => e.blood_pressure.split("/")[1]}
                        stroke="Blue"
                        name="Diastolic Pressure"
                        unit={"mmHg"}
                      />
                    </LineChart>
                  ) : (
                    <Skeleton height={300} width={1000} className="mx-auto" />
                  )}
                </TabPanel>
              </TabContext>
            </Box>
            <p className="font-bold block text-center text-xl border border-t-green-500 py-2">
              Choose a period range
            </p>
            <div className="flex gap-5 justify-center p-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  onChange={(value: Dayjs | null) => {
                    setRange((prevRangeData) => ({
                      ...prevRangeData,
                      fromDate: formatToOriginalDate(value?.toDate()),
                    }));
                  }}
                  label="Start Date"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  minDate={dayjs(range.fromDate)}
                  label="End Date"
                  onChange={(value: Dayjs | null) => {
                    setRange((prevRangeData) => ({
                      ...prevRangeData,
                      toDate: formatToOriginalDate(value?.toDate()),
                    }));
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Vitals;
