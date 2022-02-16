export const selectRow = (api, rowIndex, column) => {
  api.ensureIndexVisible(rowIndex, "middle");
  api.getRowNode(rowIndex).setSelected(true);
  if (
    api.getFocusedCell().rowIndex !== rowIndex &&
    api.getFocusedCell().colKey !== column.colId
  )
    api.setFocusedCell(rowIndex, column.colId);
  if (column.colDef.editable) {
    api.startEditingCell({
      rowIndex,
      colKey: column.colId,
    });
  }
};
