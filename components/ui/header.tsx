'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1 lg:justify-start">
          <img
            alt="Logo"
            src="https://akb.nis.edu.kz/img/ornament.png"
            className="h-8 w-auto mr-4"
          />
          <span className="text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-xl">
            Единый профиль учащегося
          </span>
        </div>
        <div className="flex lg:flex-1 lg:justify-end">
          <Link
            href="/signin"
            className="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-xl"
          >
            Личный кабинет <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
} 