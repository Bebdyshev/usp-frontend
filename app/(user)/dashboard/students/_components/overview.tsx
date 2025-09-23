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
import { useAvailableClasses } from '@/hooks/use-system-settings';

export default function OverViewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Все");
  const [selectedGrade, setSelectedGrade] = useState("Все");
  const [selectedOptionClass, setSelectedOptionClass] = useState("7A")
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
  
  // Use dynamic classes from system settings
  const { classes: systemClasses, grades: systemGrades, loading: classesLoading } = useAvailableClasses();
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [gradeClasses, setGradeClasses] = useState<{[grade: string]: string[]}>({});
  
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
  
  // Update available classes from system settings
  useEffect(() => {
    if (!classesLoading && systemClasses.length > 0) {
      setAvailableClasses(systemClasses);
      
      // Group classes by grade using system grades
      const groupedClasses: {[grade: string]: string[]} = {};
      systemGrades.forEach(grade => {
        const gradeStr = grade.toString();
        groupedClasses[gradeStr] = systemClasses.filter(className => 
          className.startsWith(gradeStr)
        );
      });
      
      setGradeClasses(groupedClasses);
      
      // Update selected class if it doesn't exist in new system
      if (selectedOptionClass && !systemClasses.includes(selectedOptionClass)) {
        setSelectedOptionClass(systemClasses[0] || "7A");
      }
    }
  }, [systemClasses, systemGrades, classesLoading, selectedOptionClass]);

  useEffect(() => {
    // Also extract classes from actual student data for compatibility
    if (students && students.length > 0) {
      const classNames = students.map(item => item.grade_liter);
      const uniqueClasses = Array.from(new Set(classNames));
      
      // Merge with system classes
      const mergedClasses = Array.from(new Set([...systemClasses, ...uniqueClasses]));
      setAvailableClasses(mergedClasses);
    }
  }, [students, systemClasses]);
  
  useEffect(() => {
    if (selectedGrade !== "Все") {
      // If grade is selected but class is set to "All" or is from a different grade
      const availableClassesForGrade = gradeClasses[selectedGrade] || [];
      if (selectedClass === "Все" || !availableClassesForGrade.includes(selectedClass)) {
        setSelectedClass("Все");
      }
    }
  }, [selectedGrade, gradeClasses, selectedClass]);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/grades/get_class');
      
      setStudents(response.data.class_data);
      setFilteredStudents(response.data.class_data);
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
    
    // Add default values for the new fields if they don't exist
    const enhancedStudent = {
      ...student,
      curator_name: curator,
      subject,
      teacher_comment: student.teacher_comment || '',
      student_comment: student.student_comment || '',
      parent_comment: student.parent_comment || '',
      comments_read: student.comments_read || {
        student_read: false,
        parent_read: false
      },
      teacher_report: student.teacher_report || '',
      teacher_recommendations: student.teacher_recommendations || [],
      has_new_comments: student.has_new_comments || false
    };
    
    setSelectedStudent(enhancedStudent);
    setStudentModalOpen(true); 
  };

  const handleClosePopup = () => {
    setCurator("");
    setSubject("");
    setSelectedStudent(null);
    setStudentModalOpen(false);
  };

  const handleSaveStudentData = (updatedData: any) => {
    try {
      // Make a deep copy of the current filtered students to avoid reference issues
      const updatedFilteredStudents = JSON.parse(JSON.stringify(filteredStudents));
      const updatedStudentsArray = JSON.parse(JSON.stringify(students));
      
      // Find the specific class and student to update in filtered students
      let studentUpdated = false;
      for (let i = 0; i < updatedFilteredStudents.length; i++) {
        const classInfo = updatedFilteredStudents[i];
        if (classInfo.grade_liter === updatedData.class_liter && 
            classInfo.subject_name === updatedData.subject) {
          for (let j = 0; j < classInfo.class.length; j++) {
            if (classInfo.class[j].student_name === updatedData.student_name) {
              // Update the student data
              classInfo.class[j] = {
                ...classInfo.class[j],
                teacher_comment: updatedData.teacher_comment,
                student_comment: updatedData.student_comment,
                parent_comment: updatedData.parent_comment,
                comments_read: updatedData.comments_read,
                teacher_report: updatedData.teacher_report,
                teacher_recommendations: updatedData.teacher_recommendations,
                has_new_comments: updatedData.has_new_comments
              };
              studentUpdated = true;
              break;
            }
          }
          if (studentUpdated) break;
        }
      }
      
      // Similarly update the main students array
      studentUpdated = false;
      for (let i = 0; i < updatedStudentsArray.length; i++) {
        const classInfo = updatedStudentsArray[i];
        if (classInfo.grade_liter === updatedData.class_liter && 
            classInfo.subject_name === updatedData.subject) {
          for (let j = 0; j < classInfo.class.length; j++) {
            if (classInfo.class[j].student_name === updatedData.student_name) {
              // Update the student data
              classInfo.class[j] = {
                ...classInfo.class[j],
                teacher_comment: updatedData.teacher_comment,
                student_comment: updatedData.student_comment,
                parent_comment: updatedData.parent_comment,
                comments_read: updatedData.comments_read,
                teacher_report: updatedData.teacher_report,
                teacher_recommendations: updatedData.teacher_recommendations,
                has_new_comments: updatedData.has_new_comments
              };
              studentUpdated = true;
              break;
            }
          }
          if (studentUpdated) break;
        }
      }
      
      // Update state only if we found and updated the student
      if (studentUpdated) {
        setFilteredStudents(updatedFilteredStudents);
        setStudents(updatedStudentsArray);
        
        // Update selected student data
        setSelectedStudent(updatedData);
        
        console.log("Student data updated successfully");
      } else {
        console.warn("Could not find the student to update", updatedData);
      }
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);

    applyFilters(selectedGrade, selectedClass, selectedSubject, selectedDangerLevel);
  };

  const handleDangerLevelChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDangerLevel = event.target.value;
    setSelectedDangerLevel(selectedDangerLevel);

    if (selectedDangerLevel === "Все") {
      applyFilters(selectedGrade, selectedClass, selectedSubject, "Все");
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
  
  const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = event.target.value;
    setSelectedGrade(newGrade);
    setSelectedClass("Все");
    
    applyFilters(newGrade, "Все", selectedSubject, selectedDangerLevel);
  };
  
  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = event.target.value;
    setSelectedClass(newClass);
    
    applyFilters(selectedGrade, newClass, selectedSubject, selectedDangerLevel);
  };
  
  const applyFilters = (grade: string, className: string, subject: string, dangerLevel: string) => {
    if (grade === "Все" && className === "Все" && subject === "Все" && dangerLevel === "Все") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) => {
        const gradeMatch = grade === "Все" || student.grade_liter.startsWith(grade);
        const classMatch = className === "Все" || student.grade_liter === className;
        const subjectMatch = subject === "Все" || student.subject_name === subject;
        
        return gradeMatch && classMatch && subjectMatch;
      });
      setFilteredStudents(filtered);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    const filtered = students
      .filter((classObj) => {
        const gradeMatch = selectedGrade === "Все" || classObj.grade_liter.startsWith(selectedGrade);
        const classMatch = selectedClass === "Все" || classObj.grade_liter === selectedClass;
        return gradeMatch && classMatch;
      })
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
    console.log("class data: ", classData);
  }, [classData]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  // Get unique grade numbers - use system grades if available, otherwise extract from data
  const gradeNumbers = systemGrades.length > 0 
    ? systemGrades.map(g => g.toString()).sort((a, b) => parseInt(a) - parseInt(b))
    : Object.keys(gradeClasses).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <Button onClick={handleButtonClick} className="w-full text-[16px]">
          Добавить оценки
        </Button>
      </div>

      <div className="mt-4 flex space-between flex-wrap sticky top-0 bg-white z-10 pb-4">
        <div className="w-[15%] min-w-[150px]">
          <label htmlFor="gradeSelect" className="block mb-2">Выберите параллель</label>
          <select
            id="gradeSelect"
            value={selectedGrade}
            onChange={handleGradeChange}
            className="w-full p-2 border rounded"
          >
            <option value="Все">Все</option>
            {gradeNumbers.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-[15%] ml-4 min-w-[150px]">
          <label htmlFor="classSelect" className="block mb-2">Выберите класс</label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full p-2 border rounded"
            disabled={selectedGrade === "Все"}
          >
            <option value="Все">Все</option>
            {selectedGrade !== "Все" && gradeClasses[selectedGrade]?.map((className, index) => (
              <option key={index} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-[15%] ml-4 min-w-[150px]">
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

        <div className="w-[15%] ml-4 min-w-[150px]">
          <label htmlFor="dangerLevelSelect" className="block mb-2">Выберите уровень</label>
          <select
            id="dangerLevelSelect"
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

        <div className="w-full md:w-1/3 mt-4 md:mt-0 md:ml-auto relative flex flex-col justify-end">
        <input
          className="peer w-full pl-9 pr-9 mb-0 rounded"
          placeholder="Найти студента..."
          value={searchQuery}
          onChange={handleSearchChange}
          type="search"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 top-0 flex items-center justify-center pl-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            role="presentation"
          />
        </div>
        <button
          className="absolute inset-y-px right-px top-0 flex h-full w-9 items-center justify-center rounded-r-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="overflow-y-auto mt-6 max-h-[calc(100vh-250px)]">
          {filteredStudents
            .map((classInfo) => ({
              ...classInfo,
              class: Array.isArray(classInfo.class) 
                ? classInfo.class.sort((a: any, b: any) => b.danger_level - a.danger_level)
                : []
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
        <StudentPopup 
          studentData={{ ...selectedStudent, curator_name: curator, subject: subject }} 
          onClose={handleClosePopup} 
          onSave={handleSaveStudentData}
        />
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
