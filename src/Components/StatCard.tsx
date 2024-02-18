import { PersonAdd } from "@mui/icons-material";
import React from "react";

function StatCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl border-2 border-lime-500 h-[150px] w-[200px] px-3 py-3 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-8xl max-w-[70%] text-black">20</p>
        <PersonAdd color="success" className="!text-5xl" />
      </div>
      <p className="text-2xl font-bold block text-green-700 text-center">
        Total Patients
      </p>
    </div>
  );
}

export default StatCard;
