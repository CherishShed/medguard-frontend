import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Error from "./Pages/Error/Error";
import SideNav from "./Layout/SideNav";
import Medication from "./Pages/Medication/Medication";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SideNav />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="medication" element={<Medication />}>
          <Route path=":hospitalNumber" element={<Medication />} />
        </Route>
      </Route>
      <Route index path="signin" element={<Login />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
export default App;
