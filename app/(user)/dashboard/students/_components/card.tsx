'use client';
import React from 'react';
import Link from 'next/link';
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";
import { OrbitingCirclesDemo } from "./orbit";
import { OrbitingCirclesProps } from "@/components/ui/orbiting";

export default function Cards() {
  return (
    <div className="w-full gap-2 grid grid-cols-12 grid-rows-2 bg-transparent mt-8">
    <Card className="col-span-12 sm:col-span-4 h-[300px] bg-transparent cursor-pointer border">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Загружайте свои файлы и файлы Google Drive</p>
        <h4 className="text-white font-medium text-large">База знаний</h4>
      </CardHeader>
        {/* Orbiting Circles */}
        <div className="relative h-screen bg-red-500">
          <OrbitingCirclesDemo />
        </div>
      <CardFooter className="absolute bg-black/40 bottom-0 z-10">
        <Link href="/dashboard/knowledge">
          <Button radius="full" size="sm">
            Get App
          </Button>
        </Link>
      </CardFooter>
    </Card>
    <Card className="col-span-12 sm:col-span-4 h-[300px] bg-transparent cursor-pointer">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Отправляйте письма без усилий</p>
        <h4 className="text-white font-medium text-large">AI Email ассистент</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        src="/images/5.svg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10">
        <Link href="/dashboard/email">
          <Button radius="full" size="sm">
            Get App
          </Button>
        </Link>
      </CardFooter>
    </Card>
    <Card className="col-span-12 sm:col-span-4 h-[300px] bg-transparent cursor-pointer">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Доверяйте свои вопросы нашему агенту</p>
        <h4 className="text-white font-medium text-large">AI Interview ассистент</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        src="/images/1.svg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10">
        <Button radius="full" size="sm">Get App</Button>
      </CardFooter>
    </Card>
    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5 bg-transparent cursor-pointer">
      <CardHeader className="absolute z-10 top-1 flex-col items-start ">
        <p className="text-tiny text-white/60 uppercase font-bold">Найдите лучших талантов для своего бизнеса</p>
        <h4 className="text-white font-medium text-2xl">AI Selector</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 w-full h-full -translate-y-6 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        src="/images/6.svg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10">
        <Link href="/dashboard/chat">
          <Button radius="full" size="sm">
            Get App
          </Button>
        </Link>
      </CardFooter>
    </Card>
    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7 bg-transparent cursor-pointer">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">ИИ агенты наймут персонал за Вас!</p>
        <h4 className="text-white/90 font-medium text-xl">Leaderboard</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        src="/images/2.svg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10">
        <Link href="/dashboard/leaderboard">
          <Button radius="full" size="sm">
            Get App
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </div>
  );
}