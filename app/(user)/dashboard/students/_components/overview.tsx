"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { classData, subjectData } from '@/constants/data';
import axios from 'axios';
import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/hooks/use-auth';
import { ArrowRight, Search } from 'lucide-react';
import { StudentPopup } from './studentPopup';
import FileUploadModal from './sendForm';
import ClassTable from './classTable';
import axiosInstance from '@/app/axios/instance';

export default function OverViewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Все");
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
  const [curator, setCurator] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Все");
  const [selectedDangerLevel, setSelectedDangerLevel] = useState("Все");
  const [noClassses, setNoClassses] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (studentModalOpen) {
          handleClosePopup();
        }
        if (isModalOpen) {
          handleModalClose();
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [studentModalOpen, isModalOpen]);  

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
      const response = await axiosInstance.get('/grades/get_class');
      
      setStudents(response.data.class_data);
      setFilteredStudents(response.data.class_data);
      console.log(response.data.class_data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("No classes found. Please check the data source.");
        setNoClassses(true);
      } else {
        console.error("Error fetching class data:", error);
        alert("An error occurred while fetching class data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (student: any, curator: string, subject: string) => {
    setCurator(curator);
    setSubject(subject);
    setSelectedStudent(student); 
    setStudentModalOpen(true); 
  };

  const handleClosePopup = () => {
    setCurator("");
    setSubject("");
    setSelectedStudent(null);
    setStudentModalOpen(false);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);
    console.log(selectedSubject)

    if (selectedClass === "Все" && selectedSubject === "Все" && selectedDangerLevel === "Все") {
      setFilteredStudents(students); // No filter, show all students
    } else {
      const filtered = students.filter((student) => {
        const isClassMatch = selectedClass === "Все" || student.grade_liter === selectedClass;
        const isSubjectMatch = selectedSubject === "Все" || student.subject_name === selectedSubject;
        return isClassMatch && isSubjectMatch;
      });
      setFilteredStudents(filtered);
    }
  };

  const handleDangerLevelChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDangerLevel = event.target.value;
    setSelectedDangerLevel(selectedDangerLevel); // Update the selected danger level

    if (selectedDangerLevel === "Все") {
      setFilteredStudents(students); 
    } else {
      try {
        const response = await axiosInstance.get(`grades/get_students_danger?level=${selectedDangerLevel}`);
        const data = response.data;
          
        setFilteredStudents(data.filtered_class_data); 
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("An error occurred while fetching students with the selected danger level.");
      }
    }
  };
  
  
  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    if (selectedClass === "Все" && selectedSubject === "Все" && selectedDangerLevel === "Все") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) => {
        const isClassMatch = selectedClass === "Все" || student.grade_liter === selectedClass;
        const isSubjectMatch = selectedSubject === "Все" || student.subject_name === selectedSubject;
        return isClassMatch && isSubjectMatch;
      });
      setFilteredStudents(filtered);
    }
  };
  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    const filtered = students
      .filter((classObj) => 
        selectedClass === "Все" || classObj.grade_liter === selectedClass
      )
      .map((classObj) => ({
        ...classObj,
        class: classObj.class.filter((student: any) =>
          student.student_name.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((classObj) => classObj.class.length > 0);
  
    setFilteredStudents(filtered);
  };  

  const handleClassOptionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value;
    setSelectedOptionClass(selectedClass);
    console.log("selectedOptionClass", selectedClass);
  }, []);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (fileInputRef: React.RefObject<HTMLInputElement>) => {
    if (!selectedOptionClass || !fileInputRef.current?.files?.length) {
      alert("Please select a class and upload a file.");
      return;
    }
  
    const file = fileInputRef.current.files[0];
    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
      alert("Please upload a valid Excel file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("grade", selectedOptionClass);
    const foundClass = classData.find(c => c.class_liter === selectedOptionClass);
    const curatorName = foundClass?.curator || "";
    formData.append("curator", curatorName);
    formData.append("subject", "Биология");
    formData.append("file", file);
  
    try {
      const response = await axiosInstance.post('/grades/send/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("File sent successfully:", response.data);
      handleModalClose();
    } catch (error) {
      console.error("Error submitting file:", error);
      alert("Error submitting file.");
    }
  };
  

  useEffect(() => {
    console.log(classData);
  }, [classData]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  console.log("class data: ", classData);

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Button onClick={handleButtonClick} className="w-full text-[16px]">
          Добавить оценки
        </Button>
      </div>

      <div className="mt-4 flex space-between">
        <div className="w-[13%]">
          <label htmlFor="classSelect" className="block mb-2">Выберите класс</label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full p-2 border rounded"
          >
            <option value="Все">Все</option>
            {classData && classData.length > 0 ? classData.map((classItem) => (
              <option key={classItem.id} value={classItem.class_liter}>
                {classItem.class_liter}
              </option>
            )) : null}
          </select>
        </div>
        <div className="w-[13%] ml-4">
          <label htmlFor="subjectSelect" className="block mb-2">Выберите предмет</label>
          <select
            id="subjectSelect"
            value={selectedSubject} 
            onChange={handleSubjectChange} 
            className="w-full p-2 border rounded"
          >
            <option value="Все">Все</option>
            {subjectData && subjectData[0] && subjectData[0].subjects ? 
              subjectData[0].subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))
            : null}
          </select>
        </div>

        <div className="w-[13%] ml-5">
          <label htmlFor="subjectSelect" className="block mb-2">Выберите уровень</label>
          <select
            id="subjectSelect"
            value={selectedDangerLevel} 
            onChange={handleDangerLevelChange} 
            className="w-full p-2 border rounded"
          >
            <option value="Все">Все</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            
          </select>
        </div>

        <div className="w-1/3 ml-auto relative flex flex-col justify-end">
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
    {
      noClassses && (
        <div className='w-full h-full text-center items-center mt-[250px] text-gray-500'>
          Здесь пока нет классов!
        </div>
      )
    }
      {filteredStudents.length > 0 && !noClassses && (
        <div className="overflow-y-auto mt-6">
          {filteredStudents
            .map((classInfo) => ({
              ...classInfo,
              class: Array.isArray(classInfo.class) 
                ? classInfo.class.sort((a: any, b: any) => b.danger_level - a.danger_level)
                : [] // Provide empty array if class is undefined
            }))
            .map((classInfo, classIndex) => (
              <ClassTable 
                key={classIndex} 
                classInfo={classInfo} 
                handleStudentClick={handleStudentClick} 
              />      
            ))}
        </div>
      )}

      {studentModalOpen && selectedStudent && (
        <StudentPopup studentData={{ ...selectedStudent, curator_name: curator, subject: subject }} onClose={handleClosePopup} />
      )}
      
      {isModalOpen && (
        <FileUploadModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          classData={classData}
          selectedOptionClass={selectedOptionClass}
          handleClassOptionChange={handleClassOptionChange}
          handleSubmit={handleSubmit}
          fileInputRef={fileInputRef}
        />
      )}
    </PageContainer>
  );
}
