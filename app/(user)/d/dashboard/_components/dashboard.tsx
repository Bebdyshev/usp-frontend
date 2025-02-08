'use client';
import { useEffect, useState } from "react";
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axiosInstance from "@/app/axios/instance";

export default function DashBoardPage() {

  return (
    <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <Card className="hover:border-red-500 group transition duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-red-500 transition duration-300">
                  Всего уязвимостей
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-triangle-alert group-hover:text-red-500 transition duration-300"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                  <path d="M12 9v4"/>
                  <path d="M12 17h.01"/>
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-red-500 transition duration-300"></div>
                <p className="text-xs text-muted-foreground group-hover:text-red-500 transition duration-300">
                </p>
              </CardContent>
            </Card>

              <Card className="hover:border-yellow-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-yellow-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-yellow-500 transition duration-300">
                    Потенциальные уязвимости
                  </CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-yellow-500 transition duration-300'>
                  <div className="text-2xl font-bold"></div>
                  <p className="text-xs text-muted-foreground">
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-orange-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-orange-500 transition duration-300">
                  <CardTitle className="text-sm font-medium group-hover:text-orange-500 transition duration-300">Серьезные уязвимости</CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-octagon-alert"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-orange-500 transition duration-300'>
                  <div className="text-2xl font-bold"></div>
                  <p className="text-xs text-muted-foreground">
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:border-green-500 group transition duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group-hover:text-green-500 transition duration-300">
                  <CardTitle className="text-sm font-medium">
                    Без уязвимостей
                  </CardTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                </CardHeader>
                <CardContent className='group-hover:text-green-500 transition duration-300'>
                  <div className="text-2xl font-bold"></div>
                  <p className="text-xs text-muted-foreground">

                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-8 w-full">
              </div>
              <div className="col-span-4">
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Сервисы с уязвимостями</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
              </Card>
            </div>
      </div>
  );
}
