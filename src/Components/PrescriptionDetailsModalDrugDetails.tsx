import { convertTo24HourFormat, toTitleCase } from "@/Utils/helpers";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";

export type drugDetailsType = {
  index: number;
  medData: {
    name: string;
    start_date: string;
    end_date: string;
    type: string;
    instructions: string;
    morning: { amount: number; time: string };
    afternoon: { amount: number; time: string };
    night: { amount: number; time: string };
  } | null;
};
function PrescriptionDrugDetails({ index, medData }: drugDetailsType) {
  return (
    <div className=" my-4 flex flex-col gap-4 h-full relative p-2 border border-slate-500 rounded-lg">
      <h2 className="font-medium">Drug {index + 1}</h2>
      {!medData && (
        <>
          <Skeleton width={"100%"} height={"50px"} />
          <Skeleton width={"100%"} height={"50px"} />
          <Skeleton width={"100%"} height={"50px"} />
        </>
      )}
      {medData && (
        <>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            color="success"
            value={medData.name}
            InputProps={{
              readOnly: true,
            }}
          />
          <div className="flex gap-3">
            <TextField
              className="w-full"
              type="date"
              value={medData.start_date}
              label="Start Date"
              inputProps={{ readOnly: true }}
              color="success"
            />
            <TextField
              className="w-full"
              type="date"
              value={medData.end_date}
              label="End Date"
              inputProps={{ readOnly: true }}
              color="success"
            />
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
              value={toTitleCase(medData.type)}
              readOnly
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
            value={medData.instructions}
            InputProps={{
              readOnly: true,
            }}
          />
        </>
      )}
      {!medData && (
        <>
          <Skeleton width={"100%"} height={"50px"} />
          <Skeleton width={"100%"} height={"50px"} />
          <Skeleton width={"100%"} height={"50px"} />
        </>
      )}
      {medData && (
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
                  defaultValue={0}
                  fullWidth
                  variant="outlined"
                  color="success"
                  value={medData.morning.amount}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  className="w-full"
                  type="time"
                  value={convertTo24HourFormat(medData.morning.time)}
                  label="Time To take"
                  inputProps={{ readOnly: true }}
                  color="success"
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
                  value={medData.afternoon.amount}
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  className="w-full"
                  type="time"
                  value={convertTo24HourFormat(medData.afternoon.time)}
                  label="Time To take"
                  inputProps={{ readOnly: true }}
                  color="success"
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
                  value={medData.night.amount}
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <TextField
                  className="w-full"
                  type="time"
                  value={convertTo24HourFormat(medData.night.time)}
                  label="Time To take"
                  inputProps={{ readOnly: true }}
                  color="success"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default PrescriptionDrugDetails;
