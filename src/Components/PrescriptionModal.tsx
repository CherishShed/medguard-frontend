import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
// import { ModalStore } from "../Context/States";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import {
  Button,
  //   FormControl,
  //   InputLabel,
  //   MenuItem,
  //   Select,
  //   TextField,
} from "@mui/material";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";
import axios from "axios";
import { ToastStore } from "@/Context/States";
import MedicationDetails from "./MedicationDetails";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "fit-content",
  maxHeight: 600,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 24,
  p: 4,
};
import { formatNormalDate, formatToOriginalDate } from "@/Utils/helpers";

type modalProps = {
  open: boolean;
  hideModal: () => void;
  getMedDetails: () => void;
  currentPatient: string | undefined;
};
export type PrescriptionType = {
  prescriptionDate: string;
  drugs: {
    name: string;
    start_date: string;
    end_date: string;
    type: string;
    instructions: string;
    morning: { amount: number; time: string };
    afternoon: { amount: number; time: string };
    night: { amount: number; time: string };
  }[];
  hospitalNumber: string | undefined;
  lastUpdatedBy: { firstName: string; lastName: string } | null;
};

export default function PrescriptionModal({
  open,
  hideModal,
  currentPatient,
  getMedDetails,
}: modalProps) {
  //   const modalDetails = ModalStore((store) => store.modalDetails);
  const openToast = ToastStore((store) => store.openToast);
  //drug form array
  console.log(currentPatient);
  const handleChangeDrug = (
    index: number,
    field:
      | "morning"
      | "afternoon"
      | "night"
      | "instructions"
      | "end_date"
      | "start_date"
      | "name"
      | "type",
    value: string | number,
    subField?: string // Add this optional parameter for nested fields
  ) => {
    setPrescriptionData((prevState) => ({
      ...prevState,
      drugs: prevState.drugs.map((drug, i) => {
        if (i === index) {
          // Check if the field is nested
          if (subField && field === ("morning" || "afternoon" || "night")) {
            // Update the nested field
            return {
              ...drug,
              [field]: {
                ...drug[field], // Preserve other properties within the nested object
                [subField]: value,
              },
            };
          } else {
            // Update the non-nested field
            return {
              ...drug,
              [field]: value,
            };
          }
        }
        return drug;
      }),
    }));
  };

  const [prescriptionData, setPrescriptionData] = useState<PrescriptionType>({
    prescriptionDate: formatNormalDate(
      new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    ),
    hospitalNumber: currentPatient,
    drugs: [
      {
        name: "",
        start_date: formatNormalDate(
          new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        ),
        end_date: formatNormalDate(
          new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        ),
        type: "",
        instructions: "",
        morning: { amount: 0, time: "" },
        afternoon: { amount: 0, time: "" },
        night: { amount: 0, time: "" },
      },
    ],
    lastUpdatedBy: null,
  });

  const [medicationDetailsList, setMedicationDetailsList] = useState([
    <MedicationDetails
      key={1}
      index={0}
      changeDrug={handleChangeDrug}
      medData={prescriptionData.drugs}
    />,
  ]);

  //   append new drug form to the modal by adding to array
  const addMedicationDetails = () => {
    const newKey = medicationDetailsList.length + 1;
    setMedicationDetailsList([
      ...medicationDetailsList,
      <MedicationDetails
        key={newKey}
        index={newKey}
        changeDrug={handleChangeDrug}
        medData={prescriptionData.drugs.map((drug) => ({
          ...drug,
          night: { amount: 0, time: "" },
        }))}
      />,
    ]);
  };

  function submitMedication() {
    axios
      .post(
        `https://medguard.vercel.app/api/healthworker/patient/prescription`,
        prescriptionData,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        openToast(response.data.message, "success");
        getMedDetails();
      })
      .catch((error) => {
        openToast(error.response.data.message, "error");
      });
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        setMedicationDetailsList([
          <MedicationDetails
            key={1}
            index={0}
            changeDrug={handleChangeDrug}
            medData={prescriptionData.drugs}
          />,
        ]);
        hideModal();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style} className="rounded-2xl flex flex-col gap-4">
          <h2 className="text-xl font-medium">Add Prescription</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="w-full"
              onChange={(value: Dayjs | null) => {
                setPrescriptionData((prevPrescriptionData) => ({
                  ...prevPrescriptionData,
                  prescriptionDate: formatToOriginalDate(value?.toDate()),
                }));
              }}
              label="Date Prescribed"
              readOnly
            />
          </LocalizationProvider>
          <h2 className="font-bold text-xl">Drugs</h2>
          <div id="medication-list" className="modal-box overflow-y-scroll">
            {medicationDetailsList.map((medicalDetails) => medicalDetails)}
          </div>
          <hr className="border-1 border-[#BFEA7C]" />
          <div className="flex gap-3">
            <Button
              fullWidth
              color="info"
              variant="contained"
              onClick={() => {
                addMedicationDetails();
                setPrescriptionData({
                  ...prescriptionData,
                  drugs: [
                    ...prescriptionData.drugs,
                    {
                      name: "",
                      start_date: "",
                      end_date: "",
                      type: "",
                      instructions: "",
                      morning: { amount: 0, time: "" },
                      afternoon: { amount: 0, time: "" },
                      night: { amount: 0, time: "" },
                    },
                  ],
                });
              }}
            >
              Add Drug
            </Button>
            <Button
              fullWidth
              color="success"
              variant="contained"
              onClick={() => {
                submitMedication();
                hideModal();
              }}
            >
              Done
            </Button>
            <Button
              color="error"
              variant="contained"
              size="large"
              onClick={hideModal}
            >
              Close
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
