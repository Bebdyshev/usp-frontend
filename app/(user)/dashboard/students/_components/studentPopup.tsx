'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Student } from '@/constants/data';
import { AreaChart } from './area-graph';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, CheckCircleIcon, AlertCircleIcon, Clock } from 'lucide-react';
import axiosInstance from '@/app/axios/instance';

interface StudentPopupProps {
  studentData: Student;
  onClose: () => void;
  onSave?: (updatedData: Student) => void;
}

// Function to determine danger level color
const getDangerLevelColor = (percentageDifference: number) => {
  console.log(percentageDifference)
  if (percentageDifference < 5) return 'bg-white'; // Белый
  if (percentageDifference <= 10) return 'bg-green-200'; // Зелёный
  if (percentageDifference <= 15) return 'bg-yellow-200'; // Жёлтый
  return 'bg-red-200'; // Красный
};

// Function to calculate percentage difference
const calculateDifference = (actual: number, predicted: number) => {
  if (actual === 0) return 0; // Return 0 for undefined difference
  return (Math.abs(predicted - actual) / actual) * 100;
};

// Function to calculate overall score difference
const calculateOverallDifference = (actual: number[], predicted: number[]) => {
  const validPairs = actual.map((a, i) => [a, predicted[i]])
    .filter(([a, p]) => a !== 0 && p !== 0);
  
  if (validPairs.length === 0) return 0;
  
  const totalDiff = validPairs.reduce((sum, [a, p]) => sum + (p - a), 0);
  return totalDiff;
};

