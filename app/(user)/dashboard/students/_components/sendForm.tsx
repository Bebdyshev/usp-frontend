import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ClassInfo, subjectData } from "@/constants/data";
import axios from "axios";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassInfo[];
  selectedOptionClass: string;
  handleClassOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (fileInputRef: React.RefObject<HTMLInputElement>, subject: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  classData = [],
  selectedOptionClass,
  handleClassOptionChange,
  handleSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [availableClasses, setAvailableClasses] = useState<ClassInfo[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Получаем уникальные параллели
  const gradeNumbers = classData

  // При изменении параллели обновляем список доступных классов и предметов
  useEffect(() => {
    if (selectedGrade && classData) {
      const filteredClasses = classData.filter(item => 
        item.class_liter.startsWith(selectedGrade)
      );
      setAvailableClasses(filteredClasses);
      
      // Получаем предметы для выбранной параллели
      const subjectsForGrade = subjectData.find(item => item.classNumber === selectedGrade);
      setAvailableSubjects(subjectsForGrade ? subjectsForGrade.subjects : []);
      setSelectedSubject(""); // Сбрасываем выбранный предмет
      
      // Если есть классы в этой параллели и не выбран класс, выбираем первый по умолчанию
      if (filteredClasses.length > 0 && (!selectedOptionClass || !filteredClasses.find(c => c.class_liter === selectedOptionClass))) {
        handleClassOptionChange({
          target: { value: filteredClasses[0].class_liter }
        } as React.ChangeEvent<HTMLSelectElement>);
      }
    } else {
      setAvailableClasses([]);
      setAvailableSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedGrade, classData, selectedOptionClass, handleClassOptionChange]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-[35%] h-[50%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Отправка файла</h2>

        <div className="mb-4">
          <label className="block mb-2">
            Выберите класс
          </label>
          <div className="flex gap-4">
            <select
              id="gradeSelect"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-[40%] p-2 border rounded"
            >
              <option value="">Параллель</option>
              {gradeNumbers && gradeNumbers.length > 0 && gradeNumbers.map((grade) => (
                <option key={grade} value={grade}>
                  {grade} класс
                </option>
              ))}
            </select>

            <select
              id="classSelect"
              value={selectedOptionClass}
              onChange={handleClassOptionChange}
              className={`w-[40%] p-2 border rounded ${!selectedGrade ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
              disabled={!selectedGrade}
            >
              <option value="">
                {selectedGrade ? "Выберите класс" : "Выберите параллель"}
              </option>
              {availableClasses && availableClasses.length > 0 && availableClasses.map((classItem) => (
                <option key={classItem.id} value={classItem.class_liter}>
                  {classItem.class_liter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Выберите предмет
          </label>
          <select
            id="subjectSelect"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={`w-full p-2 border rounded ${!selectedGrade ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            disabled={!selectedGrade}
          >
            <option value="">
              {selectedGrade ? "Выберите предмет" : "Сначала выберите параллель"}
            </option>
            {availableSubjects && availableSubjects.length > 0 && availableSubjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="fileInput" className="block mb-2">
            Загрузите Excel файл
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xls,.xlsx"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-auto flex justify-end space-x-2">
          <Button className="w-20 bg-gray-400 hover:bg-[#9ca4ac]" onClick={onClose}>
            Назад
          </Button>
          <Button 
            onClick={() => handleSubmit(fileInputRef, selectedSubject)}
            disabled={!selectedOptionClass || !selectedSubject}
          >
            Отправить файл
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;