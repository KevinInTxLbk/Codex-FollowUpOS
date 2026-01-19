import { ReactNode } from "react";

type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export const DataTable = <T,>({ columns, data }: DataTableProps<T>) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.header}
              style={{ textAlign: "left", padding: "12px 8px", borderBottom: "1px solid #e2e8f0" }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
            {columns.map((column) => (
              <td key={column.header} style={{ padding: "12px 8px", color: "#0f172a" }}>
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
