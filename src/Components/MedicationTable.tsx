import MUIDataTable, {
  MUIDataTableMeta,
  MUIDataTableOptions,
} from "mui-datatables";
import { Button, IconButton, Skeleton } from "@mui/material";

import { formatDate, formatNormalDate } from "../Utils/helpers";
import { Add, RemoveRedEye } from "@mui/icons-material";
// import axios from "axios";

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
  showPrescriptionDetailsModal: (prescriptionId: string) => void;
  showPrescriptionModal: () => void;
  showMedModal: (id: string) => void;
};
function MedicationDataTable({
  data,
  title,
  showMedModal,
  showPrescriptionModal,
  showPrescriptionDetailsModal,
}: medProps) {
  const columns = [
    {
      name: "_id",
      label: "Prescription ID",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "drugs",
      label: "Number of Drugs",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value: unknown) => {
          return (value as Array<object>).length;
        },
      },
    },
    {
      name: "prescriptionDate",
      label: "Date Prescribed",
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
        filter: true,
        sort: true,
        customBodyRender: (value: unknown) => {
          return formatDate(value as string);
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
          return (
            <div className="flex gap-3 items-center">
              <IconButton
                onClick={() => {
                  showPrescriptionDetailsModal(tableMeta.rowData[0]);
                }}
              >
                <RemoveRedEye
                  className="text-green-500"
                  titleAccess="View Prescription Info"
                />
              </IconButton>
              {title == "Active Prescriptions" ? (
                <IconButton
                  onClick={() => {
                    showMedModal(tableMeta.rowData[0]);
                  }}
                >
                  <Add className="text-red-500" titleAccess="Add Medication" />
                </IconButton>
              ) : (
                ""
              )}
            </div>
          );
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
        <Button
          variant="outlined"
          color="success"
          onClick={showPrescriptionModal}
        >
          Add Prescription
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
