export default function CTA() {
  return (
    <div className="bg-white pt-24">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-medium tracking-tight text-gray-900 sm:text-6xl">
              Единый мониторинг успеваемости учащихся
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
              Современная платформа для анализа успеваемости, выявления проблемных зон и поддержки индивидуального прогресса каждого учащегося.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/signin"
                className="rounded-full bg-indigo-500 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all duration-300"
              >
                Начать работу
              </a>
              <a 
                href="#features" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
              >
                Узнать больше <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}