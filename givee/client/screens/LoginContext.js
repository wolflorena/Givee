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

  return (
    <LoginContext.Provider value={{ currentUser }}>
      <LoginUpdateContext.Provider value={{ userLoggedIn }}>
        {props.children}
      </LoginUpdateContext.Provider>
    </LoginContext.Provider>
  );
}
