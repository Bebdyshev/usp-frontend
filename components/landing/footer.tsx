export default function Footer() {
  return (
    <footer className="footer footer-center bg-white text-white p-4">
      <aside>
        <p className="text-center text-lg/8 font-semibold text-gray-900">
          Все права защищены © {new Date().getFullYear()} - Единый профиль учащегося
        </p>
      </aside>
    </footer>
  );
};