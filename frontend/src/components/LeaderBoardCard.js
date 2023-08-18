import React from "react";
import pic from "../assets/user.webp";

function LeaderBoardCard() {
  return (
    <div className="bg-slate-200 flex justify-between p-3 rounded">
      <div className="flex">
        <img src={pic} className="h-10 w-10 rounded-full" alt="" />
        <div className="flex flex-col justify-center ml-4">
          <h3 className="font-semibold">0x03042r094ur043ur0</h3>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="font-semibold">10 FLIPS</h2>
      </div>
    </div>
  );
}

export default LeaderBoardCard;
