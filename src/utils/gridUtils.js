export const selectRow = (api, rowIndex, column) => {
  api.ensureIndexVisible(rowIndex, "middle");
  api.getDisplayedRowAtIndex(rowIndex).setSelected(true);
  if (column.colDef.editable) {
    if (
      api.getFocusedCell()?.rowIndex !== rowIndex &&
      api.getFocusedCell()?.colKey !== column.colId
    )
      api.setFocusedCell(rowIndex, column.colId);
    api.startEditingCell({
      rowIndex,
      colKey: column.colId,
    });
  }
};
export const cellTabbed = (api, shiftKey) => {
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
    selectRow(api, api.getFocusedCell().rowIndex, api.getFocusedCell().column);
  } else {
    api.stopEditing();
  }
};