export const StudentPopup: React.FC<StudentPopupProps> = ({ studentData, onClose, onSave }) => {
  const [teacherComment, setTeacherComment] = useState(studentData.teacher_comment || '');
  const [teacherReport, setTeacherReport] = useState(studentData.teacher_report || '');
  const [studentComment, setStudentComment] = useState(studentData.student_comment || '');
  const [parentComment, setParentComment] = useState(studentData.parent_comment || '');
  const [newRecommendation, setNewRecommendation] = useState({ action: '', deadline: '' });
  const [recommendations, setRecommendations] = useState(studentData.teacher_recommendations || []);
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('teacher'); // Placeholder for user role (teacher, student, parent)
  const [isSaving, setIsSaving] = useState(false);
  
  // Calculate overall score difference
  const scoreDifference = calculateOverallDifference(
    studentData.actual_score.slice(0, 4),
    studentData.predicted_score.slice(0, 4)
  );
  
  // Check if commenting is required (score difference <= -10)
  const isCommentRequired = scoreDifference <= -10;
  
  // Check if report is required (yearly average is decreasing)
  const isReportRequired = scoreDifference < 0;

  // Function to mark comments as read based on role
  const markAsRead = async () => {
    try {
      if (userRole === 'student' || userRole === 'parent') {
        // In a real app, this would be an API call
        console.log(`Marking comment as read for ${userRole}`);
        // Example placeholder for API call:
        // await axiosInstance.post('/comments/mark-read', {
        //   studentId: studentData.id,
        //   reader: userRole
        // });
      }
    } catch (error) {
      console.error('Error marking comment as read:', error);
    }
  };

  // Mark comments as read when viewed by student or parent
  useEffect(() => {
    if ((userRole === 'student' || userRole === 'parent') && 
        studentData.teacher_comment) {
      markAsRead();
    }
  }, [userRole, studentData.teacher_comment]);

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Prepare updated student data
      const updatedStudentData: Student = {
        ...studentData,
        teacher_comment: teacherComment,
        teacher_report: teacherReport,
        student_comment: studentComment,
        parent_comment: parentComment,
        teacher_recommendations: recommendations,
        comments_read: {
          student_read: userRole === 'student' ? true : studentData.comments_read?.student_read || false,
          parent_read: userRole === 'parent' ? true : studentData.comments_read?.parent_read || false
        },
        has_new_comments: true
      };
      
      // Log the data being saved for debugging
      console.log('Saving changes:', updatedStudentData);
      
      // Instead of calling the API directly, just update local state for now
      // Comment out the API call to avoid errors if endpoint doesn't exist
      /*
      try {
        await axiosInstance.post('/students/update-feedback', updatedStudentData);
      } catch (error) {
        console.error("API error when saving feedback:", error);
        // Continue with local update even if API fails
      }
      */
      
      // Inform parent component about the changes
      if (onSave) {
        onSave(updatedStudentData);
      }
      
      // Show success message
      alert("Изменения успешно сохранены");
      
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert("Ошибка при сохранении изменений: " + (error instanceof Error ? error.message : "Неизвестная ошибка"));
      setIsSaving(false);
    }
  };

  const addRecommendation = () => {
    if (newRecommendation.action && newRecommendation.deadline) {
      setRecommendations([...recommendations, { ...newRecommendation, result: '' }]);
      setNewRecommendation({ action: '', deadline: '' });
    }
  };

  const updateRecommendationResult = (index: number, result: string) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[index].result = result;
    setRecommendations(updatedRecommendations);
  };

  // Display read status indicators
  const ReadStatusIndicator = ({ read }: { read: boolean }) => (
    <div className={`flex items-center ${read ? 'text-green-500' : 'text-gray-400'}`}>
      {read ? (
        <CheckCircleIcon className="w-4 h-4 mr-1" />
      ) : (
        <AlertCircleIcon className="w-4 h-4 mr-1" />
      )}
      <span className="text-xs">{read ? 'Прочитано' : 'Не прочитано'}</span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-[70%] h-[85%] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-2 border-b flex items-center">
          <h2 className="text-[25px] font-bold">{studentData.student_name}</h2>
          <Badge className="ml-4" variant={studentData.danger_level > 1 ? "destructive" : "secondary"}>
            Уровень риска: {studentData.danger_level}
          </Badge>
          <p className="text-[25px] ml-auto">{studentData.class_liter}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-6 sticky top-0 bg-white z-10">
            <TabsList>
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="comments" className="relative">
                Комментарии
                {studentData.has_new_comments && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                )}
              </TabsTrigger>
              <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="overview" className="p-6 h-full overflow-y-auto">
              <p className="text-[15px] mb-4">Куратор: {studentData.curator_name}</p>
          <table className="min-w-full table-auto mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border" colSpan={4}>
                  Score
                </th>
                <th className="px-4 py-2 border" colSpan={4}>
                  Predicted Score
                </th>
              </tr>
              <tr>
                <th className="px-4 py-1 border border-r">I</th>
                <th className="px-4 py-1 border border-r">II</th>
                <th className="px-4 py-1 border border-r">III</th>
                <th className="px-4 py-1 border border-r">IV</th>
                <th className="px-4 py-1 border border-r">I</th>
                <th className="px-4 py-1 border border-r">II</th>
                <th className="px-4 py-1 border border-r">III</th>
                <th className="px-4 py-1 border">IV</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                {studentData.actual_score.slice(0, 4).map((actualScore, index) => {
                  const predictedScore = studentData.predicted_score[index];
                  const percentageDifference = calculateDifference(actualScore, predictedScore);
                      const dangerColor = getDangerLevelColor(percentageDifference);
                  return(
                    <td
                    key={`actual-${index}`}
                          className={`relative px-4 py-2 text-center border ${dangerColor}`}
                    >
                    {actualScore !== 0.0 ? `${actualScore.toFixed(1)}%` : 'ND'}
                  </td>
                  );
                })}

                {studentData.predicted_score.slice(0, 4).map((predictedScore, index) => {
                  const actualScore = studentData.actual_score[index];
                  const percentageDifference = calculateDifference(actualScore, predictedScore);
                      const dangerColor = getDangerLevelColor(percentageDifference);

                  return (
                    <td
                      key={`predicted-${index}`}
                          className={`relative px-4 py-2 text-center border ${dangerColor}`}
                    >
                      {predictedScore !== 0.0 ? `${predictedScore.toFixed(1)}%` : 'ND'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          <div className='mt-4'>
          <AreaChart
            predicted_scores={studentData.predicted_score.slice(0, 4)}
            actual_score={studentData.actual_score.slice(0, 4)}
          />
          </div>
            </TabsContent>
            
            <TabsContent value="comments" className="p-6 h-full overflow-y-auto space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Комментарий учителя</span>
                    {studentData.comments_read && (
                      <div className="flex space-x-2">
                        <span className="text-sm font-normal">Студент:</span>
                        <ReadStatusIndicator read={studentData.comments_read.student_read} />
                        <span className="text-sm font-normal ml-4">Родитель:</span>
                        <ReadStatusIndicator read={studentData.comments_read.parent_read} />
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userRole === 'teacher' ? (
                    <div className="space-y-4">
                      <Textarea 
                        placeholder={isCommentRequired ? "Требуется комментарий (разница оценок -10 или ниже)" : "Добавьте комментарий..."}
                        value={teacherComment}
                        onChange={(e) => setTeacherComment(e.target.value)}
                        className={isCommentRequired && !teacherComment ? "border-red-500" : ""}
                      />
                      {isCommentRequired && !teacherComment && (
                        <p className="text-red-500 text-sm">Разница в оценках составляет -10 или ниже. Комментарий обязателен.</p>
                      )}
                      {isReportRequired && (
                        <div>
                          <h4 className="font-medium mb-2">Отчет (требуется при снижении оценки)</h4>
                          <Textarea 
                            placeholder="Детальный отчет о причинах снижения оценки и плане по улучшению..."
                            value={teacherReport}
                            onChange={(e) => setTeacherReport(e.target.value)}
                            className={isReportRequired && !teacherReport ? "border-red-500" : ""}
                            rows={5}
                          />
                          {isReportRequired && !teacherReport && (
                            <p className="text-red-500 text-sm">Отчет обязателен при снижении средне-годовой оценки.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border p-3 rounded-md bg-gray-50">
                      {teacherComment || "Комментарий отсутствует"}
                      {teacherReport && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Отчет учителя:</h4>
                          <p>{teacherReport}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Комментарий ученика</CardTitle>
                </CardHeader>
                <CardContent>
                  {userRole === 'student' ? (
                    <Textarea 
                      placeholder="Опишите своё понимание проблемы, причины, трудности, цели..."
                      value={studentComment}
                      onChange={(e) => setStudentComment(e.target.value)}
                    />
                  ) : (
                    <div className="border p-3 rounded-md bg-gray-50">
                      {studentComment || "Комментарий отсутствует"}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Комментарий родителя</CardTitle>
                </CardHeader>
                <CardContent>
                  {userRole === 'parent' ? (
                    <Textarea 
                      placeholder="Укажите меры, которые принимаются дома, задайте вопросы учителю..."
                      value={parentComment}
                      onChange={(e) => setParentComment(e.target.value)}
                    />
                  ) : (
                    <div className="border p-3 rounded-md bg-gray-50">
                      {parentComment || "Комментарий отсутствует"}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="p-6 h-full overflow-y-auto">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Рекомендации и план действий</h3>
                
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{rec.action}</h4>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <span>Срок: {rec.deadline}</span>
                              </div>
                            </div>
                            {userRole === 'teacher' && (
                              <div className="ml-4 flex-shrink-0">
                                <Input
                                  placeholder="Результат"
                                  value={rec.result || ''}
                                  onChange={(e) => updateRecommendationResult(index, e.target.value)}
                                  className="w-[200px]"
                                />
                              </div>
                            )}
                          </div>
                          {rec.result && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm"><strong>Результат:</strong> {rec.result}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
        </div>
                ) : (
                  <p className="text-gray-500">Нет активных рекомендаций</p>
                )}
                
                {userRole === 'teacher' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Добавить рекомендацию</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Рекомендуемое действие</label>
                          <Input
                            placeholder="Например: доп. уроки по алгебре"
                            value={newRecommendation.action}
                            onChange={(e) => setNewRecommendation({...newRecommendation, action: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Срок выполнения</label>
                          <Input
                            type="date"
                            value={newRecommendation.deadline}
                            onChange={(e) => setNewRecommendation({...newRecommendation, deadline: e.target.value})}
                          />
                        </div>
                        <Button 
                          onClick={addRecommendation}
                          disabled={!newRecommendation.action || !newRecommendation.deadline}
                        >
                          Добавить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-auto flex justify-end space-x-2 p-6 border-t bg-white sticky bottom-0">
          {(userRole === 'teacher' || userRole === 'student' || userRole === 'parent') && (
            <Button 
              onClick={saveChanges} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
