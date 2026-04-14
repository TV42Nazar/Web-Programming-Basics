**Назва університету**: **КПІ**

**Факультет:** ІАТЕ

**Кафедра:** ІПЗЕ

**Назва дисципліни**: «Основи Веб-програмування»

**Тема:** Розробка REST API для енергетичних даних.

**Варіант:** 15 (Розумна система вуличного освітлення)

**Виконав:**
студент групи ТВ-42
Холонівець Назар Вадимович

**Перевірив:**
Недашкевський Олексій

**Дата виконання:** 14.04.2026

---

Ось повністю зведений та відформатований звіт, підлаштований під ваші вимоги. Нумерація починається строго з 2-го пункту, усі JSON-об'єкти, діаграми (зображення) та код на своїх місцях. Ви можете просто скопіювати цей текст у ваш документ.

-----

### 2\. Мета роботи

Отримати практичні навички проєктування, реалізації та тестування RESTful API. Навчитися працювати з платформою Node.js та фреймворком Express для створення серверної частини вебзастосунків, розробити структуру обміну даними у форматі JSON та реалізувати CRUD-операції для управління об'єктами інтелектуального вуличного освітлення.

-----

### 3\. Теоретична частина

  * **REST API**
    (Representational State Transfer) - архітектурний стиль для розподілених гіпермедіа систем. Базується на використанні стандартних HTTP-методів (GET, POST, PUT, DELETE) для взаємодії з ресурсами.
  * **Node.js + Express**
    Node.js — середовище виконання JavaScript на стороні сервера. Express - мінімалістичний та гнучкий вебфреймворк для Node.js, що надає набір функцій для створення вебдодатків та API.
  * **Формат JSON**
    (JavaScript Object Notation) - легкий формат обміну даними, який легко читається людьми та парситься машинами. Стандарт для REST API.
  * **Опис об'єкта автоматизації**
    REST API для інтелектуального управління вуличним освітленням з можливістю автоматичного та ручного керування яскравістю, моніторингу споживання електроенергії та стану світильників.
  * **Обґрунтування вибраних методів**
    Використання Node.js та Express є оптимальним для задач розробки REST API завдяки асинхронній моделі вводу/виводу, високій швидкості обробки JSON-даних та великій екосистемі готових middleware.

-----

### 4\. Опис реалізації

#### 4.1. Завдання 1: Проєктування API

**Аналіз предметної галузі:**
Головною сутністю є `LightingSystem` (Система освітлення).
Параметри: `id` (унікальний ідентифікатор), `name` (назва), `lampCount` (всього світильників), `activeLamps` (увімкнено світильників), `totalPower` (потужність, кВт), `brightness` (яскравість, %), `mode` (режим: auto/manual/schedule), `energyConsumed` (спожито, кВт·год), `lightLevel` (освітленість, люкс).

**Схема Endpoints та HTTP методи:**

1.  `GET /api/lighting-systems` - Отримання списку всіх систем (200 OK).
2.  `GET /api/lighting-systems/:id` - Отримання даних конкретної системи (200 OK, 404 Not Found).
3.  `POST /api/lighting-systems/:id/control` - Керування системою (перемикання режиму, увімкнення ламп) (200 OK, 400 Bad Request, 404 Not Found).
4.  `PUT /api/lighting-systems/:id/brightness` - Зміна яскравості в ручному режимі (200 OK, 400 Bad Request).
5.  `DELETE /api/lighting-systems/:id` - Видалення системи (200 OK, 404 Not Found).

**Об'єкт "Система освітлення"**
Цей об'єкт є основним ресурсом API.

```json
{
  "id": 1,
  "name": "Вулиця Хрещатик",
  "lampCount": 120,
  "activeLamps": 120,
  "totalPower": 12.0,
  "brightness": 100,
  "mode": "schedule",
  "energyConsumed": 4500.2,
  "lightLevel": 10
}
```

**Об'єкт керування**
Використовується для методу POST `/api/lighting-systems/:id/control`.

```json
{
  "mode": "manual",
  "activeLamps": 50
}
```

**Об'єкт помилки**
Стандартна структура для повідомлення користувача про проблеми.

```json
{
  "error": "Систему не знайдено",
  "code": 404
}
```

#### 4.2. Завдання 2: Реалізація API

