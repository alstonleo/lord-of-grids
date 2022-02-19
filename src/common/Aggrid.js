import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.min.css";
import "ag-grid-community/dist/styles/ag-theme-balham.min.css";
import "./Aggrid.css";
import { focusCell } from "../utils/gridUtils";
import GlobalContext from "./GlobalContext";
const Aggrid = forwardRef((props, ref) => {
  const {
    id,
    rowData,
    columnDefs,
    defaultColDef,
    frameworkComponents,
    quickFilterText,
    rowSelection = "multiple",
    singleClickEdit = true,
    enableRangeSelection = false,
    suppressCellSelection = true,
    stopEditingWhenCellsLoseFocus = false,
    suppressHorizontalScroll = true,
    animateRows = true,
    onGridReady = () => {},
    onRowDataChanged = () => {},
    getRowStyle = () => {},
    onCellClicked = () => {},
    onSelectionChanged = () => {},
  } = props;
  const [api, setApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const { setCurrentFocus } = useContext(GlobalContext);
  const gridReady = (params) => {
    setApi(params.api);
    setColumnApi(params.columnApi);
    onGridReady(params);
  };
  useImperativeHandle(ref, () => {
    return {
      isFocused: () => {
        return !!api?.getFocusedCell();
      },
      focus: () => {
        if (api.getDisplayedRowCount() > 0)
          return focusCell(api, 0, columnApi.getAllDisplayedColumns()[0]);
      },
      blur: () => {
        api?.getSelectedNodes()[0]?.setSelected(false);
        api?.clearFocusedCell();
      },
    };
  });
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="ag-theme-balham">
        <AgGridReact
          reactUi={true}
          id={id}
          ref={ref}
          rowSelection={rowSelection}
          rowData={rowData}
          singleClickEdit={singleClickEdit}
          enableRangeSelection={enableRangeSelection}
          columnDefs={columnDefs}
          suppressCellSelection={suppressCellSelection}
          stopEditingWhenCellsLoseFocus={stopEditingWhenCellsLoseFocus}
          suppressHorizontalScroll={suppressHorizontalScroll}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
          quickFilterText={quickFilterText}
          animateRows={animateRows}
          onGridReady={(params) => gridReady(params)}
          onRowDataChanged={(params) => {
            params.api.sizeColumnsToFit();
            onRowDataChanged(params);
          }}
          getRowStyle={getRowStyle}
          onCellClicked={onCellClicked}
          getRowHeight={(params) => (params.node.isSelected() ? 40 : 30)}
          onSelectionChanged={(params) => {
            params.api.resetRowHeights();
            onSelectionChanged(params);
          }}
          onColumnMoved={(params) => console.log(params)}
          onCellFocused={(params) => {
            // setCurrentFocus(ref);
          }}
        />
      </div>
    </div>
  );
});

export default Aggrid;
