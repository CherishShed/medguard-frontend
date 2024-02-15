import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import { Home } from "@mui/icons-material";
import Signup from "./Pages/Signup/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      {/* <Route path="*" element={<Error />} /> */}
    </Routes>
  );
}
export default App;
