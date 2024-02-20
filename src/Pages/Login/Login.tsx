import { FormEvent, useEffect, useState } from "react";
import "./auth.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastStore, userStore } from "../../Context/States";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import {
  AccountCircle,
  EnhancedEncryption,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const toastText = ToastStore((store) => store.message);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const isAuthenticated = userStore((store) => store.isAuthenticated);
  const user = userStore((store) => store.user);
  const setUser = userStore((store) => store.setUser);
  const navigate = useNavigate();
  const toastSeverity = ToastStore((store) => store.severity);
  const openToast = ToastStore((store) => store.openToast);
  const closeToast = ToastStore((store) => store.closeToast);
  useEffect(() => {
    if (toastSeverity === "error") {
      toast.error(toastText, {
        position: "top-right",
        className: "foo-bar",
        pauseOnHover: false,
        onClose: closeToast,
        autoClose: 1000,
        theme: "light",
      });
    } else if (toastSeverity === "success") {
      toast.success(toastText, {
        position: "top-right",
        onClose: closeToast,
        className: "foo-bar",
        pauseOnHover: false,
        autoClose: 1000,
        theme: "light",
      });
    } else {
      return;
    }
  }, [toastText]);
  useEffect(() => {
    if (isAuthenticated) {
      openToast("Log in successful", "success");
    }
  }, [user]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    console.log("here");
    event.preventDefault();
    axios
      .post("https://medguard.vercel.app/api/healthworker/login", formData)
      .then((result) => {
        console.log(result);
        if (result.data.auth) {
          localStorage.setItem("token", `Bearer ${result.data.accessToken}`);
          setUser(result.data.user);
          navigate("/");
        }
      })
      .catch((error) => {
        openToast(error.response.data.message, "error");
      });
  }
  window.addEventListener("load", () => {
    document.getElementById("usernameInput")?.focus();
  });
  return (
    <div>
      <div className="w-full h-screen">
        <div
          className="mx-auto bg-white w-fit md:w-[80%] max-w-[900px] mt-[5%] md:flex items-center min-h-fit h-[80%] rounded-tl-3xl  rounded-br-3xl shadow-2xl"
          id="loginPage"
        >
          <img
            src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="welcome"
            className="hidden w-[50%] h-full  rounded-tl-3xl md:flex"
          />

          <form
            className="flex flex-col gap-5 bg-white items-center p-2 mx-auto"
            onSubmit={handleSubmit}
          >
            <div>
              <img alt="logo" src="fullLogo.png" className="logo" />
              <p style={{ fontFamily: "Indie Flower", fontSize: "20px" }}>
                Welcome To Your Note Assistant
              </p>
            </div>
            <TextField
              fullWidth
              helperText={"This field is compulsory"}
              variant="standard"
              label="Employee Number"
              type="text"
              color="warning"
              name="username"
              id="usernameInput"
              autoComplete="off"
              autoFocus={false}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
              }}
              value={formData.username}
              key={1}
            />
            <TextField
              fullWidth
              key={2}
              name="password"
              autoComplete="off"
              autoFocus={true}
              helperText={"This field is compulsory"}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              value={formData.password}
              variant="standard"
              label="Password"
              type={showPassword ? "text" : "password"}
              color="warning"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EnhancedEncryption />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              className="!bg-teal-600 w-[150px] hover:!bg-blue-500"
              type="submit"
              variant="contained"
              size="large"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
