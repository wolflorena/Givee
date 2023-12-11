import React, { useContext, useState } from "react";

const LoginContext = React.createContext();

const LoginUpdateContext = React.createContext();

export function useLoginContext() {
  return useContext(LoginContext);
}

export function useLoginUpdateContext() {
  return useContext(LoginUpdateContext);
}

export function LoginProvider(props) {
  const [currentUser, setCurrentUser] = useState();

  const userLoggedIn = (user) => {
    setCurrentUser(user);
  };

  const userLoggedOut = () => {
    setCurrentUser(null);
  };

  const [navBarButtons, setNavBarButtons] = useState({
    homeIsPressed: true,
    clothesIsPressed: false,
    foodIsPressed: false,
    toysIsPressed: false,
    myProfileIsPressed: false,
  });

  const navBarButtonsPressHandler = (buttonType) => {
    const buttonsState = { ...navBarButtons };
    for (const type in buttonsState) {
      buttonsState[type] = type === buttonType;
    }
    setNavBarButtons(buttonsState);
  };
  return (
    <LoginContext.Provider value={{ currentUser, navBarButtons }}>
      <LoginUpdateContext.Provider
        value={{ userLoggedIn, userLoggedOut, navBarButtonsPressHandler }}
      >
        {props.children}
      </LoginUpdateContext.Provider>
    </LoginContext.Provider>
  );
}
