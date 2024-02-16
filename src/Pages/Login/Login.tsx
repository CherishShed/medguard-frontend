import { useEffect, useState } from "react";
import "./auth.css";
// import { Button, InputAdornment, TextField } from "@mui/material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
// import { IconButton } from "@mui/material";
// import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
// import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
// import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { SignIn } from "@clerk/clerk-react";
import { ToastStore, userStore } from "../../Context/States";

function Login() {
  // const [showPassword, setShowPassword] = useState(false);
  // const [formData, setFormData] = useState({ username: "", password: "" });
  // const [helpText, setHelpText] = useState("");
  const toastText = ToastStore((store) => store.message);
  // const handleClickShowPassword = () => setShowPassword((show) => !show);
  const isAuthenticated = userStore((store) => store.isAuthenticated);
  const user = userStore((store) => store.user);

  const toastSeverity = ToastStore((store) => store.severity);
  const openToast = ToastStore((store) => store.openToast);
  const closeToast = ToastStore((store) => store.closeToast);
  useEffect(() => {
    console.log(toastText);
    console.log(toastSeverity);
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

  // function handleSubmit(event: FormEvent<HTMLFormElement>) {
  //   console.log("here");
  //   event.preventDefault();
  //   axios.post("http://localhost:8081/login", formData).then((result) => {
  //     console.log(result);
  //     settoastText(result.data.message);
  //     setTimeout(() => {
  //       if (result.data.success) {
  //         localStorage.setItem("token", result.data.token);
  //         window.location.pathname = "/";
  //       }
  //     }, 500);
  //   });
  // }
  window.addEventListener("load", () => {
    document.getElementById("usernameInput")?.focus();
  });
  return (
    <div>
      <div className="w-full h-screen">
        <div
          className="mx-auto bg-white w-fit md:w-[80%] max-w-[900px] mt-[5%] md:flex items-center min-h-fit h-[80%] rounded-tl-3xl"
          id="loginPage"
        >
          <img
            src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="welcome"
            className="hidden w-[50%] h-full  rounded-tl-3xl md:flex"
          />
          <div className="relative">
            <SignIn signUpUrl="/signup" />
          </div>
          {/* <form
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
              helperText={helpText}
              variant="standard"
              label="Email"
              type="email"
              color="warning"
              name="username"
              id="usernameInput"
              autoComplete="off"
              autoFocus={false}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
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
              helperText={helpText}
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
                    <EnhancedEncryptionIcon />
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
            <p className="signup-text">
              Don't have an account?{" "}
              <Link className="text-teal-500 font-bold" to="/signup">
                Sign Up
              </Link>
            </p>
            <Button
              className="!bg-teal-600 w-[150px] hover:!bg-blue-500"
              type="submit"
              variant="contained"
              size="large"
            >
              Login
            </Button>
          </form> */}
        </div>
      </div>
    </div>
  );
}

export default Login;