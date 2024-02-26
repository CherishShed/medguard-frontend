import { useEffect, useState } from "react";
import { ToastStore, UserStore, patientType } from "../../Context/States";
import {
  URLSearchParamsInit,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { checkAuth } from "../../Utils/helpers";
import axios from "axios";
import MedicationDataTable, {
  medicationType,
} from "../../Components/MedicationTable";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  Skeleton,
} from "@mui/material";
import { Search } from "@mui/icons-material";

function Medication() {
  const openToast = ToastStore((store) => store.openToast);
  const setUser = UserStore((store) => store.setUser);
  const [activeMedData, setActiveMedData] = useState<medicationType[] | null>(
    null
  );
  const [endedMedData, setEndedMedData] = useState<medicationType[] | null>(
    null
  );
  const [patient, setPatient] = useState<patientType | null>(null);
  const navigate = useNavigate();
  const [value, setValue] = useState("1");
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [loading, setLoading] = useState(false);

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
  const getMedDetails = () => {
    setLoading(true);
    if (searchValue !== "") {
      console.log(searchValue);
      axios
        .get(
          `http://localhost:8081/api/healthworker/patient/medication?hospitalNumber=${searchValue}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        )
        .then((response) => {
          setPatient(response.data.patient);
          setActiveMedData(response.data.activePrescriptions);
          setEndedMedData(response.data.endedPrescriptions);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status != 401) {
            openToast(error.response.data.message, "error");
          }
        });
    }
  };
  useEffect(() => {
    if (getQueryParameters()) {
      getMedDetails();
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
                    setActiveMedData(null);
                    setEndedMedData(null);
                    getMedDetails();
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
              Enter Hospital Number to View Records
            </p>
          )}
        </div>
        {(loading || patient) && (
          <div>
            <p className="font-bold bg-[#436850] text-white p-2 flex gap-2">
              <span>Last Modified By: </span>
              <span className="font-normal">
                {!patient?.lastUpdatedBy[0] ? (
                  <Skeleton width={"100px"} />
                ) : (
                  `${patient?.lastUpdatedBy[0].firstName}
                ${patient?.lastUpdatedBy[0].lastName}`
                )}
              </span>
            </p>
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
                    <Tab label="Active Prescriptions" value="1" />
                    <Tab label="Finished Prescriptions" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <MedicationDataTable
                    data={activeMedData}
                    title={"Active Prescriptions"}
                  />
                </TabPanel>
                <TabPanel value="2">
                  <MedicationDataTable
                    data={endedMedData}
                    title={"Older Prescriptions"}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        )}
      </section>
    </div>
  );
}

export default Medication;
