'use client';
import { FC, useMemo } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

interface DangerousClass {
  grade: string;
  avg_danger_level: number;
}

interface ClassTableProps {
  dangerousClasses: DangerousClass[];
}

const COLORS = {
  high: '#FF0000',    // красный для высокого уровня
  medium: '#FFBB28',  // желтый для среднего
  low: '#FF8042'      // оранжевый для низкого
};

const ChartContainer: FC<ClassTableProps> = ({ dangerousClasses }) => {
  const pieData = useMemo(() => {
    const dangerLevels = {
      high: 0,
      medium: 0,
      low: 0
    };

    dangerousClasses.forEach(item => {
      if (item.avg_danger_level >= 2.5) {
        dangerLevels.high++;
      } else if (item.avg_danger_level >= 1.5) {
        dangerLevels.medium++;
      } else {
        dangerLevels.low++;
      }
    });

    const total = dangerousClasses.length;
    
    return [
      { name: 'Высокий риск', value: (dangerLevels.high / total) * 100 },
      { name: 'Средний риск', value: (dangerLevels.medium / total) * 100 },
      { name: 'Низкий риск', value: (dangerLevels.low / total) * 100 }
    ];
  }, [dangerousClasses]);

  const totalClasses = dangerousClasses.length;

  return (
    <div className="w-full h-full border-collapse rounded-lg overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={Object.values(COLORS)[index]} 
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Legend />
          {/* Центральный текст */}
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            <tspan
              x="50%"
              y="45%"
              className="fill-foreground text-2xl font-bold"
            >
              {totalClasses}
            </tspan>
            <tspan
              x="50%"
              y="65%"
              className="fill-muted-foreground text-sm"
            >
              Классов
            </tspan>
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;