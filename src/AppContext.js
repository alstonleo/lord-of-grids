import { createContext, useContext, useEffect, useRef } from "react";
import GlobalContext from "./common/GlobalContext";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { enableGlobalNavigation, setEnableGlobalNavigation, setContextMap } =
    useContext(GlobalContext);
  const searchref = useRef();
  const genderref = useRef();
  const gridref = useRef();
  useEffect(() => {
    if (enableGlobalNavigation)
      setContextMap({
        gender: genderref,
        search: searchref,
        main_grid: gridref,
      });
  }, [setContextMap, enableGlobalNavigation]);
  return (
    <AppContext.Provider
      value={{
        searchref,
        genderref,
        gridref,
        enableGlobalNavigation: (enable) => setEnableGlobalNavigation(enable),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
