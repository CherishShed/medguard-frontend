import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { formatToOriginalDate } from "@/Utils/helpers";
import { TimePicker } from "@mui/x-date-pickers";

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

function MedicationDetails({
  index,
  changeDrug,
}: {
  index: number;
  changeDrug: (
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
    subField?: string
  ) => void;
  medData: {
    name: string;
    start_date: string;
    end_date: string;
    type: string;
    instructions: string;
    morning: { amount: number; time: string };
    afternoon: { amount: number; time: string };
    night: { amount: number; time: string };
  }[];
}) {
  return (
    <div className="flex flex-col gap-4 h-full relative overflow-y-auto p-2 border border-green-700 rounded-lg">
      <h2 className="font-medium">Drug {index + 1}</h2>
      <TextField
        label="Name"
        fullWidth
        variant="outlined"
        color="success"
        onChange={(e) => {
          changeDrug(index, "name", e.target.value);
        }}
      />
      <div className="flex gap-3">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="w-full"
            onChange={(value: Dayjs | null) => {
              changeDrug(
                index,
                "start_date",
                formatToOriginalDate(value?.toDate())
              );
            }}
            label="Start Date"
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="w-full"
            label="End Date"
            onChange={(value: Dayjs | null) => {
              changeDrug(
                index,
                "end_date",
                formatToOriginalDate(value?.toDate())
              );
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
          onChange={(e) => {
            changeDrug(index, "type", e.target.value as string);
          }}
        >
          <MenuItem value={"Tablet"}>Tablet</MenuItem>
          <MenuItem value={"Injection"}>Injection</MenuItem>
          <MenuItem value={"Inhaler"}>Inhaler</MenuItem>
          <MenuItem value={"Cough Syrup"}>Cough Syrup</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Instructions"
        fullWidth
        variant="outlined"
        color="success"
        onChange={(e) => {
          changeDrug(index, "instructions", e.target.value);
        }}
      />
      <section>
        <hr className="bg-lime-500 h-[3px] mb-2" />
        <p className="text-xs text-center text-red-500">
          Fill in necessary fields.{" "}
          <span className="block">
            If the drug is not to be taken at that time of the day, leave blank
          </span>
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-bold mb-1">Morning</p>
            <div className="flex gap-3">
              <TextField
                label="Amount"
                type="number"
                defaultValue={0}
                fullWidth
                variant="outlined"
                color="success"
                onChange={(e) => {
                  changeDrug(index, "morning", e.target.value, "amount");
                }}
              />
              <TimePicker
                label="Time To take"
                onChange={(value: { $d: string } | null) => {
                  changeDrug(index, "morning", formatTime(value?.$d), "time");
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
                  changeDrug(index, "afternoon", e.target.value, "amount");
                }}
              />

              <TimePicker
                label="Time To take"
                onChange={(value: { $d: string } | null) => {
                  changeDrug(index, "afternoon", formatTime(value?.$d), "time");
                }}
              />
            </div>
          </div>
          <div>
            <p className="font-bold mb-1">night</p>
            <div className="flex gap-3">
              <TextField
                label="Amount"
                type="number"
                defaultValue={0}
                fullWidth
                variant="outlined"
                color="success"
                onChange={(e) => {
                  changeDrug(index, "night", e.target.value, "amount");
                }}
              />

              <TimePicker
                label="Time To take"
                onChange={(value: { $d: string } | null) => {
                  changeDrug(index, "night", formatTime(value?.$d), "time");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MedicationDetails;
