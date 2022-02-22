import { createContext, useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "./common/GlobalContext";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { enableGlobalNavigation, setEnableGlobalNavigation, setContextMap } =
    useContext(GlobalContext);
  const searchref = useRef();
  const genderref = useRef();
  const gridref = useRef();
  const [currentComponent, setCurrentComponent] = useState("");
  useEffect(() => {
    if (enableGlobalNavigation)
      setContextMap({
        search: searchref,
        gender: genderref,
        main_grid: gridref,
        default: searchref,
      });
  }, [setContextMap, enableGlobalNavigation]);
  useEffect(() => {
    console.log("current component", currentComponent);
  }, [currentComponent]);
  return (
    <AppContext.Provider
      value={{
        searchref,
        genderref,
        gridref,
        currentComponent,
        setCurrentComponent,
        enableGlobalNavigation: (enable) => setEnableGlobalNavigation(enable),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
