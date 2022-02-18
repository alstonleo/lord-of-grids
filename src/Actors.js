import React, { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import SelectInput from "./common/SelectInput";
import TextInput from "./common/TextInput";

const Actors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const { currentFocus } = useContext(GlobalContext);
  const { searchref, genderref } = useContext(AppContext);
  useEffect(() => {
    searchref.current.focus();
  }, [searchref]);
  return (
    <div
      style={{
        display: "flex",
        width: "calc(100% - 10px)",
        height: "5%",
        padding: "20px 5px",
      }}
    >
      <div style={{ width: "50%", padding: "0 16px" }}>
        <TextInput
          ref={searchref}
          value={searchTerm}
          label="Search"
          id="search"
          placeholder="Enter Search Term"
        />
      </div>
      <div style={{ width: "50%", padding: "0 16px" }}>
        <SelectInput
          ref={genderref}
          value={{ id: 2, value: "Female" }}
          options={[
            { id: 1, value: "Male" },
            { id: 2, value: "Female" },
          ]}
          getOptionLabel={(option) => option.value}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </div>
    </div>
  );
};

export default Actors;
