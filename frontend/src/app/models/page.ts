export type SortDirection = 'asc' | 'desc' | '';

/**
 * Page as returned from spring pageable endpoints.
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  number: number;
  totalPages: number;
}

/**
 * Object for creating page request to spring pageable endpoints.
 */
export interface PageRequest {
  pageIndex: number;
  pageSize: number;
  sort?: string;
  statusFilter: string;
  search: string;
  direction?: SortDirection;
}

