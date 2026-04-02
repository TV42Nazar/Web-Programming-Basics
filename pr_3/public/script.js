// Чекаємо повного завантаження DOM-дерева (HTML-документа) перед виконанням скрипта,
// щоб бути впевненими, що всі елементи сторінки вже існують.
document.addEventListener("DOMContentLoaded", () => {
    
    // Отримуємо посилання на форму та тіло таблиці за їх селекторами
    const form = document.getElementById('dguForm');
    const tableBody = document.querySelector('#dguTable tbody');

    // Асинхронна функція для завантаження списку ДГУ (дизель-генераторних установок) з сервера
    const loadDGU = async () => {
        try {
            // Виконуємо GET-запит до API для отримання даних
            const response = await fetch('/api/dgu');
            // Перетворюємо відповідь сервера з формату JSON у JavaScript-об'єкт/масив
            const data = await response.json();
            // Викликаємо функцію для відмальовування таблиці з отриманими даними
            renderTable(data);
        } catch (error) {
            // Виводимо помилку в консоль, якщо щось пішло не так (наприклад, немає зв'язку з сервером)
            console.error('Помилка завантаження даних:', error);
        }
    };

    // Функція для відображення масиву даних у HTML-таблиці
    const renderTable = (dguList) => {
        // Очищаємо поточний вміст тіла таблиці перед додаванням нових даних
        tableBody.innerHTML = '';
        
        // Проходимося по кожному елементу масиву даних
        dguList.forEach(dgu => {
            // Створюємо новий HTML-елемент рядка таблиці (<tr>)
            const row = document.createElement('tr');
            
            // Заповнюємо рядок комірками (<td>) з відповідними значеннями об'єкта
            row.innerHTML = `
                <td>${dgu.objectName}</td>
                <td>${dgu.type}</td>
                <td>${dgu.power} кВт</td>
                <td>${dgu.fuel}</td>
                <td>${dgu.consumption} л/год</td>
                <td>${dgu.maintenance}</td>
            `;
            
            // Додаємо сформований рядок у кінець тіла таблиці
            tableBody.appendChild(row);
        });
    };

    // Додаємо обробник події "submit" (відправка) для форми
    form.addEventListener('submit', async (e) => {
        // Запобігаємо стандартній поведінці браузера (перезавантаженню сторінки при відправці форми)
        e.preventDefault();

        // Створюємо об'єкт FormData, який автоматично збирає всі значення з полів форми
        const formData = new FormData(form);
        // Перетворюємо FormData у звичайний JavaScript-об'єкт (ключ: значення)
        const dguData = Object.fromEntries(formData.entries());

        try {
            // Відправляємо POST-запит на сервер для збереження нових даних
            const response = await fetch('/api/dgu', {
                method: 'POST', // Вказуємо метод запиту
                headers: {
                    // Повідомляємо серверу, що відправляємо дані у форматі JSON
                    'Content-Type': 'application/json'
                },
                // Перетворюємо наш JS-об'єкт у JSON-рядок для передачі в тілі запиту
                body: JSON.stringify(dguData)
            });

            // Перевіряємо, чи сервер відповів статусом успіху (наприклад, 200 або 201)
            if (response.ok) {
                alert('Дані успішно збережено!');
                // Очищаємо поля форми після успішного збереження
                form.reset();
                // Оновлюємо таблицю, завантаживши актуальні дані з сервера
                loadDGU();
            } else {
                // Якщо сервер повернув помилку (наприклад, 400 Bad Request), читаємо її деталі
                const errorData = await response.json();
                alert(`Помилка: ${errorData.error}`);
            }
        } catch (error) {
            // Обробляємо мережеві помилки або ситуації, коли сервер взагалі не відповідає
            console.error('Помилка відправки:', error);
            alert('Сталася помилка при відправці даних на сервер.');
        }
    });

    // Викликаємо функцію завантаження даних одразу при відкритті сторінки, 
    // щоб таблиця заповнилася наявними даними
    loadDGU();
});