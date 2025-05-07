'use client'; 

export default function Header() {
  const handleRedirect = () => {
    window.location.href = '/signin';
  };

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-5 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-xl font-medium text-gray-800">
            Единый профиль учащегося
          </span>
        </div>
        <button
          onClick={handleRedirect}
          className="text-sm font-medium text-gray-800 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
        >
          Личный кабинет <span aria-hidden="true" className="text-gray-400">→</span>
        </button>
      </nav>
    </header>
  );
}
