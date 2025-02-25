'use client';

import { FC, useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DangerousClass {
  grade: string;
  avg_danger_level: number;
}

interface ClassTableProps {
  dangerousClasses: DangerousClass[];
}

const COLORS = {
  high: "#FF0000",
  medium: "#FFBB28",
  low: "#FF8042",
};

const ChartContainer: FC<ClassTableProps> = ({ dangerousClasses }) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const { totalData } = useMemo(() => {
    const dangerLevels = { high: 0, medium: 0, low: 0 };

    dangerousClasses.forEach((item) => {
      if (item.avg_danger_level >= 2.5) {
        dangerLevels.high++;
      } else if (item.avg_danger_level >= 1.5) {
        dangerLevels.medium++;
      } else {
        dangerLevels.low++;
      }
    });

    return {
      totalData: {
        labels: ["Высокий риск", "Средний риск", "Низкий риск"],
        datasets: [
          {
            data: [dangerLevels.high, dangerLevels.medium, dangerLevels.low],
            backgroundColor: [COLORS.high, COLORS.medium, COLORS.low],
            hoverBackgroundColor: ["#CC0000", "#E6A800", "#CC6600"],
            borderWidth: 2,
          },
        ],
      },
    };
  }, [dangerousClasses]);

  const filteredData = useMemo(() => {
    const filteredClasses = dangerousClasses.filter(
      (item) =>
        (!selectedClass || item.grade === selectedClass) &&
        (selectedLevel === null ||
          (selectedLevel === 3 && item.avg_danger_level >= 2.5) ||
          (selectedLevel === 2 && item.avg_danger_level >= 1.5 && item.avg_danger_level < 2.5) ||
          (selectedLevel === 1 && item.avg_danger_level < 1.5))
    );

    return {
      labels: filteredClasses.map((item) => item.grade),
      datasets: [
        {
          data: filteredClasses.map(() => 1),
          backgroundColor: filteredClasses.map((item) =>
            item.avg_danger_level >= 2.5
              ? COLORS.high
              : item.avg_danger_level >= 1.5
              ? COLORS.medium
              : COLORS.low
          ),
          borderWidth: 2,
        },
      ],
    };
  }, [dangerousClasses, selectedClass, selectedLevel]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-center gap-2">
        <Select onValueChange={setSelectedClass} value={selectedClass ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Все классы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все классы</SelectItem>
            {dangerousClasses.map((item) => (
              <SelectItem key={item.grade} value={item.grade}>{item.grade}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSelectedLevel(value ? Number(value) : null)} value={selectedLevel?.toString() ?? undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Все уровни" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Высокий риск</SelectItem>
            <SelectItem value="2">Средний риск</SelectItem>
            <SelectItem value="1">Низкий риск</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row gap-4 h-full mt-4">
        <Card className="flex-1">
          <CardHeader className="items-center">
            <CardTitle>Распределение внутри категории</CardTitle>
            <CardDescription>Фильтрованный список классов</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-130px)]">
            {filteredData.labels.length > 0 ? (
              <div className="w-full h-full max-w-[300px] flex justify-center items-center">
                <Pie
                  data={filteredData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-muted-foreground">Нет данных</p>
            )}
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="items-center">
            <CardTitle>Общее распределение рисков</CardTitle>
            <CardDescription>Все классы по уровням риска</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-130px)]">
            <div className="w-full h-full max-w-[300px] flex justify-center items-center">
              <Pie
                data={totalData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartContainer;
