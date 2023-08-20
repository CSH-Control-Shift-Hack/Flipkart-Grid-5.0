import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import LeaderBoardCard from "../../components/LeaderBoardCard";
import { useStateContext } from "../../context";

function LeaderBoard() {

  const [leaders, setLeaders] = useState([])

  const { getLeaderBoard } = useStateContext();

  const getLeaders = async() => {
    const data = await getLeaderBoard();
    console.log("leaderboard: ", data)
    setLeaders(data)
  }

  useEffect(()=>{
    getLeaders()
  },[])

  return (
    <div>
      <Navbar />
      <div className="bg-slate-100 flex flex-col justify-center min-h-[92vh] 2xl:pl-96 2xl:pr-96 xl:pl-64 xl:pr-64 lg:pl-44 lg:pr-44 md:pl-28 md:pr-28 sm:pl-10 sm:pr-10 pl-2 pr-2 pt-16 pb-16">
        <h2 className="font-semibold text-center sm:text-3xl xs:text-2xl text-xl">
          LeaderBoard
        </h2>
        <section className="pt-8 pb-8 flex flex-col gap-[10px]">
        {
          leaders.length === 0 ? (
            <h1 className="text-center text-red-500 text-lg" >No users in the leaderboard currently! Check again after some time!</h1>
          ) : leaders.map((item, index) => (
            <LeaderBoardCard />
          ))
        }
        </section>
      </div>
    </div>
  );
}

export default LeaderBoard;