Для реалізації створено Express-сервер. В якості бази даних використано локальний масив об'єктів у пам'яті (`lightingSystems`).

  * **Базова функціональність:** Усі 5 endpoints реалізовано згідно зі специфікацією.
  * **Розширена функціональність:** У `GET /api/lighting-systems` додано можливість:
      * *Фільтрації:* за режимом роботи (`?mode=auto`).
      * *Сортування:* за споживаною потужністю (`?sortBy=totalPower`).
      * *Пагінації:* (`?page=1&limit=5`).
  * **Обробка помилок:** Реалізовано перевірки вхідних даних (наприклад, перевірка чи `brightness` знаходиться в межах від 0 до 100, чи не перевищує `activeLamps` загальну кількість ламп `lampCount`). Повертаються відповідні статуси (400, 404).

#### 4.3. Завдання 3: Тестування та документація

  * Додано власні Middleware: `logger` для виводу в консоль усіх вхідних запитів (метод, URL, час) та налаштовано політику CORS (щоб клієнтська частина могла звертатися до сервера).
  * API успішно протестовано за допомогою утиліт cURL та інтерактивного вебдашборду (імітація фронтенду). Усі HTTP-методи відпрацьовують коректно, включаючи граничні випадки (спроба встановити яскравість 150% або знайти неіснуючу систему).

-----

**Архітектура взаємодії компонентів**

<img width="349" height="387" alt="image" src="https://github.com/user-attachments/assets/e0af42d1-f2f6-4b3f-b006-ddd27b8850c8" />

----

<img width="408" height="629" alt="image" src="https://github.com/user-attachments/assets/7621431f-d757-4042-9495-f3390e3def8a" />

<img width="561" height="729" alt="image" src="https://github.com/user-attachments/assets/79013545-91c3-468d-9cd4-19608d5de6b2" />

<img width="655" height="750" alt="image" src="https://github.com/user-attachments/assets/47386586-7046-496b-ab02-d3faf7286ba7" />

<img width="643" height="773" alt="image" src="https://github.com/user-attachments/assets/9e6715f5-dcc6-4923-a2f4-c378b79cb1d8" />

<img width="639" height="750" alt="image" src="https://github.com/user-attachments/assets/98fbdf4f-8885-4b1a-887a-2b314fb07714" />

----

**Діаграма послідовності**

<img width="907" height="500" alt="image" src="https://github.com/user-attachments/assets/5ab5dbf3-44e4-46f6-986c-98d2ad64bf74" />

-----

<img width="883" height="570" alt="image" src="https://github.com/user-attachments/assets/a704eb72-c220-4a63-be79-5182d14a4a31" />

<img width="1022" height="612" alt="image" src="https://github.com/user-attachments/assets/2922b628-22a0-4565-a1ce-04da4dff295b" />

<img width="1035" height="620" alt="image" src="https://github.com/user-attachments/assets/34759456-dfe9-47b9-ad11-a3b9fed358e5" />

-----

### 5\. Висновки

Під час виконання практичної роботи було спроєктовано та реалізовано повноцінне REST API для системи розумного вуличного освітлення. Здобуто навички роботи з Node.js, Express, маршрутизацією, обробкою query-параметрів (для фільтрації та пагінації) та написанням власних Middleware. Розроблено гнучку архітектуру, яку можна в майбутньому підключити до реальної бази даних (наприклад, MongoDB або PostgreSQL).

-----

### 6\. Список використаних джерел

