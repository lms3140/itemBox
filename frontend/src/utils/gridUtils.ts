import { AgGridReact } from "ag-grid-react";

//grid 삭제 함수
export const deleteRowFunc = async <T extends { id: string }>(
  apiUrl: string,
  gridRef: React.RefObject<AgGridReact<T> | null>,
  setData: React.Dispatch<React.SetStateAction<T[]>>
) => {
  if (!gridRef) return;
  try {
    const selected = gridRef.current?.api.getSelectedRows();
    if (!selected || selected.length === 0) return;
    const selectedId = selected[0].id;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedId }),
    });
    const result = await res.json();
    console.log(result);
    setData((prev) => prev.filter((rows) => rows.id !== selectedId));
  } catch (e) {
    console.error(e);
  }
};
