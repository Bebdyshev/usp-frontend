'use client'; 
import { useRouter } from 'next/router';

export default function Header() {
  const handleRedirect = () => {
    window.location.href = '/signin';
  };

  return (
    <header className="bg-white">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1 lg:justify-start">
          <img
            alt=""
            src="https://akb.nis.edu.kz/img/ornament.png"
            className="h-8 w-auto mr-4"
          />
          <span className="text-2xl font-semibold tracking-tight text-balance text-gray-900 sm:text-xl">
            Единый профиль учащегося
          </span>
        </div>
        <div className="flex lg:flex-1 lg:justify-end">
          <a
            href="#"
            className="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-xl"
            onClick={handleRedirect} // Добавляем обработчик события
          >
            Личный кабинет <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
