import React from "react";

const Progress = ({ value, completed }) => {
  return (
   <div className="flex lg:flex-row flex-col  gap-4 justify-center items-center">
     <div
      className="radial-progress text-error mt-5"
      style={{ "--value": value }}
      aria-valuenow={value}
      role="progressbar"
    >
      {value}%
    </div>

    <p>You have completed {completed} out of 26 Dates</p>
   </div>
  );
};

export default Progress;
