import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Student } from '@/constants/data'
import { AreaChart } from './area-graph';

interface StudentPopupProps {
  studentData: Student;
  onClose: () => void;
}

export const StudentPopup: React.FC<StudentPopupProps> = ({ studentData, onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg w-[50%] h-[80%] flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.05 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-6 pb-2 border-b flex'>
            <h2 className="text-[25px] font-bold ">
                {studentData.student_name}
            </h2>
            <p className='text-[25px] ml-auto'>
                {studentData.class_liter}
            </p>
        </div>
        <div className='p-6 pb-2'>
            <p className='text-[15px] ml-auto'>
              Куратор: {studentData.curator_name}
            </p>
            <p className='text-[15px] ml-auto'>
                add info
            </p>
            
            <AreaChart predicted_scores={studentData.predicted_score.slice(0, 4)} actual_score={studentData.actual_score.slice(0, 4)}/>
        </div>

        <div className="mt-auto flex justify-end space-x-2 p-6">
          <Button className="w-full bg-gray-400 hover:bg-[#9ca4ac] w-20" onClick={onClose}>
            Назад
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
