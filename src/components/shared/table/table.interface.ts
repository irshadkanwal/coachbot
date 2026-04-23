import { ReactNode } from 'react';

/**
* Basic primitive data types for table cells
*/
type Primitive = string | number | boolean | Date;

/**
* Gets keys from type T where values are primitives
*/
type PrimitiveKeys<T> = {
 [K in keyof T]: T[K] extends Primitive ? K : never;
}[keyof T];

/**
 * Cell click event handler
 */
type OnCellClick<T> = (value: T[PrimitiveKeys<T>], row: T, key: PrimitiveKeys<T>) => void;

/**
 * Header click event handler
 */
type OnHeaderClick<T> = (key: PrimitiveKeys<T>, label: string) => void;

/**
 * Custom styles for table elements
 */
interface TableStyles {
  /** Table wrapper styles */
  wrapper?: string;
  /** Table element styles */
  table?: string;
  /** Table body styles */
  tbody?: string;
  /** Header row styles */
  headerRow?: string;
  /** Header cell default styles */
  headerCell?: string;
  /** Body row styles */
  row?: string;
  /** Body cell default styles */
  cell?: string;
}

/**
* Table column configuration
* Defines data key, header label and custom cell rendering
*/
interface Column<T> {
 /** Key from data type for this column */
 key: PrimitiveKeys<T>;
 /** Column header text */
 label: string;
 /**
  * Custom cell render function
  * @param value Cell value for current key
  * @param row Full data row object
  */
 renderCell?: (value: T[PrimitiveKeys<T>], row: T) => ReactNode;
 /**
  * Custom header render function
  * @param label Default header label
  * @param key Column key
  */
 renderHeader?: (label: string, key: PrimitiveKeys<T>) => ReactNode;
 /** Custom styles for this column's cells */
 cellClassName?: string;
 /** Custom styles for this column's header */
 headerClassName?: string;
 /** Width of the column (e.g., "200px", "25%") */
 width?: string;
}

/**
* Table component props
*/
interface TableProps<T extends Record<string, Primitive>> {
 /** Array of data to display */
 data: T[];
 /** Column configurations */
 columns: Column<T>[];
 /** Click handler for table cells */
 onCellClick?: OnCellClick<T>;
 /** Click handler for header cells */
 onHeaderClick?: OnHeaderClick<T>;
 /** Custom CSS classes for table elements */
 styles?: TableStyles;
 /** CSS class for table wrapper */
 className?: string;
}

export type {
  Primitive,
  PrimitiveKeys,
  OnCellClick,
  OnHeaderClick,
  TableStyles
}; // types
export type {
  Column,
  TableProps
}; // interfaces
