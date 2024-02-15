import { FormEvent, useEffect, useState } from "react";
import "../Login/auth.css";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export type formDataType = {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
};
function Signup() {
  const [formData, setFormData] = useState<formDataType>({
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [labels, setLabels] = useState({
    emailLabel: "Email",
    passwordLabel: "",
    passwordPlaceholder: "Password",
    passwordHelperText: "",
    emailHelperText: "",
    firstNameHelperText: "",
    lastNameHelperText: "",
  });
  const [toastText, settoastText] = useState("");

  useEffect(() => {
    if (toastText === "User not found" || toastText === "Incorrect Password") {
      toast.error(toastText, {
        position: "top-right",
        className: "foo-bar",
        pauseOnHover: false,
        autoClose: 1000,
        theme: "light",
      });
    } else if (toastText === "Login Success") {
      toast.success(toastText, {
        position: "top-right",
        className: "foo-bar",
        pauseOnHover: false,
        autoClose: 1000,
        theme: "light",
      });
    } else {
      return;
    }

    settoastText("");
  }, [toastText]);
  useEffect(() => {});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    console.log("here");
    event.preventDefault();
    axios.post("http://localhost:8081/login", formData).then((result) => {
      console.log(result);
      settoastText(result.data.message);
      setTimeout(() => {
        if (result.data.success) {
          localStorage.setItem("token", result.data.token);
          window.location.pathname = "/";
        }
      }, 500);
    });
  }
  window.addEventListener("load", () => {
    document.getElementById("usernameInput")?.focus();
  });
  return (
    <div>
      <ToastContainer />
      <div className="w-full h-screen">
        <div
          className="mx-auto bg-white w-[80%] max-w-[800px] mt-[5%] flex gap-7 items-center min-h-fit h-[80%] rounded-tl-3xl"
          id="loginPage"
        >
          <img
            src="https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="welcome"
            className="w-[50%] h-full rounded-tl-3xl"
          />
          <form
            className="flex flex-col gap-5 bg-white items-center p-2"
            onSubmit={handleSubmit}
          >
            <div>
              <img alt="logo" src="fullLogo.png" className="logo" />
              <p style={{ fontFamily: "Indie Flower", fontSize: "20px" }}>
                Welcome To Your Note Assistant
              </p>
            </div>
            <div className="flex gap-1">
              <TextField
                name="firstName"
                label="First Name"
                variant="outlined"
                color="warning"
                required
                helperText={labels.firstNameHelperText}
                className="!rounded-sm"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                }}
                onBlur={(e) => {
                  const isValid = /^.{1,}$/.test(e.target.value);
                  if (!isValid) {
                    setLabels({
                      ...labels,
                      firstNameHelperText: "This field is required",
                    });
                  } else {
                    setLabels({
                      ...labels,
                      firstNameHelperText: "",
                    });
                  }
                }}
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="outlined"
                color="warning"
                required
                helperText={labels.lastNameHelperText}
                className="!rounded-sm"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value });
                }}
                onBlur={(e) => {
                  const isValid = /^.{1,}$/.test(e.target.value);
                  if (!isValid) {
                    setLabels({
                      ...labels,
                      lastNameHelperText: "This field is required",
                    });
                  } else {
                    setLabels({
                      ...labels,
                      lastNameHelperText: "",
                    });
                  }
                }}
              />
            </div>
            <TextField
              value={formData.userName}
              type="email"
              name="email"
              label={"Email"}
              required
              className="rounded-sm !transition-all"
              color="warning"
              variant="standard"
              helperText={labels.emailHelperText}
              FormHelperTextProps={{ color: "warning" }}
              fullWidth
              autoComplete="false"
              onChange={(e) => {
                setFormData({ ...formData, userName: e.target.value.trim() });
              }}
              onBlur={(e) => {
                const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                  e.target.value
                );
                if (!isValid) {
                  setLabels({
                    ...labels,
                    emailHelperText: "Please enter a valid email.",
                  });
                } else {
                  setLabels({
                    ...labels,
                    emailHelperText: "",
                  });
                }
              }}
            />
            <TextField
              type="password"
              label={"Password"}
              // placeholder={labels.passwordPlaceholder}
              helperText={labels.passwordHelperText}
              color="warning"
              variant="standard"
              required
              fullWidth
              className="!rounded-sm"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              onBlur={(e) => {
                const isValid = /^.{8,}$/.test(e.target.value);
                if (!isValid) {
                  setLabels({
                    ...labels,
                    passwordHelperText:
                      "Your password must contain between 8 and 60 characters..",
                  });
                } else {
                  setLabels({
                    ...labels,
                    passwordHelperText: "",
                  });
                }
              }}
            />
            <p className="signup-text">
              Already have an account?{" "}
              <Link className="text-teal-500 font-bold" to="/login">
                Login
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
