import React, { useContext, createContext } from "react";
import { ethers } from "ethers";
import projectFactory from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

// 0x621c945d1De2424dF87788DCC67E59d9dE6cF7c4

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const hello = async () => {
      console.log("Hello")
  };

  const getProjects = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      "0x621c945d1De2424dF87788DCC67E59d9dE6cF7c4",
      projectFactory.abi,
      signer
    );

    const projectData = await contract.getProjects();

    const AllProjects = projectData.map((project, i) => ({
      owner: project.owner,
      title: project.stringArray[3],
      description: project.stringArray[4],
      target: ethers.utils.formatEther(project.intArray[0].toString()),
      deadline: project.intArray[1].toNumber(),
      amountRaised: ethers.utils.formatEther(project.intArray[2].toString()),
      image: project.stringArray[5],
      visible: project.intArray[3],
      video: project.stringArray[1],
      tagline: project.stringArray[2],
      owner_name: project.stringArray[0],
      country: project.stringArray[6],
      hq_address: project.stringArray[7],
      plan: project.stringArray[8],
      twitter: project.stringArray[9],
      email: project.stringArray[10],
      instagram: project.stringArray[11],
      linkedIn: project.stringArray[12],
      category: project.category,
      prev_Amount_raised: ethers.utils.formatEther(project.intArray[4].toString()),
      valuation : ethers.utils.formatEther(project.intArray[5].toString()),
      min_invest: ethers.utils.formatEther(project.intArray[6].toString()),
      hi:project.intArray[6],
      donators: project.donators,
      donators_name: project.donators_name,
      doc:project.stringArray[13],
      updates:project.updates,
      pId: i,
    }));


    const needProjects = AllProjects.filter(
      (project) => project.visible?._hex === "0x00"
    );

    return needProjects;
  };

  return (
    <StateContext.Provider
      value={{
        hello,
        getProjects
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
