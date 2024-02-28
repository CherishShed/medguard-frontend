import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { Button, Skeleton } from "@mui/material";

import { formatDate, formatNormalDate } from "../Utils/helpers";
// import axios from "axios";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

export type medicationType = {
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
};
type medProps = {
  data: medicationType[] | null;
  title: string;
  showModal: () => void;
};
function MedicationDataTable({ data, title, showModal }: medProps) {
  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "type",
      label: "Type",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "start_date",
      label: "Start Date",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: unknown) => {
          return formatNormalDate(value as string);
        },
      },
    },
    {
      name: "end_date",
      label: "End Date",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: unknown) => {
          return formatNormalDate(value as string);
        },
      },
    },
    {
      name: "updatedAt",
      label: "Last Updated",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: unknown) => {
          return formatDate(value as string);
        },
      },
    },
  ];
  const options: MUIDataTableOptions = {
    filterType: "checkbox",
    onChangePage: (currentPage) => {
      console.log(currentPage);
    },
    customToolbar: () => {
      return title == "Active Prescriptions" ? (
        <Button variant="outlined" color="success" onClick={showModal}>
          Add Medication
        </Button>
      ) : (
        <></>
      );
    },
  };

  return (
    <>
      {!data ? (
        <Skeleton width={"100%"} height={"50vh"} animation="wave" />
      ) : (
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={options as MUIDataTableOptions}
        />
      )}
    </>
  );
}

export default MedicationDataTable;
