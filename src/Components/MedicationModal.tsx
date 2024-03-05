import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
// import { ModalStore } from "../Context/States";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";
import axios from "axios";
import { ToastStore } from "@/Context/States";

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "fit-content",
  maxHeight: 400,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 24,
  p: 4,
};
import { formatToOriginalDate } from "@/Utils/helpers";
function formatTime(dateString: string | number | undefined) {
  if (dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  } else {
    return "";
  }
}
type modalProps = {
  open: boolean;
  hideModal: () => void;
  getMedDetails: () => void;
  currentPatient: string | undefined;
};
export default function MedicationModal({
  open,
  hideModal,
  currentPatient,
  getMedDetails,
}: modalProps) {
  //   const modalDetails = ModalStore((store) => store.modalDetails);
  const openToast = ToastStore((store) => store.openToast);
  const [medData, setMedData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    type: "",
    instructions: "",
    morning: { amount: 0, time: "" },
    afternoon: { amount: 0, time: "" },
    evening: { amount: 0, time: "" },
  });

  function submitMedication() {
    axios
      .post(
        `https://medguard.vercel.app/api/healthworker/patient/medication?hospitalNumber=${currentPatient}`,
        medData,
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
      onClose={hideModal}
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
          <h2 className="text-xl font-medium">Medication</h2>
          <div className="modal-box flex flex-col gap-4 h-full relative overflow-y-auto p-2">
            <TextField
              label="Name"
              fullWidth
              variant="outlined"
              color="success"
              value={medData.name}
              onChange={(e) => {
                setMedData((prevMedData) => ({
                  ...prevMedData,
                  name: e.target.value,
                }));
              }}
            />
            <div className="flex gap-3">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  minDate={dayjs(formatToOriginalDate(new Date(Date.now())))}
                  defaultValue={dayjs(
                    formatToOriginalDate(new Date(Date.now()))
                  )}
                  onChange={(value: Dayjs | null) => {
                    setMedData((prevMedData) => ({
                      ...prevMedData,
                      start_date: formatToOriginalDate(value?.toDate()),
                    }));
                  }}
                  label="Start Date"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  minDate={dayjs(medData.start_date)}
                  label="End Date"
                  onChange={(value: Dayjs | null) => {
                    setMedData((prevMedData) => ({
                      ...prevMedData,
                      end_date: formatToOriginalDate(value?.toDate()),
                    }));
                  }}
                />
              </LocalizationProvider>
            </div>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" color="success">
                Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Type"
                color="success"
                value={medData.type}
                onChange={(e) => {
                  setMedData((prevMedData) => ({
                    ...prevMedData,
                    type: e.target.value,
                  }));
                }}
              >
                <MenuItem value={"Tablet"}>Tablet</MenuItem>
                <MenuItem value={"Injection"}>Injection</MenuItem>
                <MenuItem value={"Inhaler"}>Inhaler</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Instructions"
              fullWidth
              variant="outlined"
              color="success"
              onChange={(e) => {
                setMedData((prevMedData) => ({
                  ...prevMedData,
                  instructions: e.target.value,
                }));
              }}
            />
            <section>
              <hr className="bg-lime-500 h-[3px] mb-2" />
              <p className="text-xs text-center text-red-500">
                Fill in necessary fields.{" "}
                <span className="block">
                  If the drug is not to be taken at that time of the day, leave
                  blank
                </span>
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-bold mb-1">Morning</p>
                  <div className="flex gap-3">
                    <TextField
                      label="Amount"
                      type="number"
                      defaultValue={medData.morning.amount}
                      fullWidth
                      variant="outlined"
                      color="success"
                      onChange={(e) => {
                        setMedData((prevMedData) => ({
                          ...prevMedData,
                          morning: {
                            ...prevMedData.morning,
                            amount: parseInt(e.target.value),
                          },
                        }));
                      }}
                    />

                    <TimePicker
                      label="Time To take"
                      onChange={(value: { $d: string } | null) => {
                        setMedData((prevMedData) => ({
                          ...prevMedData,
                          morning: {
                            ...prevMedData.morning,
                            time: formatTime(value?.$d),
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-1">Afternoon</p>
                  <div className="flex gap-3">
                    <TextField
                      label="Amount"
                      type="number"
                      defaultValue={0}
                      fullWidth
                      variant="outlined"
                      color="success"
                      onChange={(e) => {
                        setMedData((prevMedData) => ({
                          ...prevMedData,
                          afternoon: {
                            ...prevMedData.afternoon,
                            amount: parseInt(e.target.value),
                          },
                        }));
                      }}
                    />

                    <TimePicker
                      label="Time To take"
                      onChange={(value: { $d: string } | null) => {
                        setMedData((prevMedData) => ({
                          ...prevMedData,
                          afternoon: {
                            ...prevMedData.afternoon,
                            time: formatTime(value?.$d),
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold mb-1">Evening</p>
                  <div className="flex gap-3">
                    <TextField
                      label="Amount"
                      type="number"
                      defaultValue={0}
                      fullWidth
                      variant="outlined"
                      color="success"
                      onChange={(e) => {
                        setMedData((prevMedData) => ({
                          ...prevMedData,
                          evening: {
                            ...prevMedData.evening,
                            amount: parseInt(e.target.value),
                          },
                        }));
                      }}
                    />

                    <TimePicker
                      label="Time To take"
                      onChange={(value: { $d: string } | null) => {
                        setMedData((prevMedData) => ({
                          ...prevMedData,
                          evening: {
                            ...prevMedData.evening,
                            time: formatTime(value?.$d),
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <hr className="border-1 border-[#BFEA7C]" />
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              submitMedication();
              hideModal();
              setMedData({
                name: "",
                start_date: "",
                end_date: "",
                type: "",
                instructions: "",
                morning: { amount: 0, time: "" },
                afternoon: { amount: 0, time: "" },
                evening: { amount: 0, time: "" },
              });
            }}
          >
            Add
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
