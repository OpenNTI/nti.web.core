import * as React from 'react';

import { IntrinsicProps, SortChangeHandler } from '../../types';

export interface ColumnStatic {
	HeaderComponent?: React.Component;
	FooterComponent?: React.Component;
	Name?: string | (() => string);
	CSSClassName?: string;
	SortOn?: string;
	RendersContainer?: boolean;
}

interface ColumnProps<T> extends IntrinsicProps {
	item: T;
}

export type Column<T> = React.Component<ColumnProps<T>, any, any> &
	ColumnStatic;

export interface CommonTableProps<T> {
	columns: Column<T>[];
	items: T[];
}

export type ClickHandler<T> = (item: T, e: Event) => void;

export type RowClassNameGetter<T> = (
	item: T,
	row: number,
	items: T[]
) => string;

export interface SortProps {
	sortOn?: string;
	sortDirection?: string;
	onChangeSort?: SortChangeHandler;
}

export interface TableBodyProps<T> {
	rowClassName?: RowClassNameGetter<T>;
	onRowClick?: ClickHandler<T>;
}

export type TableProps<T> = IntrinsicProps &
	CommonTableProps<T> &
	TableBodyProps<T> &
	SortProps;
