import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

const AdminContext = React.createContext();

const AdminUpdateContext = React.createContext();

export function useAdminContext() {
  return useContext(AdminContext);
}

export function useAdminUpdateContext() {
  return useContext(AdminUpdateContext);
}

export function AdminProvider(props) {
  const [navBarButtons, setNavBarButtons] = useState({
    homeIsPressed: true,
    usersIsPressed: false,
    donationsIsPressed: false,
    centersIsPressed: false,
    campaignsIsPressed: false,
  });

  const navBarButtonsPressHandler = (buttonType) => {
    const buttonsState = { ...navBarButtons };
    for (const type in buttonsState) {
      buttonsState[type] = type === buttonType;
    }
    setNavBarButtons(buttonsState);
  };

  return (
    <AdminContext.Provider value={{ navBarButtons }}>
      <AdminUpdateContext.Provider value={{ navBarButtonsPressHandler }}>
        {props.children}
      </AdminUpdateContext.Provider>
    </AdminContext.Provider>
  );
}
