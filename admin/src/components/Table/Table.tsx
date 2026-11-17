import { FC, ReactNode } from 'react';

export type TableProps = {
  headers: ReactNode;
  children: ReactNode;
  className?: string;
};

const Table: FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`max-h-[70vh] w-full overflow-auto ${className}`}>
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="sticky top-0 z-[1] bg-white">{headers}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
