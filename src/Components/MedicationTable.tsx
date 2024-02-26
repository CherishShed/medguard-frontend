import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { Skeleton } from "@mui/material";

import { formatNormalDate } from "../Utils/helpers";
// import axios from "axios";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

export type medicationType = {
  name: string;
  type: string;
  start_date: string;
  end_date: string;
};
type medProps = {
  data: medicationType[] | null;
  title: string;
};
function MedicationDataTable({ data, title }: medProps) {
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
  ];

  const options: MUIDataTableOptions = {
    filterType: "checkbox",
    onChangePage: (currentPage) => {
      console.log(currentPage);
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
