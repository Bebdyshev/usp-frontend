'use client';
import { FC } from "react";

interface DangerousClass {
  grade: string;
  avg_danger_level: number;
}

interface ClassTableProps {
  dangerousClasses: DangerousClass[];
}

const TableContainer: FC<ClassTableProps> = ({ dangerousClasses }) => {
  return (
    <div className="border-collapse rounded-lg overflow-hidden">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border-r border-b">Grade</th>
            <th className="px-4 py-2 border-l">Average Danger Level</th>
          </tr>
        </thead>
        <tbody>
          {dangerousClasses.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-r border-b">{item.grade}</td>
              <td className="px-4 py-2 border">{item.avg_danger_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;