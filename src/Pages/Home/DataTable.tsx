import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { TableStore } from "../../Context/States";
import { IconButton } from "@mui/material";
import { Edit, RemoveRedEye } from "@mui/icons-material";

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
    label: "actions",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: string, tableMeta: object[]) => {
        return (
          <div className="flex gap-3 items-center justify-center">
            <IconButton onClick={() => console.log("view")}>
              <RemoveRedEye />
            </IconButton>
            <IconButton onClick={() => console.log("edit")}>
              <Edit />
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
