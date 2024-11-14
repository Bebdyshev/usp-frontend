"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { classData } from '@/constants/data';
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StudentPopup } from './studentPopup';

export default function OverViewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedOptionClass, setSelectedOptionClass] = useState("9A")
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null); 
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchClassData();
    } else if (!authLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/get_class', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setStudents(response.data.class_data);
      setFilteredStudents(response.data.class_data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student); 
    setStudentModalOpen(true); 
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
    setStudentModalOpen(false);
  };


  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    if (selectedClass === "Все") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) => student.grade_liter === selectedClass
      );
      setFilteredStudents(filtered);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = students
      .filter((classObj) => 
        selectedClass === "Все" || classObj.grade_liter === selectedClass
      )
      .map((classObj) => ({
        ...classObj,
        class: classObj.class.filter((student) =>
          student.student_name.toLowerCase().includes(query)
        ),
      }))
      .filter((classObj) => classObj.class.length > 0);
  
    setFilteredStudents(filtered);
  };  

  const handleClassOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value;
    setSelectedOptionClass(selectedClass);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedClass || !fileInputRef.current?.files?.length) {
      alert("Please select a class and upload a file.");
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
      alert("Please upload a valid Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("grade", selectedClass);
    formData.append("curator", classData.find(c => c.class_liter === selectedClass)?.curator || "");
    formData.append("file", file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://127.0.0.1:8000/send/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("File sent successfully:", response.data);
      handleModalClose();
    } catch (error) {
      console.error("Error submitting file:", error);
      alert("Error submitting file.");
    }
  };

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Button onClick={handleButtonClick} className="w-full text-[16px]">
          Добавить оценки
        </Button>
      </div>

      <div className="mt-4 flex space-between">
        <div className="w-1/5">
          <label htmlFor="classSelect" className="block mb-2">Выберите класс</label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full p-2 border rounded"
          >
            <option value="Все">Все</option>
            {classData.map((classItem) => (
              <option key={classItem.id} value={classItem.class_liter}>
                {classItem.class_liter}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2 ml-auto relative flex flex-col justify-end">
        <input
          className="peer w-full pl-9 pr-9 mb-0 rounded"
          placeholder="Найти студента..."
          value={searchQuery} // Bind search input
          onChange={handleSearchChange} // Call handleSearch on input change
          type="search"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 top-8 flex items-center justify-center pl-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            role="presentation"
          />
        </div>
        <button
          className="absolute inset-y-px right-px top-4 flex h-full w-9 items-center justify-center rounded-r-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            role="presentation"
          />
        </button>
        </div>
      </div>

      {filteredStudents.length > 0 && (
        <div className="overflow-y-auto mt-6">
          {filteredStudents.map((classInfo, classIndex) => (
            <div key={classIndex} className="overflow-hidden rounded-[5px] border border-gray-300 mb-4">
              <div className='flex p-2 pt-3 border-b'>
                <h1 className='text-[17px] ml-4'>
                  Класс: <b>{classInfo.grade_liter}</b>
                </h1>
                <h1 className='text-[17px] ml-auto mr-4'>
                  {classInfo.curator_name}
                </h1>
              </div>
              <table key={classIndex} className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Rank</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Score</th>
                    <th className="px-4 py-2 border-b">Teacher Score</th>
                    <th className="px-4 py-2 border-b">Danger Level</th>
                  </tr>
                </thead>
                <tbody>
                  {classInfo.class.map((student, index) => {
                    const rowColor =
                      student.danger_level === 3 ? 'bg-red-100' :
                      student.danger_level === 2 ? 'bg-yellow-100' :
                      'bg-green-100';

                    return (
                      <tr
                        key={index}
                        className={`border-b ${rowColor} cursor-pointer`}
                        onClick={() => handleStudentClick(student)} // Click to open student popup
                      >
                        <td className="px-4 py-2 flex justify-center items-center text-[18px]">{index + 1}</td>
                        <td className="px-4 py-2">{student.student_name}</td>
                        <td className="px-4 py-2">{student.actual_score.toFixed(2)}%</td>
                        <td className="px-4 py-2">{student.teacher_score.toFixed(2)}%</td>
                        <td className="px-4 py-2">{student.delta_percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {studentModalOpen && selectedStudent && (
        <StudentPopup studentData={selectedStudent} onClose={handleClosePopup} />
      )}
    
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={handleModalClose}
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-[35%] h-[50%] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Отправка файла</h2>

            <div className="mb-4 flex-grow">
              <label htmlFor="classSelect" className="block mb-2">Выберите класс</label>
              <select
                id="classSelect"
                value={selectedOptionClass}
                onChange={handleClassOptionChange}
                className="w-full p-2 border rounded"
              >
                {classData.map((classItem) => (
                  <option key={classItem.id} value={classItem.class_liter}>
                    {classItem.class_liter}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="fileInput" className="block mb-2">Загрузите Excel файл</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".xls,.xlsx"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mt-auto flex justify-end space-x-2">
              <Button className="w-full bg-gray-400 hover:bg-[#9ca4ac] w-20" onClick={handleSubmit}>
                Назад
              </Button>
              <Button className="w-full" onClick={handleSubmit}>
                Сохранить
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
}
