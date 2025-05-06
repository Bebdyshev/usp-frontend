export default function Clouds() {
  return (
    <div className="bg-white py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-8 lg:px-12">
        <p className="mx-auto mt-2 text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl whitespace-nowrap">
          Нас поддерживают
        </p>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 items-center gap-x-12 gap-y-12 sm:max-w-3xl sm:grid-cols-3 sm:gap-x-14 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <img
            alt="Nazarbayev Intellectual Schools"
            src="/images/landing/nis.svg"
            width={200}
            height={60}
            className="col-span-1 max-h-16 w-full object-contain"
          />
          <img
            alt="AstanaHub"
            src="/images/landing/asthub.avif"
            width={200}
            height={60}
            className="col-span-1 max-h-16 w-full object-contain"
          />
          <img
            alt="Ministry of Education and Science of the Republic of Kazakhstan"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6MpicMaDYfG-JDjGOn7Kj1mBpc4_I7SHyQg&s"
            width={200}
            height={60}
            className="col-span-1 max-h-16 w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}