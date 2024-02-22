import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { ModalStore } from "../Context/States";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PatientModal() {
  const open = ModalStore((store) => store.open);
  const modalDetails = ModalStore((store) => store.modalDetails);
  const hideModal = ModalStore((store) => store.hideModal);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={hideModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            First Name: {modalDetails?.firstName}
          </Typography>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            First Gender: {modalDetails?.gender}
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
}
