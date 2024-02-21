import MUIDataTable, {
  MUIDataTableMeta,
  MUIDataTableOptions,
} from "mui-datatables";
import { TableStore } from "../../Context/States";
import { IconButton } from "@mui/material";
import {
  MedicalInformation,
  QueryStatsRounded,
  RemoveRedEye,
} from "@mui/icons-material";

const columns = [
  {
    name: "hospitalNumber",
    label: "Hospital Number",
    options: {
      filter: true,
      sort: false,
    },
  },
  {
    name: "firstName",
    label: "First Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "lastName",
    label: "Last Name",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (
        value: unknown,
        tableMeta: MUIDataTableMeta<unknown>
      ) => {
        console.log(value, tableMeta);
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
      <MUIDataTable
        title={"Patients List"}
        data={data as object[]}
        columns={columns}
        options={options as MUIDataTableOptions}
      />
    </div>
  );
}

export default DataTable;
