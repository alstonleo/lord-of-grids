import { GlobalContextProvider } from "./GlobalContext";
import Aggrid from "./Aggrid";
import TextInput from "./TextInput";
import "./App.css";

function App() {
  return (
    <GlobalContextProvider>
      <TextInput />
      <Aggrid />
    </GlobalContextProvider>
  );
}

export default App;
