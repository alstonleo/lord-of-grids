import React, { useCallback, useContext, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.min.css";
import "ag-grid-community/dist/styles/ag-theme-balham.min.css";
import { Card } from "@mui/material";
import GlobalContext from "./GlobalContext";

const Aggrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rowData, setRowData] = useState([]);
  const [api, setApi] = useState(null);
  const { shiftKey, altKey, ctrlKey } = useContext(GlobalContext);
  const columnDefs = [
    {
      headerName: "checked",
      field: "checked",
      hide: true,
    },
    {
      headerName: "Actor Name",
      field: "actor",
      editable: true,
    },
    {
      headerName: "Gender",
      field: "gender",
      editable: true,
    },
    {
      headerName: "House",
      field: "house",
    },
    {
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Wand",
      field: "wand",
    },
  ];
  const onGridReady = (params) => {
    console.log(params.api);
    setApi(params.api);
  };
  // utility
  const selectRow = (api, rowIndex, column) => {
    api.ensureIndexVisible(rowIndex, "middle");
    api.setFocusedCell(rowIndex, column.colId);
    if (column.colDef.editable) {
      api.startEditingCell({
        rowIndex,
        colKey: column.colId,
      });
    }
    api.getRowNode(rowIndex).setSelected(true);
  };
  //end utility
  const gridListener = useCallback(
    (e) => {
      if (!api) return;
      const currentRow = api.getSelectedNodes()[0].rowIndex;
      const key = e.key;
      if (key === "ArrowDown") {
        e.preventDefault();
        if (currentRow === rowData.length - 1) {
          return;
        }
        if (api.gridOptionsWrapper.isRowSelectionMulti() && currentRow !== -1) {
          let isChecked = api.getRowNode(currentRow).data.checked || false;
          if (ctrlKey) {
            isChecked = !isChecked;
            api.getRowNode(currentRow).data.checked = isChecked;
            api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
          }
          api.getRowNode(currentRow).setSelected(false);
        }
        selectRow(api, currentRow + 1, api.getFocusedCell().column);
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        if (currentRow === 0) {
          return;
        }
        if (api.gridOptionsWrapper.isRowSelectionMulti()) {
          let isChecked = api.getRowNode(currentRow).data.checked || false;
          if (ctrlKey) {
            isChecked = !isChecked;
            api.getRowNode(currentRow).data.checked = isChecked;
            api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
          }
          api.getRowNode(currentRow).setSelected(false);
        }
        selectRow(api, currentRow - 1, api.getFocusedCell().column);
      }
      if (key === "Tab" || key === "Enter") {
        e.preventDefault();
        api.deselectAll();
        if (shiftKey) {
          if (api.tabToPreviousCell()) {
            selectRow(
              api,
              api.getFocusedCell().rowIndex,
              api.getFocusedCell().column
            );
          } else {
            api.stopEditing();
          }
        } else if (api.tabToNextCell()) {
          selectRow(
            api,
            api.getFocusedCell().rowIndex,
            api.getFocusedCell().column
          );
        } else {
          api.stopEditing();
        }
      }
    },
    [api, rowData, ctrlKey, shiftKey]
  );
  useEffect(() => {
    fetch(`http://hp-api.herokuapp.com/api/characters/house/gryffindor`)
      .then((response) => response.json())
      .then((data) => setRowData(data));
  }, [searchTerm]);
  useEffect(() => {
    document.addEventListener("keyup", gridListener, false);
    return () => {
      document.removeEventListener("keyup", gridListener, false);
    };
  }, [gridListener]);
  return (
    <>
      <Card sx={{ height: "90vh", width: "100vw" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <div className="ag-theme-balham">
            <AgGridReact
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={rowData}
              singleClickEdit={true}
              onRowDataChanged={(params) => {
                params.api.setFocusedCell(
                  0,
                  params.columnApi.getAllDisplayedColumns()[0].colId
                );
                if (params.api.getFocusedCell().column.colDef.editable) {
                  params.api.startEditingCell({
                    rowIndex: 0,
                    colKey: params.columnApi.getAllDisplayedColumns()[0].colId,
                  });
                }
                params.api.getRowNode(0)?.setSelected(true);
              }}
              onSelectionChanged={(params) => {
                // params.api.resetRowHeights();
              }}
              enableRangeSelection={false}
              columnDefs={columnDefs}
              suppressCellSelection={true}
              stopEditingWhenCellsLoseFocus={false}
              suppressHorizontalScroll={true}
              defaultColDef={{
                suppressKeyboardEvent: () => true,
              }}
              getRowStyle={(params) => {
                if (params.data.checked) {
                  return {
                    background: "#c9defc",
                  };
                }
              }}
              onCellClicked={(params) => {
                const currentRow = params.api.getFocusedCell().rowIndex;
                if (params.api.gridOptionsWrapper.isRowSelectionMulti()) {
                  let isChecked =
                    params.api.getRowNode(currentRow).data.checked || false;
                  if (ctrlKey) {
                    isChecked = !isChecked;
                    params.api.getRowNode(currentRow).data.checked = isChecked;
                    params.api.redrawRows({
                      rowNodes: [params.api.getRowNode(currentRow)],
                    });
                    if (api.getSelectedNodes().length > 1) {
                      params.api.getRowNode(currentRow).setSelected(false);
                      return;
                    }
                  }
                }
                params.api.getRowNode(currentRow).setSelected(true);
              }}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default Aggrid;
