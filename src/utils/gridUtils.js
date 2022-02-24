export const selectRow = (api, rowIndex) => {
  api.ensureIndexVisible(rowIndex, "middle");
  api.getDisplayedRowAtIndex(rowIndex)?.setSelected(true);
};
export const focusCell = (api, rowIndex, column) => {
  const rowSelected = api.getRowNode(rowIndex).selected;
  if (!rowSelected) {
    selectRow(api, rowIndex);
  }
  if (column?.colDef?.editable) {
    if (
      api.getFocusedCell()?.rowIndex !== rowIndex ||
      api.getFocusedCell()?.column?.colId !== column?.colId
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
      focusCell(
        api,
        api.getFocusedCell().rowIndex,
        api.getFocusedCell().column
      );
    } else {
      return false;
    }
  } else if (api.tabToNextCell()) {
    focusCell(api, api.getFocusedCell().rowIndex, api.getFocusedCell().column);
  } else {
    return false;
  }
  return true;
};
export const cellClicked = (api, rowIndex, column, ctrlKey = false) => {
  // if (api.gridOptionsWrapper.isRowSelectionMulti()) {
  // console.log(api);
  if (ctrlKey) {
    let isChecked = api.getRowNode(rowIndex).data.checked || false;
    api.getRowNode(rowIndex).data.checked = !isChecked;
    api.redrawRows({
      rowNodes: [api.getRowNode(rowIndex)],
    });
    // if (api.getSelectedNodes().length > 1) {
    //   api.getRowNode(rowIndex).setSelected(false);
    //   return;
    // }
    api.getRowNode(rowIndex).setSelected(false);
    if (api.getSelectedNodes().length === 0) {
      api.getRowNode(rowIndex).setSelected(true);
    }
    return;
  }
  // }
  if (column) {
    // if (api.getSelectedNodes().length > 1) api.deselectAll();
    focusCell(api, rowIndex, column);
  }
};
/*
  column: optional parameter. mandatory if cell is editable
*/
export const rowUp = (api, ctrlKey = false, column = null) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
  // if (api.gridOptionsWrapper.isRowSelectionMulti()) {
  if (ctrlKey) {
    let isChecked = api.getRowNode(currentRow).data.checked || false;
    api.getRowNode(currentRow).data.checked = !isChecked;
    api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
  }
  // api.getRowNode(currentRow).setSelected(false);
  // }
  if (currentRow === 0) {
    return false;
  }
  if (column) {
    focusCell(api, currentRow - 1, column);
    return true;
  }
  selectRow(api, currentRow - 1);
  return true;
};
export const rowDown = (api, ctrlKey = false, column = null) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
  // if (api.gridOptionsWrapper.isRowSelectionMulti() && currentRow !== -1) {
  if (ctrlKey) {
    let isChecked = api.getRowNode(currentRow).data.checked || false;
    api.getRowNode(currentRow).data.checked = !isChecked;
    api.redrawRows({ rowNodes: [api.getRowNode(currentRow)] });
  }
  // api.getRowNode(currentRow).setSelected(false);
  // }
  if (currentRow === api.getDisplayedRowCount() - 1) {
    return false;
  }
  if (column) {
    focusCell(api, currentRow + 1, column);
    return true;
  }
  selectRow(api, currentRow + 1);
  return true;
};
export const stopEditing = (api) => {
  api.clearFocusedCell();
  api.deselectAll();
  api.stopEditing();
};
