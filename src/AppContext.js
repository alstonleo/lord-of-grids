import { createContext, useRef } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const searchref = useRef();
  const genderref = useRef();
  const gridref = useRef();
  return (
    <AppContext.Provider value={{ searchref, genderref, gridref }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
