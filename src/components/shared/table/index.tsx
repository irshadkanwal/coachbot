import React, { ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { Primitive, Column, TableProps } from "./table.interface";

/**
 * A flexible table component that supports custom cell rendering
 * @template T - The type of data being displayed in the table
 * @param {TableProps<T>} props - The component props
 * @returns {ReactNode} The rendered table
 *
 * @example
 * interface User {
 *   name: string;
 *   age: number;
 *   isActive: boolean;
 * }
 *
 * const columns: Column<User>[] = [
 *   { key: 'name', label: 'Name' },
 *   {
 *     key: 'age',
 *     label: 'Age',
 *     renderCell: (value) => `${value} years`
 *   },
 *   {
 *     key: 'isActive',
 *     label: 'Status',
 *     renderCell: (value) => value ? '✅ Active' : '❌ Inactive'
 *   }
 * ];
 *
 * const data: User[] = [
 *   { name: 'John', age: 25, isActive: true },
 *   { name: 'Jane', age: 30, isActive: false }
 * ];
 *
 * <Table<User> data={data} columns={columns} />
 */
export function Table<T extends Record<string, Primitive>>({
  data,
  columns,
  onCellClick,
  onHeaderClick,
  styles = {},
  className = "",
}: TableProps<T>) {
  const defaultFormatValue = (value: Primitive): string | ReactNode => {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    if (typeof value === "boolean") {
      return <i className={value ? "cbi-tick-square" : "cbi-close-square"} />;
    }
    return String(value);
  };

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key];

    if (column.renderCell) {
      return column.renderCell(value, row);
    }

    return defaultFormatValue(value);
  };

  const renderHeader = (column: Column<T>) => {
    if (column.renderHeader) {
      return column.renderHeader(column.label, column.key);
    }

    return column.label;
  };

  return (
    <div className={twMerge(clsx("w-full overflow-x-auto", styles.wrapper, className))}>
      <table className={twMerge(clsx("text-start w-full table-fixed ", styles.table))}>
        <thead className="text-main text-lg font-medium leading-8 md:text-xl">
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={twMerge(
                  clsx(
                    "relative",
                    styles.headerCell,
                    column.headerClassName,
                  ),
                )}
                style={{ width: column.width }}
                onClick={() => onHeaderClick?.(column.key, column.label)}
              >
                {renderHeader(column)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.row}>
              {columns.map((column, colIndex) => (
                <td
                  key={String(column.key)}
                  className={twMerge(
                    styles.cell,
                    column.cellClassName,
                    rowIndex === 3 && "border-b-main",
                    colIndex !== 0 && 'text-sm'
                  )}
                  onClick={() => onCellClick?.(row[column.key], row, column.key)}
                >
                  {renderCell(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
