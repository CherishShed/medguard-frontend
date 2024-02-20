import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Error from "./Pages/Error/Error";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="signin" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
export default App;
