type FetchOptions = {
  body: BodyInit | null,
  method: 'GET' | 'POST',
  headers: Headers,
}

/**
 * Выполняет HTTP-запрос по указанному URL с использованием Fetch API.
 *
 * - Если передан параметр `body`, метод запроса устанавливается в 'POST', а тело сериализуется
 *   в соответствии с указанным типом `bodyType` ('FormData' или 'JSON').
 * - Если `bodyType` равен 'JSON', тело преобразуется в строку и устанавливается заголовок 'Content-Type: application/json'.
 * - Если `bodyType` равен 'FormData', тело преобразуется в FormData.
 * - Если параметр `body` не передан, используется метод 'GET'.
 *
 * Функция пытается распарсить ответ как JSON, если заголовок 'Content-Type' указывает на JSON,
 * в противном случае возвращает ответ как обычный текст.
 *
 * @param url - URL-адрес, по которому отправляется запрос.
 * @param body - Данные запроса. Если null, выполняется GET-запрос.
 * @param bodyType - Тип тела запроса: 'FormData' или 'JSON'. По умолчанию 'FormData'.
 * @returns Промис, который возвращает распарсенный ответ (JSON или текст).
 * @throws Ошибка, если HTTP-ответ не успешен (статус не в диапазоне 200-299).
 */
export default async function useEasyFetch(url: string, body: any = null, bodyType: "FormData" | "JSON" = 'FormData'): Promise<any> {
  // Не мутируем входные параметры
  const fetchOptions: FetchOptions = {
    body: null,
    method: 'GET',
    headers: new Headers(),
  }

  if (body !== null) {
    fetchOptions.method = 'POST';
    switch (bodyType) {
      case 'JSON':
        fetchOptions.body = JSON.stringify(body);
        fetchOptions.headers.append('Content-Type', 'application/json');
        break;

      case 'FormData':
        fetchOptions.body = formData(body);
        break;
    }
  }

  try {
    const response = await fetch(url, fetchOptions);

    // Проверяем успешность ответа
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    // Пробуем распарсить JSON, иначе возвращаем текст
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('useFetch', {
      error: errorMessage,
      url,
      method: fetchOptions.method,
      body,
    });
    // messages.send(i18n.global.t('errors.fetch'), { severity: 'danger' });
    return false;
  }
}

/**
 * Преобразует объект в FormData.
 * @param data - исходный объект
 * @returns FormData
 */
function formData(data: any): FormData | null {
  if (data === null || data === undefined) return null;

  const fd = new FormData();

  // Примитивы упаковываем в поле 'value'
  if (typeof data !== 'object') {
    fd.append('value', String(data));
    return fd;
  }

  Object.entries(data as Record<string, any>).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (
      value instanceof File ||
      value instanceof Blob ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      fd.append(key, value as any);
    } else {
      fd.append(key, JSON.stringify(value));
    }
  });
  return fd;
}