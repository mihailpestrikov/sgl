# Студенческая Гребная Лига

Проект веб-сайта для Студенческой Гребной Лиги, разработанный с использованием NestJS и Handlebars.

## Описание проекта

Данный проект представляет собой веб-платформу для Студенческой Гребной Лиги, где можно найти информацию об участниках, соревнованиях, рейтингах и медиа-материалах. Платформа также предоставляет функционал для создания финишных протоколов соревнований.

## Технологии

- **Бэкенд**: NestJS, Express
- **Фронтенд**: Handlebars (HBS), Vanilla JavaScript, jQuery
- **Стили**: CSS
- **Анимации**: Anime.js, Slick Carousel

## Дизайн и верстка

- Адаптивный дизайн с поддержкой мобильных устройств
- Анимации с использованием Anime.js
- Слайдер изображений на базе Slick Carousel

## Структура проекта

```
├── public/               # Статические файлы
│   ├── css/              # CSS стили
│   ├── html/             # HTML файлы для статической версии
│   ├── js/               # JavaScript файлы
│
├── src/                  # Исходный код NestJS
│   ├── app.controller.ts # Контроллер приложения
│   ├── app.module.ts     # Основной модуль приложения
│   ├── main.ts           # Точка входа приложения
│
├── views/                # Шаблоны Handlebars
│   ├── partials/         # Повторно используемые компоненты
│
└── package.json          # Зависимости и скрипты
```

## Функциональность

- **Главная страница**: Отображение рейтингов и новостей
- **Участники**: Информация о спортсменах и их достижениях
- **Рейтинг**: Рейтинговая система для команд и спортсменов
- **Медиа**: Галерея и карусель с фотографиями
- **Финишный протокол**: Инструмент для создания и сохранения протоколов соревнований

## Установка

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/mihailpestrikov/sgl.git
   cd студенческая-гребная-лига
   ```

2. Запустить Docker контейнеры с базой данных:
   ```bash
   docker-compose up -d
   ```

3. Создать файл `.env` в корне проекта со следующим содержимым:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/srl_database"
   ```

4. Установить зависимости:
   ```bash
   npm install
   ```

5. Сгенерировать Prisma Client и применить миграции:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. Запустить приложение:
   ```bash
   # Режим разработки
   npm run start:dev

   # Продакшн режим
   npm run start:prod
   ```

7. Откройте браузер и перейдите по адресу: `http://localhost:3001`

8. Для заполнения базы данных тестовыми данными перейдите по адресу: `http://localhost:3001/admin/seed`

## API Эндпойнты

### Публичные страницы (HTML)

#### Главные страницы
- `GET /` - Главная страница с рейтингами и новостями
- `GET /login` - Страница входа в систему
- `GET /form` - Страница создания финишного протокола
- `GET /media` - Галерея фотографий и медиа-материалов
- `GET /rating` - Страница рейтингов (личный и командный)
- `GET /rating/changes` - Server-Sent Events для отслеживания изменений рейтинга в реальном времени
- `GET /participants?search=&page=&limit=` - Список участников с поиском и пагинацией

#### Страницы сущностей
- `GET /athlete/:id` - Страница спортсмена с детальной информацией
- `GET /university/:id` - Страница университета с информацией о командах и спортсменах

### Админ-панель 

- `GET /admin` - Главная страница админ-панели
- `GET /admin/athletes` - Управление спортсменами
- `GET /admin/universities` - Управление университетами
- `GET /admin/teams` - Управление командами
- `GET /admin/results` - Управление результатами соревнований
- `GET /admin/coaches` - Управление тренерами
- `GET /admin/ratings` - Управление рейтингами
- `GET /admin/simulate-rating-change?type=` - Симуляция изменения рейтинга (типы: `positionUp`, `positionDown`, `newEntry`, `scoreChange`)

### REST API для спортсменов 

**Базовый путь:** `/admin/api/athletes`

- `GET /admin/api/athletes?page=&limit=` - Получить список всех спортсменов с пагинацией
- `GET /admin/api/athletes/search?name=&universityId=&page=&limit=` - Поиск спортсменов по имени и/или университету
- `GET /admin/api/athletes/:id` - Получить спортсмена по ID
- `POST /admin/api/athletes` - Создать нового спортсмена
- `PUT /admin/api/athletes/:id` - Обновить данные спортсмена
- `DELETE /admin/api/athletes/:id` - Удалить спортсмена
- `GET /admin/api/athletes/:id/results` - Получить результаты соревнований спортсмена

### REST API для университетов 

**Базовый путь:** `/admin/api/universities`

- `GET /admin/api/universities?page=&limit=` - Получить список всех университетов с пагинацией
- `GET /admin/api/universities/search?name=&page=&limit=` - Поиск университетов по названию
- `GET /admin/api/universities/:id` - Получить университет по ID
- `POST /admin/api/universities` - Создать новый университет
- `PUT /admin/api/universities/:id` - Обновить данные университета
- `DELETE /admin/api/universities/:id` - Удалить университет
- `GET /admin/api/universities/:id/teams` - Получить команды университета
- `GET /admin/api/universities/:id/coaches` - Получить тренеров университета
- `GET /admin/api/universities/:id/athletes` - Получить спортсменов университета

### Seed эндпойнты

**Базовый путь:** `/admin/seed`

- `GET /admin/seed` - Заполнить базу данных всеми тестовыми данными
- `GET /admin/seed/universities` - Заполнить только университеты
- `GET /admin/seed/teams` - Заполнить только команды
- `GET /admin/seed/coaches` - Заполнить только тренеров
- `GET /admin/seed/athletes` - Заполнить только спортсменов
- `GET /admin/seed/athlete-results` - Заполнить только результаты соревнований
- `GET /admin/seed/university-ratings` - Заполнить только рейтинги университетов
- `GET /admin/seed/personal-ratings` - Заполнить только персональные рейтинги
- `GET /admin/seed/media-items` - Заполнить только медиа-элементы

### GraphQL API

**Endpoint:** `POST /graphql`
**GraphQL Playground:** `http://localhost:3001/graphql`

### Swagger API Documentation

Swagger документация доступна по адресу: `http://localhost:3001/api`

## Интерфейс

![Главная страница](img/photo_1_2025-11-07_18-11-37.jpg)

![Рейтинг](img/photo_2_2025-11-07_18-11-37.jpg)

![Участники](img/photo_3_2025-11-07_18-11-37.jpg)

![Страница спортсмена](img/photo_4_2025-11-07_18-11-37.jpg)

![Страница университета](img/photo_5_2025-11-07_18-11-37.jpg)

![Медиа](img/photo_6_2025-11-07_18-11-37.jpg)

![Финишный протокол](img/photo_7_2025-11-07_18-11-37.jpg)

![Админ-панель](img/photo_8_2025-11-07_18-11-37.jpg)

