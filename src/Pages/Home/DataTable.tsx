import MUIDataTable, {
  MUIDataTableMeta,
  MUIDataTableOptions,
} from "mui-datatables";
import { TableStore } from "../../Context/States";
import { IconButton, Skeleton } from "@mui/material";
import {
  Flag,
  MedicalInformation,
  QueryStatsRounded,
  RemoveRedEye,
} from "@mui/icons-material";
import { formatDate } from "../../Utils/helpers";

const columns = [
  {
    name: "hospitalNumber",
    label: "Hospital Number",
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: "firstName",
    label: "First Name",
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: "lastName",
    label: "Last Name",
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: "status",
    label: "Status",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (
        value: unknown,
        tableMeta: MUIDataTableMeta<unknown>
      ) => {
        return (
          <p className="font-medium">
            {value == "good" ? (
              <Flag className="text-green-600" />
            ) : value == "abnormal" ? (
              <Flag className="text-yellow-600" />
            ) : value == "bad" ? (
              <Flag className="text-red-600" />
            ) : (
              ""
            )}
          </p>
        );
      },
    },
  },
  {
    name: "latestVitals",
    label: "Last Measurement",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        value: unknown,
        tableMeta: MUIDataTableMeta<unknown>
      ) => {
        return (
          <p className="font-medium">
            {" "}
            {value.blood_pressure} - {value.heart_beat} BPM
            <span className="block text-xs">{formatDate(value.updatedAt)}</span>
          </p>
        );
      },
    },
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (
        value: unknown,
        tableMeta: MUIDataTableMeta<unknown>
      ) => {
        return (
          <div className="flex gap-3 items-center">
            <IconButton onClick={() => console.log("view")}>
              <RemoveRedEye
                className="text-green-500"
                titleAccess="View Patient Info"
              />
            </IconButton>
            <IconButton onClick={() => console.log("edit")}>
              <MedicalInformation
                className="text-blue-500"
                titleAccess="View Patient Medication"
              />
            </IconButton>
            <IconButton onClick={() => console.log("edit")}>
              <QueryStatsRounded
                className="text-red-500"
                titleAccess="View Patient Vitals"
              />
            </IconButton>
          </div>
        );
      },
    },
  },
];
const options = {
  filterType: "checkbox",
};

function DataTable() {
  const data = TableStore((store) => store.data);
  return (
    <div>
      {!data ? (
        <Skeleton width={"100%"} height={"50vh"} animation="wave" />
      ) : (
        <MUIDataTable
          title={"Patients List"}
          data={data as object[]}
          columns={columns}
          options={options as MUIDataTableOptions}
        />
      )}
    </div>
  );
}

export default DataTable;
