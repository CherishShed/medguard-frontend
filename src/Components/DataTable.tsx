import MUIDataTable, {
  MUIDataTableMeta,
  MUIDataTableOptions,
} from "mui-datatables";
import { ModalStore, TableStore, ToastStore } from "../Context/States";
import { IconButton, Skeleton } from "@mui/material";
import {
  Flag,
  MedicalInformation,
  QueryStatsRounded,
  RemoveRedEye,
} from "@mui/icons-material";
import { formatDate } from "../Utils/helpers";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";

function DataTable() {
  const data = TableStore((store) => store.data);
  const openToast = ToastStore((store) => store.openToast);
  const setModalDetails = ModalStore((store) => store.setModalDetails);
  const showModal = ModalStore((store) => store.showModal);
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
        customBodyRender: (value: unknown) => {
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
        customBodyRender: (value: {
          blood_pressure: string;
          heart_beat: number;
          blood_oxygen: number;
          updatedAt: string;
        }) => {
          return (
            <p className="font-medium">
              {" "}
              {value.blood_pressure}mmHg - {value.heart_beat}bpm
              <span className="block text-xs">
                {formatDate(value.updatedAt)}
              </span>
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
        customBodyRender: function Actions(
          value: unknown,
          tableMeta: MUIDataTableMeta
        ) {
          console.log(value);

          const setData = () => {
            axios
              .get(
                `https://medguard.vercel.app/api/healthworker/patient?hospitalNumber=${tableMeta.rowData[0]}`,
                {
                  headers: { Authorization: localStorage.getItem("token") },
                }
              )
              .then((response) => {
                setModalDetails(response.data.patient);
              })
              .catch((error) => {
                openToast(error.response.data.message, "error");
              });
          };

          return (
            <div className="flex gap-3 items-center">
              <IconButton
                onClick={() => {
                  setData();
                  showModal();
                }}
              >
                <RemoveRedEye
                  className="text-green-500"
                  titleAccess="View Patient Info"
                />
              </IconButton>

              <Link
                to={{
                  pathname: `/medication`,
                  search: `hospitalNumber=${encodeURIComponent(
                    tableMeta.rowData[0]
                  )}`,
                }}
              >
                <IconButton>
                  <MedicalInformation
                    className="text-blue-500"
                    titleAccess="View Patient Medication"
                  />
                </IconButton>
              </Link>
              <Link
                to={{
                  pathname: `/vitals`,
                  search: `hospitalNumber=${encodeURIComponent(
                    tableMeta.rowData[0]
                  )}`,
                }}
              >
                <IconButton>
                  <QueryStatsRounded
                    className="text-red-500"
                    titleAccess="View Patient Vitals"
                  />
                </IconButton>
              </Link>
            </div>
          );
        },
      },
    },
  ];

  const getMuiTheme = () =>
    createTheme({
      components: {
        MUIDataTable: {
          styleOverrides: {
            root: {
              maxHeight: 500,
              position: "relative",
              overflowY: "scroll",
              height: "fit-content",
            },
          },
        },
      },
    });

  const options: MUIDataTableOptions = {
    filterType: "checkbox",
    onChangePage: (currentPage) => {
      console.log(currentPage);
    },
  };
  return (
    <ThemeProvider theme={getMuiTheme}>
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
    </ThemeProvider>
  );
}

export default DataTable;
