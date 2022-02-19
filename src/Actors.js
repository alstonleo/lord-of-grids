import React, { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import SelectInput from "./common/SelectInput";
import TextInput from "./common/TextInput";

const Actors = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
          inputProps={{
            markers: JSON.stringify({
              right: "gender",
              down: "main_grid",
            }),
          }}
        />
      </div>
      <div style={{ width: "50%", padding: "0 16px" }}>
        <SelectInput
          id="gender"
          ref={genderref}
          value={{ id: 2, value: "Female" }}
          options={[
            { id: 1, value: "Male" },
            { id: 2, value: "Female" },
          ]}
          getOptionLabel={(option) => option.value}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          markers={JSON.stringify({
            left: "search",
            right: "main_grid",
            down: "main_grid",
          })}
        />
      </div>
    </div>
  );
};

export default Actors;
