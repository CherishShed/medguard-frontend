import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import {
  ProfileModalStore,
  TableStore,
  ToastStore,
  UserStore,
} from "../Context/States";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ProfileModal from "./ProfileMenu";

export default function AvatarMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const loggedInUser = UserStore((store) => store.user);
  const setUser = UserStore((store) => store.setUser);
  const setTableData = TableStore((store) => store.setTableData);
  const openProfile = ProfileModalStore((store) => store.showModal);
  const openToast = ToastStore((store) => store.openToast);
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    axios
      .get("https://medguard.vercel.app/api/healthworker/logout")
      .then((response) => {
        if (response.data.success) {
          localStorage.removeItem("token");
          setUser(null, false);
          setTableData([]);
          openToast("Logged out", "success");
          navigate("/signin");
        }
      })
      .catch((error) => {
        openToast(error.response.data.message, "error");
      });
    localStorage.removeItem("token");
  };
  return (
    <React.Fragment>
      {!loggedInUser && (
        <div className="absolute bg-white w-screen h-screen top-0 z-[10000000000] left-0 text-center">
          <CircularProgress className="!text-lime-600 !w-[150px] !h-[150px] !m-auto !block relative top-[25%]" />
        </div>
      )}
      {loggedInUser && (
        <>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <p>
              {loggedInUser?.firstName} {loggedInUser?.lastName}
            </p>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                className="!bg-lime-300"
                color="success"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {loggedInUser?.firstName[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
                width: 200,
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                openProfile();
                handleClose();
              }}
            >
              <Avatar /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          <ProfileModal />
        </>
      )}
    </React.Fragment>
  );
}
