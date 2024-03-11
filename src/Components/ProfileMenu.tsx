import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { ProfileModalStore, UserStore } from "../Context/States";
import { IconButton, TextField } from "@mui/material";
import { formatNormalDate } from "../Utils/helpers";
import { Close } from "@mui/icons-material";
import { toTitleCase } from "../Utils/helpers";

const style = {
  position: "relative",
  top: "50%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxWidth: 600,
  minWidth: 200,
  height: "fit-content",
  maxHeight: 700,
  bgcolor: "rgba(255,255,255, 0.3)",
  boxShadow: 24,
  p: 4,
};

export default function ProfileModal() {
  const open = ProfileModalStore((store) => store.open);
  const user = UserStore((store) => store.user);
  const hideModal = ProfileModalStore((store) => store.hideModal);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={hideModal}
      closeAfterTransition
      slots={{ backdrop: Box }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box
          sx={style}
          className="rounded-2xl flex flex-col gap-4 backdrop-blur-md"
        >
          <IconButton className="!absolute top-2 right-2 w-fit block">
            <Close
              onClick={hideModal}
              className="text-red-600"
              fontSize="medium"
              titleAccess="close"
            />
          </IconButton>
          <h2 className="text-xl font-medium">Profile</h2>
          <div className="modal-box flex flex-col gap-4 h-full relative overflow-y-auto">
            {user && (
              <TextField
                label="Employee Number"
                value={user.employeeNumber || "  "}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="filled"
                color="success"
                className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
              />
            )}
            <div className="flex gap-3">
              {user && (
                <>
                  <TextField
                    label="First Name"
                    value={user.firstName || "  "}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="filled"
                    color="success"
                    placeholder=""
                    className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
                  />

                  <TextField
                    label="Last Name"
                    value={user.lastName || "  "}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="filled"
                    color="success"
                    className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
                  />
                </>
              )}
            </div>
            <TextField
              label="Role"
              value={toTitleCase(user!.post) || "  "}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="filled"
              color="success"
              placeholder=""
              className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
            />
            <div className="flex flex-col gap-3">
              {user && (
                <>
                  <TextField
                    label="Gender"
                    value={user.gender || "  "}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="filled"
                    color="success"
                    className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
                  />
                  <TextField
                    label="Date of Birth"
                    value={
                      formatNormalDate(user?.dateOfBirth as string) || "  "
                    }
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="filled"
                    color="success"
                    className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
                  />

                  <TextField
                    label="Phone Number"
                    value={user.phoneNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                    variant="filled"
                    color="success"
                    className="bg-[rgb(255,255,255,0.3)] !backdrop-blur-sm"
                  />
                </>
              )}
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
