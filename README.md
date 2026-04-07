# useEasyFetch

Лёгкая утилита для удобной работы с Fetch API в TypeScript/JavaScript проектах.

**Коротко:** `useEasyFetch` упрощает выполнение HTTP-запросов, автоматически выбирает метод (`GET`/`POST`), сериализует тело в `FormData` или JSON, обрабатывает заголовки и безопасно парсит ответ (JSON или текст). Возвращает распарсенный ответ или `false` при ошибке.

**Подходит для:** небольших проектов, утилит, серверных и клиентских скриптов, где нужен минимальный обёртка над `fetch` без зависимостей.

**Пакет на npm (описание):**

useEasyFetch — компактная TypeScript-функция для выполнения HTTP-запросов: автоматически выбирает метод, сериализует тело (FormData или JSON), ставит Content-Type, проверяет HTTP-статус и возвращает JSON или текст. Идеально, когда нужен быстрый, предсказуемый fetch без лишней конфигурации.

## Установка

```bash
npm install use-easy-fetch
# or
yarn add use-easy-fetch
```

## Быстрый пример

```ts
import useEasyFetch from 'use-easy-fetch';

// GET
const data = await useEasyFetch('https://api.example.com/data');

// POST JSON
const result = await useEasyFetch('https://api.example.com/save', { name: 'Ivan' }, 'JSON');

// POST FormData
const formResult = await useEasyFetch('https://api.example.com/upload', { file: myFile }, 'FormData');
```

## API

- `useEasyFetch(url: string, body: any = null, bodyType: 'FormData' | 'JSON' = 'FormData'): Promise<any | false>`

Параметры:
- `url` — строка с адресом запроса.
- `body` — данные для отправки. Если `null`, выполняется `GET`.
- `bodyType` — способ сериализации: `'FormData'` (по умолчанию) или `'JSON'`.

Поведение:
- Если `body` задан — метод `POST`, иначе `GET`.
- Для `'JSON'` тело сериализуется через `JSON.stringify` и добавляется заголовок `Content-Type: application/json`.
- Для `'FormData'` объект рекурсивно упаковывается в `FormData` (файлы, Blobs, примитивы и вложенные объекты преобразуются в JSON-строки).
- При неуспешном HTTP-статусе выбрасывается ошибка и функция возвращает `false`.
- Если `Content-Type` ответа содержит `application/json`, возвращается распарсенный JSON, иначе — текст.