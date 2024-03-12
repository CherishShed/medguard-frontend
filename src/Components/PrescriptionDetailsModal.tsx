import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import {
  Button,
  FormGroup,
  FormLabel,
  Skeleton,
  TextField,
} from "@mui/material";
import { PrescriptionModalStore } from "@/Context/States";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  minHeight: "fit-content",
  maxHeight: 600,
  bgcolor: "background.paper",
  border: "2px solid green",
  boxShadow: 24,
  p: 4,
};
import PrescriptionDrugDetails from "./PrescriptionDetailsModalDrugDetails";

type modalProps = {
  currentPatient: string | undefined;
};

export default function PrescriptionDetailsModal({
  currentPatient,
}: modalProps) {
  const prescriptionData = PrescriptionModalStore(
    (store) => store.modalDetails
  );
  const hideModal = PrescriptionModalStore((store) => store.hideModal);
  const open = PrescriptionModalStore((store) => store.open);
  console.log(prescriptionData);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => {
        hideModal();
      }}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={style}
          className="rounded-2xl flex flex-col gap-4 overflow-y-scroll relative"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium">Prescription Details</h2>
            {!prescriptionData && (
              <>
                <Skeleton width={"100%"} height={"80px"} />
                <Skeleton width={"100%"} height={"80px"} />
                <Skeleton width={"100%"} height={"80px"} />
                <Skeleton width={"100%"} height={"80px"} />
                <Skeleton width={"100%"} height={"80px"} />
                <Skeleton width={"100%"} height={"80px"} />
                <Skeleton width={"100%"} height={"80px"} />
              </>
            )}
            {prescriptionData && (
              <>
                <TextField
                  className="w-full"
                  type="date"
                  value={prescriptionData.prescriptionDate}
                  label="Date Prescribed"
                  inputProps={{ readOnly: true }}
                  color="success"
                />
                <TextField
                  className="w-full"
                  value={currentPatient}
                  inputProps={{ readOnly: true }}
                  label="Patient Hospital Number"
                  color="success"
                />
                <FormGroup>
                  <FormLabel className="!p-2">Last Updated By</FormLabel>
                  <div className="flex gap-3">
                    <TextField
                      className="w-full"
                      value={prescriptionData.lastUpdatedBy?.firstName}
                      inputProps={{ readOnly: true }}
                      label="First Name"
                      color="success"
                    />
                    <TextField
                      className="w-full"
                      value={prescriptionData.lastUpdatedBy?.lastName}
                      inputProps={{ readOnly: true }}
                      label="Last Name"
                      color="success"
                    />
                  </div>
                </FormGroup>
              </>
            )}
          </div>
          <h2 className="font-bold text-xl">Drugs</h2>
          <div
            id="medication-list"
            className="modal-box !min-h-[400px] h-fit overflow-y-scroll"
          >
            {prescriptionData?.drugs.map((drug, index) => (
              <PrescriptionDrugDetails
                index={index}
                medData={drug}
                key={index}
              />
            ))}
          </div>
          <hr className="border-1 border-[#BFEA7C]" />
          <div>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={() => {
                hideModal();
              }}
              size="large"
            >
              close
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
