import React from "react";

interface Student {
  student_name: string;
  actual_score: number[];
  predicted_score: number[];
  danger_level: number;
}

interface ClassInfo {
  grade_liter: string;
  subject_name: string;
  curator_name: string;
  class: Student[];
}

interface ClassTableProps {
  classInfo: ClassInfo;
  handleStudentClick: (student: Student, curator: string, subject: string) => void;
}

const ClassTable: React.FC<ClassTableProps> = ({ classInfo, handleStudentClick }) => {
  return (
    <div className="overflow-hidden rounded-[5px] border border-gray-300 mb-4">
      <div className="flex p-2 pt-3 border-b">
        <h1 className="text-[17px] ml-4">
          Класс: <b>{classInfo.grade_liter}</b>
        </h1>
        <h1 className="text-[17px] ml-5">
          Предмет: <b>{classInfo.subject_name}</b>
        </h1>
        <h1 className="text-[17px] ml-auto mr-4">{classInfo.curator_name}</h1>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border" rowSpan={2}>
              Rank
            </th>
            <th className="px-4 py-2 border" rowSpan={2}>
              Name
            </th>
            <th className="px-4 py-2 border" colSpan={4}>
              Score
            </th>
            <th className="px-4 py-2 border" colSpan={4}>
              Predicted Score
            </th>
            <th className="px-4 py-2 border" rowSpan={2}>
              Danger Level
            </th>
          </tr>
          <tr>
            {["I", "II", "III", "IV"].map((label, i) => (
              <th key={i} className="px-4 py-1 border border-r">
                {label}
              </th>
            ))}
            {["I", "II", "III", "IV"].map((label, i) => (
              <th key={i + 4} className="px-4 py-1 border border-r">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {classInfo.class.map((student, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-100 cursor-pointer ${
                student.danger_level === 3
                    ? "bg-red-200 hover:bg-red-100"
                    : student.danger_level === 2
                    ? "bg-orange-200 hover:bg-orange-100"
                    : student.danger_level === 1
                    ? "bg-yellow-200 hover:bg-yellow-100"
                    : ""
                }`}
                onClick={() =>
                handleStudentClick(student, classInfo.curator_name, classInfo.subject_name)
              }
            >
              <td className="px-4 py-2 border text-center">{index + 1}</td>
              <td className="px-4 py-2 border text-center">{student.student_name}</td>
              {student.actual_score.slice(0, 4).map((score, i) => (
                <td key={i} className="px-4 py-2 border text-center">
                  {score}
                </td>
              ))}
              {student.predicted_score.slice(0, 4).map((score, i) => (
                <td key={i + 4} className="px-4 py-2 border text-center">
                  {score}
                </td>
              ))}
              <td className="px-2 py-2 border text-center">{student.danger_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;
