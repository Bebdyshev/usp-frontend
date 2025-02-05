import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ClassInfo from "@/constants/data";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassInfo[];
  selectedOptionClass: string;
  handleClassOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  classData,
  selectedOptionClass,
  handleClassOptionChange,
  handleSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      style={{ backdropFilter: "blur(2px)" }}
      onClick={onClose}
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

        <div className="mb-4">
          <label htmlFor="classSelect" className="block mb-2">
            Выберите класс
          </label>
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
          <Button className="w-full" onClick={handleSubmit}>
            Сохранить
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FileUploadModal;