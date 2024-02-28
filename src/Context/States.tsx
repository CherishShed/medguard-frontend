import { create } from "zustand";
import { produce } from "immer";
import { AlertColor } from "@mui/material";
import { toast } from "react-toastify";
export type userType = {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  changedPassword: string;
};

export type patientType = {
  firstName: string;
  lastName: string;
  vitals: string;
  hospitalNumber: string;
  gender: string;
  bloodgroup: string;
  dateOfBirth: string;
  genotype: string;
  status: string;
  phone_number: 1;
  emergencyContact1: string;
  emergencyContact2: string;
  lastUpdatedBy: { firstName: string; lastName: string };
};
type userStoreType = {
  user: userType | null;
  isAuthenticated: boolean;
  setUser: (user: userType | null, authStatus: boolean) => void;
};

export const UserStore = create<userStoreType>()((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user, authStatus) => {
    set(
      produce((store) => {
        store.isAuthenticated = authStatus;
        store.user = user;
      })
    );
  },
}));

type dataTableType = {
  data: patientType[] | object[] | null;
  setTableData: (data: patientType[]) => void;
};

export const TableStore = create<dataTableType>()((set) => ({
  data: null,
  setTableData: (data) => {
    set(
      produce((store) => {
        store.data = data;
      })
    );
  },
}));

type ToastType = {
  open: boolean;
  message: string;
  severity: AlertColor | null;
  openToast: (message: string, severity: string) => void;
  closeToast: () => void;
};

const notify = (toastText: string, toastSeverity: string, store: ToastType) => {
  if (toastSeverity === "error") {
    toast.error(toastText, {
      position: "top-right",
      className: "foo-bar",
      pauseOnHover: false,
      onClose: store.closeToast,
      autoClose: 1000,
      theme: "light",
    });
  } else if (toastSeverity === "success") {
    toast.success(toastText, {
      position: "top-right",
      onClose: store.closeToast,
      className: "foo-bar",
      pauseOnHover: false,
      autoClose: 1000,
      theme: "light",
    });
  } else {
    return;
  }
};

export const ToastStore = create<ToastType>()((set) => ({
  open: false,
  message: "",
  severity: null,
  openToast: (message, severity) => {
    set(
      produce((store) => {
        store.message = message;
        store.open = true;
        store.severity = severity;
        console.log("in here");
        notify(message, severity, store);
      })
    );
  },
  closeToast: () => {
    set(
      produce((store) => {
        store.message = "";
        store.open = false;
        store.severity = null;
      })
    );
  },
}));

type detailsModal = {
  open: boolean;
  showModal: () => void;
  hideModal: () => void;
  modalDetails: patientType | null;
  setModalDetails: (details: patientType | null) => void;
};

export const ModalStore = create<detailsModal>()((set) => ({
  open: false,
  modalDetails: null,
  setModalDetails: (details) => {
    set(
      produce((store) => {
        store.modalDetails = details;
      })
    );
  },
  showModal: () => {
    set(
      produce((store) => {
        store.open = true;
      })
    );
  },
  hideModal: () => {
    set(
      produce((store) => {
        store.open = false;
        store.modalDetails = null;
      })
    );
  },
}));
