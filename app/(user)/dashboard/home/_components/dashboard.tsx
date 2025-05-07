'use client';
import { useEffect, useState } from "react";
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import axiosInstance from "@/app/axios/instance";
import TableContainer from './table';
import ChartContainer from './piechart';

export default function DashBoardPage() {
  const [dangerLevels, setDangerLevels] = useState({
    level3: 0,
    level2: 0,
    level1: 0
  });
  const [dangerousClasses, setDangerousClasses] = useState([]);
  const [classDangerPercentages, setClassDangerPercentages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('dashboard/danger-levels');
        const data = response.data;

        setDangerLevels({
          level3: data.danger_level_stats[3]?.student_count || 0,
          level2: data.danger_level_stats[2]?.student_count || 0,
          level1: data.danger_level_stats[1]?.student_count || 0
        });

        setDangerousClasses(data.all_dangerous_classes);
        
        try {
          const piechartResponse = await axiosInstance.get('dashboard/danger-levels-piechart');
          if (piechartResponse.data && piechartResponse.data.class_danger_percentages) {
            setClassDangerPercentages(piechartResponse.data.class_danger_percentages);
          }
        } catch (piechartError) {
          console.error('Error fetching piechart data:', piechartError);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card className="hover:border-red-500 group transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-red-500 transition duration-300">
              Опасность 3 уровня
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert group-hover:text-red-500 transition duration-300">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold group-hover:text-red-500 transition duration-300">
              {dangerLevels.level3}
            </div>
            <p className="text-xs text-muted-foreground group-hover:text-red-500 transition duration-300">
              Студентов
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-yellow-500 group transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-yellow-500 transition duration-300">
            <CardTitle className="text-sm font-medium group-hover:text-yellow-500 transition duration-300">
              Опасность 2 уровня
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </CardHeader>
          <CardContent className="group-hover:text-yellow-500 transition duration-300">
            <div className="text-2xl font-bold">{dangerLevels.level2}</div>
            <p className="text-xs text-muted-foreground">
              Студентов
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-500 group transition duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-orange-500 transition duration-300">
            <CardTitle className="text-sm font-medium group-hover:text-orange-500 transition duration-300">
              Опасность 1 уровня
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-octagon-alert">
              <path d="M12 16h.01" />
              <path d="M12 8v4" />
              <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
            </svg>
          </CardHeader>
          <CardContent className="group-hover:text-orange-500 transition duration-300">
            <div className="text-2xl font-bold">{dangerLevels.level1}</div>
            <p className="text-xs text-muted-foreground">
              Студентов
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mt-4 h-[70%]">
        <div className="w-[65%]">
          <ChartContainer 
            dangerousClasses={dangerousClasses} 
            classDangerPercentages={classDangerPercentages}
          />
        </div>
        <Card className="w-[35%]">
          <TableContainer dangerousClasses={dangerousClasses} />
        </Card>
      </div>
    </PageContainer>
  );
}
