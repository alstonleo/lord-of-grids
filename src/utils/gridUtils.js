export const selectRow = (api, rowIndex, column) => {
  api.ensureIndexVisible(rowIndex, "middle");
  api.getDisplayedRowAtIndex(rowIndex).setSelected(true);
  if (column?.colDef.editable) {
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
export const rowUp = (api, ctrlKey) => {
  const currentRow = api.getSelectedNodes()[0].rowIndex;
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
  selectRow(api, currentRow - 1, api.getFocusedCell()?.column);
};
export const rowDown = (api, ctrlKey) => {
  console.log("rowDown");
  const currentRow = api.getSelectedNodes()[0].rowIndex;
  if (currentRow === api.getDisplayedRowCount() - 1) {
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
  selectRow(api, currentRow + 1, api.getFocusedCell()?.column);
};
