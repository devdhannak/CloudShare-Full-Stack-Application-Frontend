import { useUser } from "@clerk/clerk-react";
import React from "react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  // get the user object using useUser hook from clerk
  const { user } = useUser();

  return (
    <div>
      {/* Navbar component goes here */}
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            {/* SideMenu goes here */}
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5 my-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
