import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Error from "./Pages/Error/Error";
import SideNav from "./Layout/SideNav";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SideNav />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Home />} />
      </Route>
      <Route path="signin" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
export default App;
