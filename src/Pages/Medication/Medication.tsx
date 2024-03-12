import { useEffect, useState } from "react";
import {
  PrescriptionModalStore,
  ToastStore,
  patientType,
} from "../../Context/States";
import {
  URLSearchParamsInit,
  createSearchParams,
  useSearchParams,
} from "react-router-dom";
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
import MedicationModal from "../../Components/MedicationModal";
import PrescriptionModal from "@/Components/PrescriptionModal";
import PrescriptionDetailsModal from "@/Components/PrescriptionDetailsModal";

function Medication() {
  const openToast = ToastStore((store) => store.openToast);
  const [activeMedData, setActiveMedData] = useState<medicationType[] | null>(
    null
  );
  const [endedMedData, setEndedMedData] = useState<medicationType[] | null>(
    null
  );
  const [patient, setPatient] = useState<patientType | null>(null);
  const [value, setValue] = useState("1");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(getQueryParameters());
  const [medModal, setMedModal] = useState({
    prescriptionId: "",
    open: false,
  });
  const [prescriptionModal, setPrescriptionModal] = useState(false);

  function showMedModal(id: string) {
    setMedModal({ prescriptionId: id, open: true });
  }
  function hideMedModal() {
    setMedModal({ prescriptionId: "", open: false });
  }

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
  const openPrescriptionModal = PrescriptionModalStore(
    (store) => store.showModal
  );
  const setPrescriptionDetails = PrescriptionModalStore(
    (store) => store.setModalDetails
  );
  const showPrescriptionModal = () => {
    setPrescriptionModal(true);
  };
  const hidePrescriptionModal = () => {
    setPrescriptionModal(false);
  };
  const showPrescriptionDetailsModal = (prescriptionId: string) => {
    openPrescriptionModal();
    axios
      .get(
        `https://medguard.vercel.app/api/healthworker/patient/singleprescription?prescriptionId=${prescriptionId}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        setPrescriptionDetails(response.data.prescription);
      })
      .catch((error) => {
        if (error.response) {
          openToast(error.response.data.message, "error");
        } else {
          openToast(error.message, "error");
        }
      });
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = createSearchParams({
      hospitalNumber: searchValue,
    } as URLSearchParamsInit);
    setSearchParams(params);
  }, [searchValue]);

  const getMedDetails = () => {
    setLoading(true);
    if (searchValue !== "") {
      axios
        .get(
          `https://medguard.vercel.app/api/healthworker/patient/prescription?hospitalNumber=${searchValue}`,
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
          setLoading(false);
          if (error.response) {
            openToast(error.response.data.message, "error");
          } else {
            openToast(error.message, "error");
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
  console.log(patient);
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
                {!patient?.lastUpdatedBy ? (
                  <Skeleton width={"100px"} />
                ) : (
                  `${patient?.lastUpdatedBy.firstName}
                ${patient?.lastUpdatedBy.lastName}`
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
                    showPrescriptionModal={showPrescriptionModal}
                    showPrescriptionDetailsModal={showPrescriptionDetailsModal}
                    showMedModal={showMedModal}
                    title={"Active Prescriptions"}
                  />
                </TabPanel>
                <TabPanel value="2">
                  <MedicationDataTable
                    data={endedMedData}
                    showPrescriptionModal={showPrescriptionModal}
                    showPrescriptionDetailsModal={showPrescriptionDetailsModal}
                    showMedModal={showMedModal}
                    title={"Older Prescriptions"}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        )}
      </section>
      <MedicationModal
        open={medModal.open}
        hideModal={hideMedModal}
        currentPatient={patient?.hospitalNumber}
        getMedDetails={getMedDetails}
        prescriptionId={medModal.prescriptionId}
      />
      <PrescriptionDetailsModal currentPatient={patient?.hospitalNumber} />
      <PrescriptionModal
        currentPatient={patient?.hospitalNumber}
        getMedDetails={getMedDetails}
        hideModal={hidePrescriptionModal}
        open={prescriptionModal}
      />
    </div>
  );
}

export default Medication;
