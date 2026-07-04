import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  emptyText = 'No records found',
}: TableProps<T>) {
  return (
    <div className="table-responsive rounded-3 border border-secondary">
      <table className="table table-dark table-hover mb-0 align-middle">
        <thead>
          <tr className="border-bottom border-secondary text-secondary small text-uppercase">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id || index} className="border-bottom border-secondary">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-secondary">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
