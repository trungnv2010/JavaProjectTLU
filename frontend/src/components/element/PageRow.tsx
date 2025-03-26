import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { rowPage } from '@/lib/utils';

interface PageRowProps {
  page: number;
  setPage: (page: number) => void;
}

const PageRow: React.FC<PageRowProps> = ({ page, setPage }) => {
  // Convert page to string for Select component
  const pageValue = page.toString();

  const handleValueChange = (value: string) => {
    setPage(parseInt(value, 10));
  };

  return (
    <Select value={pageValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[70px]">
        <SelectValue placeholder={pageValue} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {rowPage.map((row) => (
            <SelectItem key={row} value={row.toString()}>
              {row}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PageRow;
