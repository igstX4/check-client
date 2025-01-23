import { ApplicationStatus } from '../constants/statuses';

export interface FilterState {
  date: {
    start: string;
    end: string;
  };
  users: any[];
  companies: string[];
  sellers: string[];
  statuses: string[];
  sum: {
    from: string;
    to: string;
  };
  search?: string;
} 