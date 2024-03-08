import { FormEvent, useEffect, useState } from "react";
import "./auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastStore, UserStore } from "../../Context/States";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import {
  AccountCircle,
  EnhancedEncryption,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { checkAuth } from "../../Utils/helpers";
import { LoadingButton } from "@mui/lab";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const setUser = UserStore((store) => store.setUser);
  // const user = UserStore((store) => store.user);
  const navigate = useNavigate();
  const openToast = ToastStore((store) => store.openToast);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth().then((response) => {
      if (response.auth) {
        openToast("Log in successful", "success");
        setUser(response.user, true);
        navigate("/dashboard");
      } else {
        setUser(null, false);
      }
    });
    return;
  }, []);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    axios
      .post("https://medguard.vercel.app/api/healthworker/login", formData)
      .then((result) => {
        console.log(result);
        if (result.data.auth) {
          localStorage.setItem("token", `Bearer ${result.data.accessToken}`);
          setUser(result.data.user, true);
          openToast("Log in successful", "success");
          setLoading(false);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        openToast(error.response.data.message, "error");
        setLoading(false);
      });
  }
  window.addEventListener("load", () => {
    document.getElementById("usernameInput")?.focus();
  });
  return (
    <div>
      <div className="w-full h-screen md:overflow-hidden">
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
            className="flex flex-col gap-8 bg-white p-5 mx-auto w-full"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3">
              <img alt="logo" src="fullLogo.png" className="logo" />
              <p className="text-md text-gray-400 font-medium">
                Please enter your login details
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
            <LoadingButton
              className="!bg-lime-600 w-[150px] hover:!bg-green-500 mx-auto block text-center self-center"
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
            >
              <span>Login</span>
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