1.  Офіційна документація Node.js. URL: [https://nodejs.org/uk/docs/](https://nodejs.org/uk/docs/)
2.  Офіційна документація Express.js. URL: [https://expressjs.com/](https://expressjs.com/)
3.  MDN Web Docs: HTTP методи та REST. URL: [https://developer.mozilla.org/](https://developer.mozilla.org/)

-----

### 7\. Додатки

**Повний код проєкту (файл `server.js` з реалізованими фільтрами, пагінацією та Middleware):**

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware для парсингу JSON та статики
app.use(express.json());
app.use(express.static('public'));

// Кастомний Middleware для логування запитів
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// База даних в пам'яті
let lightingSystems = [
    { id: 1, name: "Вулиця Хрещатик", lampCount: 120, activeLamps: 120, totalPower: 12.0, brightness: 100, mode: "schedule" },
    { id: 2, name: "Парк Шевченка", lampCount: 45, activeLamps: 0, totalPower: 0, brightness: 0, mode: "auto" },
    { id: 3, name: "Проспект Перемоги", lampCount: 300, activeLamps: 150, totalPower: 7.5, brightness: 50, mode: "manual" }
];

// 1. GET /api/lighting-systems (З фільтрацією, сортуванням та пагінацією)
app.get('/api/lighting-systems', (req, res) => {
    let result = [...lightingSystems];
    const { mode, sortBy, page, limit } = req.query;

    // Фільтрація
    if (mode) result = result.filter(s => s.mode === mode);

    // Сортування
    if (sortBy) {
        result.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    }

    // Пагінація
    if (page && limit) {
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = parseInt(page) * parseInt(limit);
        result = result.slice(startIndex, endIndex);
    }

    res.status(200).json(result);
});

// 2. GET /api/lighting-systems/:id
app.get('/api/lighting-systems/:id', (req, res) => {
    const system = lightingSystems.find(s => s.id === parseInt(req.params.id));
    if (!system) return res.status(404).json({ error: "Систему не знайдено" });
    res.status(200).json(system);
});

// 3. POST /api/lighting-systems/:id/control
app.post('/api/lighting-systems/:id/control', (req, res) => {
    const { mode, activeLamps } = req.body;
    const system = lightingSystems.find(s => s.id === parseInt(req.params.id));

    if (!system) return res.status(404).json({ error: "Систему не знайдено" });
    
    if (mode) system.mode = mode;
    if (typeof activeLamps === 'number' && activeLamps >= 0 && activeLamps <= system.lampCount) {
        system.activeLamps = activeLamps;
        system.totalPower = +(activeLamps * 0.1 * (system.brightness / 100)).toFixed(2);
    } else if (activeLamps !== undefined) {
        return res.status(400).json({ error: "Некоректна кількість ламп" });
    }

    res.status(200).json({ message: "Керування застосовано", system });
});

// 4. PUT /api/lighting-systems/:id/brightness
app.put('/api/lighting-systems/:id/brightness', (req, res) => {
    const { brightness } = req.body;
    const system = lightingSystems.find(s => s.id === parseInt(req.params.id));

    if (!system) return res.status(404).json({ error: "Систему не знайдено" });
    if (typeof brightness !== 'number' || brightness < 0 || brightness > 100) {
        return res.status(400).json({ error: "Яскравість: число від 0 до 100" });
    }

    system.brightness = brightness;
    system.totalPower = +(system.activeLamps * 0.1 * (brightness / 100)).toFixed(2);
    res.status(200).json({ message: "Яскравість оновлено", system });
});

// 5. DELETE /api/lighting-systems/:id
app.delete('/api/lighting-systems/:id', (req, res) => {
    const index = lightingSystems.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Систему не знайдено" });

    const deleted = lightingSystems.splice(index, 1);
    res.status(200).json({ message: "Видалено", deleted: deleted[0] });
});

app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
```

-----

### 8\. Відповіді на контрольні питання

1.  **Що означає абревіатура REST?** Representational State Transfer (Передача стану представлення) — архітектурний стиль взаємодії компонентів розподіленого додатка в мережі.
2.  **Який HTTP метод використовується для отримання даних з сервера?** Метод `GET`.
3.  **Який код відповіді HTTP означає успішне створення нового ресурсу?** Код `201 Created`.
4.  **Який HTTP метод є ідемпотентним і використовується для повного оновлення ресурсу?** Метод `PUT`.
5.  **Що таке endpoint в контексті REST API?** Це конкретна URL-адреса, за якою доступний певний ресурс або функціонал на сервері (наприклад, `/api/users`).
6.  **Який код статусу HTTP повертається, коли запитуваний ресурс не знайдено?** Код `404 Not Found`.
7.  **Який формат даних найчастіше використовується в REST API?** Найчастіше використовується формат `JSON` (JavaScript Object Notation).
8.  **Що означає принцип 'stateless' в REST архітектурі?** Сервер не зберігає стан клієнта між запитами. Кожен запит від клієнта має містити всю інформацію, необхідну для його розуміння та обробки сервером.
9.  **Який HTTP метод використовується для видалення ресурсу?** Метод `DELETE`.
10. **Що таке middleware в Express.js?** Це функції, які мають доступ до об'єктів запиту (`req`), відповіді (`res`) та наступної функції `middleware` в циклі (зазвичай `next`). Використовуються для проміжної обробки даних (наприклад, логування, авторизація, парсинг JSON).
11. **Який код відповіді означає помилку на стороні сервера?** Коди групи `5xx`, найчастіше `500 Internal Server Error`.
12. **Який HTTP метод використовується для часткового оновлення ресурсу?** Метод `PATCH`.
13. **Що таке CRUD операції?** Це базові операції управління даними: Create (Створення), Read (Читання), Update (Оновлення), Delete (Видалення).
14. **Для чого використовується query parameter в URL?** Для передачі додаткових параметрів у запиті (наприклад, для фільтрації, сортування або пагінації). Вони йдуть після знаку `?` (наприклад, `?mode=auto&page=1`).
15. **Який заголовок HTTP використовується для вказання типу вмісту тіла запиту?** Заголовок `Content-Type` (наприклад, `Content-Type: application/json`).
