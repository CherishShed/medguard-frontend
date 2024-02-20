import { create } from "zustand";
import { produce } from "immer";
import { AlertColor } from "@mui/material";
type userType = {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  changedPassword: string;
};
type userStoreType = {
  user: userType | null;
  isAuthenticated: boolean;
  setUser: (user: userType) => void;
};

export const userStore = create<userStoreType>()((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => {
    set(
      produce((store) => {
        store.isAuthenticated = true;
        store.user = user;
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

// // type detailsModal = {
// //   open: boolean;
// //   showModal: () => void;
// //   hideModal: () => void;
// //   type: string | null;
// //   modalDetails: TVShow | null;
// //   setModalDetails: (
// //     details: TVShow | null,
// //     cast: movieCredits | null,
// //     type: string | null
// //   ) => void;
// // };

// // export const modalStore = create<detailsModal>()((set) => ({
// //   open: false,
// //   modalDetails: null,
// //   type: null,
// //   setModalDetails: (details, cast, type) => {
// //     set(
// //       produce((store) => {
// //         store.type = type;
// //         store.modalDetails = details;
// //         store.modalDetails.cast = cast;
// //       })
// //     );
// //   },
// //   showModal: () => {
// //     set(
// //       produce((store) => {
// //         store.open = true;
// //       })
// //     );
// //   },
// //   hideModal: () => {
// //     set(
// //       produce((store) => {
// //         store.open = false;
// //       })
// //     );
// //   },
// // }));
