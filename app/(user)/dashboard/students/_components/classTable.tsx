import React from "react";
import { MessageCircle } from "lucide-react";

interface Student {
  student_name: string;
  actual_score: number[];
  predicted_score: number[];
  danger_level: number;
  teacher_comment?: string;
  student_comment?: string;
  parent_comment?: string;
  comments_read?: {
    student_read: boolean;
    parent_read: boolean;
  };
  has_new_comments?: boolean;
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
      <div className="flex flex-col md:flex-row p-2 pt-3 border-b">
        <h1 className="text-[17px] ml-2 md:ml-4">
          Класс: <b>{classInfo.grade_liter}</b>
        </h1>
        <h1 className="text-[17px] ml-2 md:ml-5 mt-1 md:mt-0">
          Предмет: <b>{classInfo.subject_name}</b>
        </h1>
        <h1 className="text-[17px] ml-2 md:ml-auto mr-2 md:mr-4 mt-1 md:mt-0">{classInfo.curator_name}</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto w-full">
          <thead>
            <tr>
              <th className="px-2 md:px-4 py-2 border sticky left-0 bg-white z-10" rowSpan={2}>
                Rank
              </th>
              <th className="px-2 md:px-4 py-2 border sticky left-[53px] md:left-[61px] bg-white z-10" rowSpan={2}>
                Name
              </th>
              <th className="px-2 md:px-4 py-2 border" colSpan={4}>
                Score
              </th>
              <th className="px-2 md:px-4 py-2 border" colSpan={4}>
                Predicted Score
              </th>
              <th className="px-2 md:px-4 py-2 border" rowSpan={2}>
                Danger Level
              </th>
              <th className="px-2 md:px-4 py-2 border" rowSpan={2}>
                Comments
              </th>
            </tr>
            <tr>
              {["I", "II", "III", "IV"].map((label, i) => (
                <th key={i} className="px-2 md:px-4 py-1 border border-r">
                  {label}
                </th>
              ))}
              {["I", "II", "III", "IV"].map((label, i) => (
                <th key={i + 4} className="px-2 md:px-4 py-1 border border-r">
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
                <td className="px-2 md:px-4 py-2 border text-center sticky left-0 bg-inherit z-10">{index + 1}</td>
                <td className="px-2 md:px-4 py-2 border text-center sticky left-[53px] md:left-[61px] bg-inherit z-10 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    {student.student_name}
                    {student.has_new_comments && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </div>
                </td>
                {student.actual_score.slice(0, 4).map((score, i) => (
                  <td key={i} className="px-2 md:px-4 py-2 border text-center">
                    {score}
                  </td>
                ))}
                {student.predicted_score.slice(0, 4).map((score, i) => (
                  <td key={i + 4} className="px-2 md:px-4 py-2 border text-center">
                    {score}
                  </td>
                ))}
                <td className="px-2 py-2 border text-center">{student.danger_level}</td>
                <td className="px-2 py-2 border text-center">
                  {(student.teacher_comment || student.student_comment || student.parent_comment) && (
                    <div className="flex justify-center">
                      <MessageCircle size={16} className={student.has_new_comments ? "text-red-500" : "text-gray-500"} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassTable;
