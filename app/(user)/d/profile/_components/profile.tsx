"use client";

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { PaperClipIcon } from "@heroicons/react/20/solid";

function PageProfileContainer({ children }: { children: React.ReactNode }) {
  return <div className="page-profile-container ml-4">{children}</div>;
}

export default function ProfilePage() {
  const downloadDocx = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Создаем документ Word с необходимыми данными
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Заголовок документа
            new Paragraph({
              text: "Профиль студента",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: "Общие сведения, достижения, внешкольная деятельность и наличие дисциплинарных взысканий",
            }),
            new Paragraph({ text: "" }),
            // Данные профиля
            new Paragraph({ text: "Полное имя: Габитов Абдулазиз" }),
            new Paragraph({ text: "Класс: 11Н" }),
            new Paragraph({ text: "Электронная почта: azekowka@akb.nis.edu.kz" }),
            new Paragraph({ text: "" }),
            // Раздел «Достижения»
            new Paragraph({
              text: "Достижения:",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "1 место на олимпиаде химии",
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: "Победитель школьного конкурса по математике",
              bullet: { level: 0 },
            }),
            new Paragraph({ text: "" }),
            // Раздел «Внешкольная деятельность»
            new Paragraph({
              text: "Внешкольная деятельность:",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "Член школьного театра",
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: "Участник волонтерской группы",
              bullet: { level: 0 },
            }),
            new Paragraph({ text: "" }),
            // Раздел с дисциплинарными взысканиями
            new Paragraph({ text: "Наличие дисциплинарных взысканий: Нет" }),
          ],
        },
      ],
    });

    // Генерируем файл в виде Blob
    const blob = await Packer.toBlob(doc);
    // Создаем URL для Blob и инициируем скачивание
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Профиль_Ученика.docx";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageProfileContainer>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base/7 font-semibold text-gray-900">Профиль студента</h3>
          <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
            Общие сведения, достижения, внешкольная деятельность и наличие дисциплинарных взысканий
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* Полное имя */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Полное имя</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                Габитов Абдулазиз
              </dd>
            </div>
            {/* Класс */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Класс</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">11Н</dd>
            </div>
            {/* Электронная почта */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Электронная почта</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                azekowka@akb.nis.edu.kz
              </dd>
            </div>
            {/* Достижения */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Достижения</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <ul>
                  <li>1 место на олимпиаде химии</li>
                  <li>Победитель школьного конкурса по математике</li>
                </ul>
              </dd>
            </div>
            {/* Внешкольная деятельность */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Внешкольная деятельность</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                <ul>
                  <li>Член школьного театра</li>
                  <li>Участник волонтерской группы</li>
                </ul>
              </dd>
            </div>
            {/* Дисциплинарные взыскания */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">
                Наличие дисциплинарных взысканий
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Нет</dd>
            </div>
            {/* Раздел "Вложения" (отображается на странице, но не включается в документ Word) */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-900">Вложения</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">Профиль_Ученика.pdf</span>
                        <span className="shrink-0 text-gray-400">2.4mb</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      {/* При клике вызывается функция скачивания Word-файла */}
                      <a
                        href="#"
                        onClick={downloadDocx}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Скачать
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </PageProfileContainer>
  );
}
