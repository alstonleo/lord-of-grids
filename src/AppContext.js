import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import GlobalContext from "./common/GlobalContext";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { setEnableGlobalNavigation, currentComponent } =
    useContext(GlobalContext);
  const searchref = useRef();
  const genderref = useRef();
  const gridref = useRef();
  const ctxMap = useMemo(() => {
    return {
      search: searchref,
      gender: genderref,
      main_grid: gridref,
      default: searchref,
    };
  }, []);
  useEffect(() => {
    console.log("currentComponent", currentComponent);
    if (currentComponent) {
      ctxMap[currentComponent].current.focus();
    }
  }, [ctxMap, currentComponent]);
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
