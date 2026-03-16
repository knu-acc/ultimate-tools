import { Article } from '../articles';

export const productivityArticles: Article[] = [
  // === Таймер Помодоро ===
  {
    slug: 'pomodoro-timer-guide',
    title: 'Техника Помодоро: полное руководство по методу',
    titleEn: 'Pomodoro Technique: Complete Method Guide',
    description: 'Как работает техника Помодоро, почему она эффективна и как правильно использовать таймер для максимальной продуктивности.',
    descriptionEn: 'How the Pomodoro Technique works, why it is effective, and how to use the timer for maximum productivity.',
    toolSlug: 'pomodoro-timer',
    type: 'guide',
    keywords: ['Помодоро', 'тайм-менеджмент', 'продуктивность', 'техника фокусировки'],
    date: '2026-01-20',
    readTime: 7,
    content: `
## Что такое техника Помодоро?

Техника Помодоро — это метод управления временем, разработанный Франческо Чирилло в 1980-х годах. Название происходит от кухонного таймера в форме помидора. Суть метода — чередование периодов концентрированной работы и коротких перерывов.

## Как работает метод

1. Выберите задачу, которую нужно выполнить
2. Установите таймер на 25 минут (один «помодоро»)
3. Работайте, не отвлекаясь, до сигнала
4. Сделайте короткий перерыв 5 минут
5. После 4 помодоро — длинный перерыв 15-30 минут

## Почему 25 минут?

Исследования показывают, что человек способен поддерживать максимальную концентрацию 20-30 минут. После этого внимание рассеивается, и короткий перерыв помогает восстановить фокус.

## Правила техники

- Помодоро неделим: нельзя прервать на середине
- Если вас отвлекли — помодоро считается несостоявшимся
- Мелкие задачи объединяйте в один помодоро
- Крупные задачи разбивайте на несколько помодоро

## Дневной план

| Время | Действие |
|---|---|
| 09:00-09:25 | Помодоро 1 |
| 09:25-09:30 | Перерыв |
| 09:30-09:55 | Помодоро 2 |
| 09:55-10:00 | Перерыв |
| 10:00-10:25 | Помодоро 3 |
| 10:25-10:30 | Перерыв |
| 10:30-10:55 | Помодоро 4 |
| 10:55-11:15 | Длинный перерыв |

Начните прямо сейчас с нашим [Таймером Помодоро](/tools/pomodoro-timer).

Смотрите также: [Список задач](/tools/todo-list), [Заметки](/tools/notes)
    `.trim(),
    contentEn: `
## What Is the Pomodoro Technique?

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the 1980s. The name comes from a tomato-shaped kitchen timer. The core idea is alternating periods of focused work with short breaks.

## How the Method Works

1. Choose a task you need to complete
2. Set the timer for 25 minutes (one "pomodoro")
3. Work without distractions until the timer rings
4. Take a short 5-minute break
5. After 4 pomodoros, take a long 15-30 minute break

## Why 25 Minutes?

Research shows that a person can maintain peak concentration for 20-30 minutes. After that, attention fades, and a short break helps restore focus.

## Rules of the Technique

- A pomodoro is indivisible: you cannot stop in the middle
- If you get interrupted, the pomodoro is considered void
- Combine small tasks into one pomodoro
- Break large tasks into several pomodoros

## Daily Plan

| Time | Action |
|---|---|
| 09:00-09:25 | Pomodoro 1 |
| 09:25-09:30 | Break |
| 09:30-09:55 | Pomodoro 2 |
| 09:55-10:00 | Break |
| 10:00-10:25 | Pomodoro 3 |
| 10:25-10:30 | Break |
| 10:30-10:55 | Pomodoro 4 |
| 10:55-11:15 | Long break |

Start right now with our [Pomodoro Timer](/tools/pomodoro-timer).

See also: [To-Do List](/tools/todo-list), [Notes](/tools/notes)
    `.trim(),
  },
  {
    slug: 'pomodoro-timer-tips',
    title: '7 советов для эффективного использования Помодоро',
    titleEn: '7 Tips for Effective Pomodoro Use',
    description: 'Как получить максимум от техники Помодоро: настройка интервалов, борьба с отвлечениями и отслеживание прогресса.',
    descriptionEn: 'How to get the most out of the Pomodoro Technique: adjusting intervals, fighting distractions, and tracking progress.',
    toolSlug: 'pomodoro-timer',
    type: 'tips',
    keywords: ['советы Помодоро', 'фокусировка', 'отвлечения', 'продуктивность'],
    date: '2026-02-05',
    readTime: 5,
    content: `
## 7 советов для эффективного Помодоро

### 1. Подготовьте рабочее место заранее
Уберите со стола всё лишнее, закройте ненужные вкладки и переведите телефон в режим «Не беспокоить» до запуска таймера.

### 2. Адаптируйте длительность под себя
25 минут — не догма. Некоторым подходят интервалы по 50 минут для глубокой работы или по 15 минут для рутинных задач.

### 3. Записывайте отвлечения
Если во время помодоро пришла мысль — запишите её и вернитесь к задаче. Разберётесь с ней на перерыве.

### 4. Используйте перерывы правильно
На коротком перерыве: встаньте, потянитесь, выпейте воды. Не проверяйте соцсети — это не даёт мозгу отдохнуть.

### 5. Считайте помодоро за день
Отслеживайте количество выполненных помодоро. Средний показатель продуктивного дня — 8-12 помодоро.

### 6. Группируйте похожие задачи
Однотипные мелкие задачи (ответы на письма, проверка отчётов) объединяйте в один помодоро.

### 7. Не пропускайте длинные перерывы
После 4 помодоро обязателен перерыв 15-30 минут. Без него качество работы резко падает к обеду.

Попробуйте настроить интервалы в нашем [Таймере Помодоро](/tools/pomodoro-timer).

Смотрите также: [Список задач](/tools/todo-list), [Время чтения](/tools/reading-time)
    `.trim(),
    contentEn: `
## 7 Tips for Effective Pomodoro Use

### 1. Prepare Your Workspace in Advance
Clear your desk of clutter, close unnecessary tabs, and put your phone on "Do Not Disturb" before starting the timer.

### 2. Adapt the Duration to Your Needs
25 minutes is not a rigid rule. Some people prefer 50-minute intervals for deep work or 15-minute intervals for routine tasks.

### 3. Write Down Distractions
If a thought comes up during a pomodoro, jot it down and return to your task. Deal with it during the break.

### 4. Use Breaks Wisely
During a short break: stand up, stretch, drink water. Do not check social media — it does not let your brain rest.

### 5. Count Your Daily Pomodoros
Track the number of completed pomodoros. An average productive day is 8-12 pomodoros.

### 6. Group Similar Tasks
Batch small similar tasks (replying to emails, reviewing reports) into a single pomodoro.

### 7. Do Not Skip Long Breaks
A 15-30 minute break is mandatory after 4 pomodoros. Without it, work quality drops sharply by lunchtime.

Try adjusting intervals in our [Pomodoro Timer](/tools/pomodoro-timer).

See also: [To-Do List](/tools/todo-list), [Reading Time](/tools/reading-time)
    `.trim(),
  },
  {
    slug: 'pomodoro-timer-use-cases',
    title: 'Таймер Помодоро: кому и когда он нужен',
    titleEn: 'Pomodoro Timer: Who Needs It and When',
    description: 'Реальные сценарии использования техники Помодоро для студентов, программистов, писателей и фрилансеров.',
    descriptionEn: 'Real-world scenarios for using the Pomodoro Technique for students, programmers, writers, and freelancers.',
    toolSlug: 'pomodoro-timer',
    type: 'use-cases',
    keywords: ['сценарии Помодоро', 'студенты', 'программисты', 'фриланс', 'учёба'],
    date: '2026-02-22',
    readTime: 5,
    content: `
## Кому подойдёт техника Помодоро

### 1. Студенты и школьники
Подготовка к экзаменам с помощью Помодоро позволяет учиться эффективнее. 4 помодоро по 25 минут с перерывами дают больше, чем 3 часа непрерывной зубрёжки.

### 2. Программисты и разработчики
Написание кода требует глубокой концентрации. Помодоро защищает от отвлечений и помогает структурировать рабочий день.

### 3. Писатели и копирайтеры
Техника помогает преодолеть страх чистого листа. Обязательство писать всего 25 минут снижает давление.

### 4. Фрилансеры
Без офисного контроля легко прокрастинировать. Таймер создаёт внешнюю структуру и дисциплину.

### 5. Менеджеры и руководители
Помодоро помогает выделить время для стратегических задач между совещаниями и срочными вопросами.

## Примеры распределения помодоро

| Профессия | Задача | Помодоро |
|---|---|---|
| Студент | Подготовка к экзамену | 8-10 |
| Программист | Разработка фичи | 6-8 |
| Копирайтер | Написание статьи | 3-4 |
| Менеджер | Стратегическое планирование | 2-3 |

Запустите свой первый помодоро в [Таймере Помодоро](/tools/pomodoro-timer).

Смотрите также: [Заметки](/tools/notes), [Скорость печати](/tools/typing-speed)
    `.trim(),
    contentEn: `
## Who Benefits from the Pomodoro Technique

### 1. Students
Exam preparation using Pomodoro allows more effective studying. Four 25-minute pomodoros with breaks yield better results than 3 hours of continuous cramming.

### 2. Programmers and Developers
Writing code requires deep concentration. Pomodoro protects against distractions and helps structure the workday.

### 3. Writers and Copywriters
The technique helps overcome writer's block. Committing to writing for just 25 minutes reduces pressure.

### 4. Freelancers
Without office oversight, it is easy to procrastinate. The timer creates external structure and discipline.

### 5. Managers and Executives
Pomodoro helps carve out time for strategic tasks between meetings and urgent matters.

## Pomodoro Distribution Examples

| Profession | Task | Pomodoros |
|---|---|---|
| Student | Exam preparation | 8-10 |
| Programmer | Feature development | 6-8 |
| Copywriter | Writing an article | 3-4 |
| Manager | Strategic planning | 2-3 |

Start your first pomodoro with the [Pomodoro Timer](/tools/pomodoro-timer).

See also: [Notes](/tools/notes), [Typing Speed](/tools/typing-speed)
    `.trim(),
  },

  // === Список задач ===
  {
    slug: 'todo-list-guide',
    title: 'Список задач: руководство по организации дел',
    titleEn: 'To-Do List: Guide to Organizing Your Tasks',
    description: 'Как правильно вести список задач, расставлять приоритеты и добиваться выполнения всех дел. Полное руководство.',
    descriptionEn: 'How to properly maintain a to-do list, set priorities, and get everything done. A complete guide.',
    toolSlug: 'todo-list',
    type: 'guide',
    keywords: ['список задач', 'планирование', 'приоритеты', 'организация дел'],
    date: '2026-01-22',
    readTime: 7,
    content: `
## Зачем вести список задач?

Человеческий мозг плохо хранит незавершённые задачи — это явление называется «эффект Зейгарник». Незаконченные дела создают фоновый стресс и отвлекают. Выгрузив задачи в список, вы освобождаете ментальные ресурсы.

## Принципы эффективного списка

### Формулируйте задачи как действия
Неправильно: «Проект». Правильно: «Написать план проекта до пятницы».

### Ограничивайте дневной список
Не более 5-7 задач на день. Длинные списки демотивируют и создают ощущение невыполнимости.

### Используйте матрицу Эйзенхауэра

| | Срочно | Не срочно |
|---|---|---|
| **Важно** | Делайте сразу | Планируйте |
| **Не важно** | Делегируйте | Откажитесь |

## Как работать со списком

1. Утром определите 3 главные задачи дня (MIT — Most Important Tasks)
2. Начните с самой сложной задачи («съешьте лягушку»)
3. Отмечайте выполненные задачи — это даёт дофамин
4. Вечером перенесите невыполненные задачи на завтра
5. Еженедельно пересматривайте и очищайте список

## Категории задач

Разделяйте задачи по сферам: работа, личное, учёба, здоровье. Это помогает балансировать жизнь.

Начните планировать с нашим [Списком задач](/tools/todo-list).

Смотрите также: [Таймер Помодоро](/tools/pomodoro-timer), [Заметки](/tools/notes)
    `.trim(),
    contentEn: `
## Why Keep a To-Do List?

The human brain is poor at storing unfinished tasks — this is known as the "Zeigarnik effect." Incomplete tasks create background stress and distract you. By offloading tasks to a list, you free up mental resources.

## Principles of an Effective List

### Phrase Tasks as Actions
Wrong: "Project." Right: "Write the project plan by Friday."

### Limit the Daily List
No more than 5-7 tasks per day. Long lists are demotivating and create a sense of impossibility.

### Use the Eisenhower Matrix

| | Urgent | Not Urgent |
|---|---|---|
| **Important** | Do immediately | Schedule |
| **Not Important** | Delegate | Eliminate |

## How to Work with a List

1. In the morning, identify your 3 Most Important Tasks (MITs)
2. Start with the hardest task ("eat the frog")
3. Check off completed tasks — it releases dopamine
4. In the evening, carry over unfinished tasks to tomorrow
5. Review and clean up the list weekly

## Task Categories

Divide tasks by area: work, personal, study, health. This helps maintain life balance.

Start planning with our [To-Do List](/tools/todo-list).

See also: [Pomodoro Timer](/tools/pomodoro-timer), [Notes](/tools/notes)
    `.trim(),
  },
  {
    slug: 'todo-list-tips',
    title: '6 советов по ведению списка задач',
    titleEn: '6 Tips for Managing Your To-Do List',
    description: 'Практические приёмы, которые помогут превратить хаотичный список дел в систему продуктивности.',
    descriptionEn: 'Practical techniques to turn a chaotic to-do list into a productivity system.',
    toolSlug: 'todo-list',
    type: 'tips',
    keywords: ['советы', 'продуктивность', 'управление задачами', 'GTD'],
    date: '2026-02-12',
    readTime: 5,
    content: `
## 6 советов по ведению списка задач

### 1. Правило двух минут
Если задача занимает меньше 2 минут — выполните её сразу, не записывая. Запись и отслеживание займут больше времени.

### 2. Разбивайте крупные задачи
«Сделать ремонт» — не задача, а проект. Разбейте: «выбрать цвет стен», «купить краску», «покрасить спальню».

### 3. Устанавливайте дедлайны
Задача без срока — это мечта, а не план. Ставьте реалистичные сроки, даже если они внутренние.

### 4. Используйте метки приоритета
Простая система: высокий, средний, низкий. Или цветовые метки: красный, жёлтый, зелёный.

### 5. Ведите один список
Не разбрасывайте задачи по блокнотам, стикерам и приложениям. Один инструмент — одна система.

### 6. Празднуйте завершение
Вычёркивание задачи — маленькая победа. Не удаляйте выполненные задачи сразу, пусть список достижений мотивирует.

## Метод GTD в списке задач

| Шаг | Действие |
|---|---|
| Сбор | Записать все задачи |
| Обработка | Определить следующее действие |
| Организация | Распределить по категориям |
| Обзор | Еженедельная ревизия |
| Выполнение | Делать по приоритету |

Организуйте свои дела в [Списке задач](/tools/todo-list).

Смотрите также: [Таймер Помодоро](/tools/pomodoro-timer), [Время чтения](/tools/reading-time)
    `.trim(),
    contentEn: `
## 6 Tips for Managing Your To-Do List

### 1. The Two-Minute Rule
If a task takes less than 2 minutes, do it immediately instead of writing it down. Recording and tracking it takes longer.

### 2. Break Down Large Tasks
"Renovate the house" is not a task — it is a project. Break it down: "choose wall colors," "buy paint," "paint the bedroom."

### 3. Set Deadlines
A task without a deadline is a dream, not a plan. Set realistic deadlines, even if they are internal.

### 4. Use Priority Labels
A simple system: high, medium, low. Or color labels: red, yellow, green.

### 5. Keep One List
Do not scatter tasks across notebooks, sticky notes, and apps. One tool — one system.

### 6. Celebrate Completion
Checking off a task is a small victory. Do not delete completed tasks right away — let the list of achievements motivate you.

## The GTD Method in a To-Do List

| Step | Action |
|---|---|
| Capture | Write down all tasks |
| Clarify | Determine the next action |
| Organize | Categorize |
| Review | Weekly review |
| Engage | Do by priority |

Organize your tasks with the [To-Do List](/tools/todo-list).

See also: [Pomodoro Timer](/tools/pomodoro-timer), [Reading Time](/tools/reading-time)
    `.trim(),
  },
  {
    slug: 'todo-list-use-cases',
    title: 'Список задач: 5 способов использования',
    titleEn: 'To-Do List: 5 Ways to Use It',
    description: 'Как использовать список задач не только для работы: планирование путешествий, учёба, привычки и командная работа.',
    descriptionEn: 'How to use a to-do list beyond work: travel planning, studying, habits, and teamwork.',
    toolSlug: 'todo-list',
    type: 'use-cases',
    keywords: ['планирование', 'путешествия', 'привычки', 'командная работа', 'учёба'],
    date: '2026-03-02',
    readTime: 5,
    content: `
## 5 способов использования списка задач

### 1. Ежедневное планирование работы
Классический сценарий: утром составить список задач на день, расставить приоритеты, отмечать выполненные в течение дня.

### 2. Планирование путешествия
Чек-лист путешественника: оформить визу, забронировать отель, купить билеты, собрать чемодан, оформить страховку.

### 3. Трекер привычек
Ежедневные повторяющиеся задачи: зарядка, чтение 30 минут, 8 стаканов воды, медитация. Отмечайте выполнение каждый день.

### 4. Учебный план
Студенты используют списки для отслеживания лекций, дедлайнов сдачи работ и подготовки к экзаменам.

### 5. Список покупок и домашних дел
Бытовые задачи тоже заслуживают организации: список продуктов, уборка по комнатам, мелкий ремонт.

## Пример дневного списка

| Приоритет | Задача | Статус |
|---|---|---|
| Высокий | Сдать отчёт за квартал | В работе |
| Высокий | Позвонить клиенту | Выполнено |
| Средний | Обновить документацию | Ожидает |
| Низкий | Разобрать входящие письма | Ожидает |

Создайте свой список в [Списке задач](/tools/todo-list).

Смотрите также: [Заметки](/tools/notes), [Таймер Помодоро](/tools/pomodoro-timer)
    `.trim(),
    contentEn: `
## 5 Ways to Use a To-Do List

### 1. Daily Work Planning
The classic scenario: create a task list in the morning, set priorities, and check off completed items throughout the day.

### 2. Travel Planning
Traveler's checklist: apply for a visa, book a hotel, buy tickets, pack a suitcase, get travel insurance.

### 3. Habit Tracker
Daily recurring tasks: exercise, read for 30 minutes, drink 8 glasses of water, meditate. Check off completion every day.

### 4. Study Plan
Students use lists to track lectures, assignment deadlines, and exam preparation.

### 5. Shopping and Household Chores
Everyday tasks also deserve organization: grocery list, room-by-room cleaning, minor repairs.

## Sample Daily List

| Priority | Task | Status |
|---|---|---|
| High | Submit quarterly report | In progress |
| High | Call the client | Done |
| Medium | Update documentation | Pending |
| Low | Sort through inbox | Pending |

Create your list with the [To-Do List](/tools/todo-list).

See also: [Notes](/tools/notes), [Pomodoro Timer](/tools/pomodoro-timer)
    `.trim(),
  },

  // === Заметки ===
  {
    slug: 'notes-guide',
    title: 'Заметки: руководство по эффективному конспектированию',
    titleEn: 'Notes: Guide to Effective Note-Taking',
    description: 'Как вести заметки, чтобы ничего не забыть. Методы конспектирования, структурирование информации и организация записей.',
    descriptionEn: 'How to take notes so you never forget anything. Note-taking methods, information structuring, and organizing records.',
    toolSlug: 'notes',
    type: 'guide',
    keywords: ['заметки', 'конспектирование', 'организация информации', 'записи'],
    date: '2026-01-28',
    readTime: 7,
    content: `
## Зачем вести заметки?

Записывание информации увеличивает её запоминание на 30-40%. Заметки — это внешняя память, которая позволяет разгрузить мозг и сосредоточиться на текущей задаче.

## Популярные методы конспектирования

### Метод Корнелла
Разделите страницу на 3 части:
- **Правая колонка (70%)** — основные заметки
- **Левая колонка (30%)** — ключевые слова и вопросы
- **Нижняя часть** — краткое резюме

### Метод ментальных карт
Центральная тема в середине, ветви с подтемами расходятся в стороны. Отлично подходит для мозгового штурма.

### Метод нумерованного списка
Простейший метод: записывайте мысли по порядку, нумеруя каждую. Подходит для совещаний и лекций.

## Правила хороших заметок

1. Записывайте своими словами, а не дословно
2. Используйте сокращения и символы
3. Выделяйте ключевые мысли
4. Добавляйте дату и контекст к каждой записи
5. Регулярно пересматривайте и дополняйте

## Цифровые vs бумажные заметки

| Критерий | Цифровые | Бумажные |
|---|---|---|
| Поиск | Мгновенный | Ручной |
| Запоминание | Среднее | Высокое |
| Скорость | Быстро | Медленнее |
| Гибкость | Высокая | Ограничена |

Начните записывать идеи в наших [Заметках](/tools/notes).

Смотрите также: [Список задач](/tools/todo-list), [Время чтения](/tools/reading-time)
    `.trim(),
    contentEn: `
## Why Take Notes?

Writing down information increases retention by 30-40%. Notes are an external memory that lets you free up your brain and focus on the current task.

## Popular Note-Taking Methods

### Cornell Method
Divide the page into 3 sections:
- **Right column (70%)** — main notes
- **Left column (30%)** — keywords and questions
- **Bottom section** — brief summary

### Mind Mapping Method
Central topic in the middle, branches with subtopics radiating outward. Excellent for brainstorming.

### Numbered List Method
The simplest method: write thoughts in order, numbering each one. Suitable for meetings and lectures.

## Rules for Good Notes

1. Write in your own words, not verbatim
2. Use abbreviations and symbols
3. Highlight key ideas
4. Add date and context to each entry
5. Regularly review and supplement

## Digital vs Paper Notes

| Criterion | Digital | Paper |
|---|---|---|
| Search | Instant | Manual |
| Retention | Medium | High |
| Speed | Fast | Slower |
| Flexibility | High | Limited |

Start capturing ideas in our [Notes](/tools/notes).

See also: [To-Do List](/tools/todo-list), [Reading Time](/tools/reading-time)
    `.trim(),
  },
  {
    slug: 'notes-tips',
    title: '5 советов по ведению заметок',
    titleEn: '5 Tips for Effective Note-Taking',
    description: 'Как сделать заметки по-настоящему полезными: структурирование, теги, регулярный обзор и связывание идей.',
    descriptionEn: 'How to make notes truly useful: structuring, tags, regular review, and linking ideas.',
    toolSlug: 'notes',
    type: 'tips',
    keywords: ['советы', 'структурирование', 'теги', 'продуктивные заметки'],
    date: '2026-02-15',
    readTime: 5,
    content: `
## 5 советов по ведению заметок

### 1. Используйте заголовки и структуру
Каждая заметка должна иметь чёткий заголовок, дату и логическую структуру. Используйте подзаголовки для разделения тем.

### 2. Добавляйте теги и категории
Система тегов (#работа, #идеи, #учёба) помогает быстро находить нужные заметки среди сотен записей.

### 3. Связывайте заметки между собой
Метод Zettelkasten: каждая заметка — отдельная идея, связанная ссылками с другими. Со временем формируется сеть знаний.

### 4. Пересматривайте заметки регулярно
Еженедельный обзор заметок помогает закрепить информацию и выявить неочевидные связи между идеями.

### 5. Не пытайтесь записать всё
Записывайте ключевые мысли, выводы и идеи. Детали можно найти позже, а суть должна быть зафиксирована.

## Шаблоны для разных типов заметок

| Тип | Структура |
|---|---|
| Совещание | Дата, участники, решения, задачи |
| Лекция | Тема, ключевые понятия, вопросы |
| Идея | Описание, контекст, следующий шаг |
| Книга | Название, цитаты, мои мысли |

## Быстрый ввод

Создайте шаблоны для типовых заметок, чтобы не тратить время на форматирование каждый раз.

Попробуйте наши [Заметки](/tools/notes) с поддержкой Markdown.

Смотрите также: [Список задач](/tools/todo-list), [Таймер Помодоро](/tools/pomodoro-timer)
    `.trim(),
    contentEn: `
## 5 Tips for Effective Note-Taking

### 1. Use Headings and Structure
Every note should have a clear title, date, and logical structure. Use subheadings to separate topics.

### 2. Add Tags and Categories
A tag system (#work, #ideas, #study) helps you quickly find the right notes among hundreds of entries.

### 3. Link Notes Together
The Zettelkasten method: each note is a separate idea linked to others by references. Over time, a knowledge network forms.

### 4. Review Notes Regularly
Weekly note review helps reinforce information and discover non-obvious connections between ideas.

### 5. Do Not Try to Write Everything Down
Record key thoughts, conclusions, and ideas. Details can be found later, but the essence must be captured.

## Templates for Different Note Types

| Type | Structure |
|---|---|
| Meeting | Date, attendees, decisions, tasks |
| Lecture | Topic, key concepts, questions |
| Idea | Description, context, next step |
| Book | Title, quotes, my thoughts |

## Quick Entry

Create templates for common note types to save time on formatting.

Try our [Notes](/tools/notes) with Markdown support.

See also: [To-Do List](/tools/todo-list), [Pomodoro Timer](/tools/pomodoro-timer)
    `.trim(),
  },
  {
    slug: 'notes-use-cases',
    title: 'Заметки: 5 сценариев эффективного использования',
    titleEn: 'Notes: 5 Effective Use Case Scenarios',
    description: 'Как использовать заметки для учёбы, работы, личных проектов и саморазвития. Реальные примеры и шаблоны.',
    descriptionEn: 'How to use notes for studying, work, personal projects, and self-improvement. Real examples and templates.',
    toolSlug: 'notes',
    type: 'use-cases',
    keywords: ['сценарии', 'учёба', 'работа', 'личные проекты', 'база знаний'],
    date: '2026-03-03',
    readTime: 5,
    content: `
## 5 сценариев использования заметок

### 1. Конспекты лекций и курсов
Студенты записывают ключевые моменты лекций, формулы и определения. С цифровыми заметками можно добавлять ссылки и изображения.

### 2. Протоколы совещаний
Фиксируйте решения, ответственных и сроки прямо во время встречи. После совещания — отправьте участникам.

### 3. Личная база знаний
Собирайте полезные статьи, рецепты, инструкции и лайфхаки в одном месте. Теги помогут быстро найти нужное.

### 4. Дневник идей
Креативные идеи приходят неожиданно. Быстрая заметка сохранит мысль, которую вы сможете развить позже.

### 5. Планирование проектов
Опишите цели проекта, этапы, ресурсы и риски. По мере работы дополняйте заметку новой информацией.

## Примеры заметок по типам

### Заметка-протокол
- **Дата:** 15 февраля 2026
- **Участники:** Иван, Мария, Алексей
- **Решение:** Запуск проекта до 1 марта
- **Задачи:** Иван — дизайн, Мария — контент

### Заметка-идея
- **Идея:** Автоматизировать отчётность
- **Контекст:** Еженедельные отчёты занимают 3 часа
- **Следующий шаг:** Изучить инструменты автоматизации

Создайте свою базу знаний в [Заметках](/tools/notes).

Смотрите также: [Список задач](/tools/todo-list), [Скорость печати](/tools/typing-speed)
    `.trim(),
    contentEn: `
## 5 Note-Taking Use Case Scenarios

### 1. Lecture and Course Notes
Students record key points from lectures, formulas, and definitions. Digital notes allow adding links and images.

### 2. Meeting Minutes
Capture decisions, responsible parties, and deadlines during the meeting. Afterward, share with attendees.

### 3. Personal Knowledge Base
Collect useful articles, recipes, instructions, and life hacks in one place. Tags help you quickly find what you need.

### 4. Idea Journal
Creative ideas come unexpectedly. A quick note preserves a thought you can develop later.

### 5. Project Planning
Describe project goals, stages, resources, and risks. As work progresses, update the note with new information.

## Note Examples by Type

### Meeting Minutes Note
- **Date:** February 15, 2026
- **Attendees:** Ivan, Maria, Alexei
- **Decision:** Launch the project by March 1
- **Tasks:** Ivan — design, Maria — content

### Idea Note
- **Idea:** Automate reporting
- **Context:** Weekly reports take 3 hours
- **Next step:** Research automation tools

Build your knowledge base with [Notes](/tools/notes).

See also: [To-Do List](/tools/todo-list), [Typing Speed](/tools/typing-speed)
    `.trim(),
  },

  // === Время чтения ===
  {
    slug: 'reading-time-guide',
    title: 'Калькулятор времени чтения: как это работает',
    titleEn: 'Reading Time Calculator: How It Works',
    description: 'Как рассчитывается время чтения текста, от чего зависит скорость чтения и зачем авторам указывать время на прочтение.',
    descriptionEn: 'How reading time is calculated, what affects reading speed, and why authors should include reading time.',
    toolSlug: 'reading-time',
    type: 'guide',
    keywords: ['время чтения', 'скорость чтения', 'калькулятор', 'слов в минуту'],
    date: '2026-02-02',
    readTime: 6,
    content: `
## Что такое калькулятор времени чтения?

Калькулятор времени чтения анализирует текст и рассчитывает, сколько минут потребуется среднему читателю на его прочтение. Это помогает авторам и редакторам планировать объём материала.

## Средняя скорость чтения

| Тип чтения | Слов/мин | Примечание |
|---|---|---|
| Медленное | 100-150 | Сложные тексты, учебники |
| Среднее | 200-250 | Художественная литература |
| Быстрое | 300-400 | Знакомая тема |
| Скорочтение | 500-800 | Специальные техники |

## Что влияет на скорость чтения

- **Сложность текста:** научные статьи читаются медленнее новостей
- **Знакомство с темой:** эксперт читает профессиональный текст быстрее новичка
- **Форматирование:** списки и заголовки ускоряют восприятие
- **Язык:** тексты на иностранном языке читаются на 30-50% медленнее

## Зачем указывать время чтения

- Читатели решают, начинать ли статью, исходя из доступного времени
- Статьи с указанным временем получают больше дочитываний
- Помогает планировать контент-план и рассылки

## Формула расчёта

Время чтения = Количество слов / Скорость чтения (слов/мин)

Для текста в 1500 слов при скорости 230 слов/мин: 1500 / 230 ≈ 7 минут.

Рассчитайте время прочтения вашего текста в [Калькуляторе времени чтения](/tools/reading-time).

Смотрите также: [Скорость печати](/tools/typing-speed), [Заметки](/tools/notes)
    `.trim(),
    contentEn: `
## What Is a Reading Time Calculator?

A reading time calculator analyzes text and estimates how many minutes an average reader needs to read it. This helps authors and editors plan content volume.

## Average Reading Speed

| Reading Type | Words/min | Note |
|---|---|---|
| Slow | 100-150 | Complex texts, textbooks |
| Average | 200-250 | Fiction |
| Fast | 300-400 | Familiar topic |
| Speed reading | 500-800 | Special techniques |

## What Affects Reading Speed

- **Text complexity:** scientific articles are read slower than news
- **Familiarity with the topic:** an expert reads professional text faster than a beginner
- **Formatting:** lists and headings speed up comprehension
- **Language:** texts in a foreign language are read 30-50% slower

## Why Include Reading Time

- Readers decide whether to start an article based on available time
- Articles with indicated reading time get more completions
- Helps plan content calendars and newsletters

## Calculation Formula

Reading time = Word count / Reading speed (words/min)

For a 1,500-word text at 230 words/min: 1500 / 230 ≈ 7 minutes.

Calculate your text's reading time with the [Reading Time Calculator](/tools/reading-time).

See also: [Typing Speed](/tools/typing-speed), [Notes](/tools/notes)
    `.trim(),
  },
  {
    slug: 'reading-time-tips',
    title: '5 советов по оптимизации длины текстов',
    titleEn: '5 Tips for Optimizing Text Length',
    description: 'Как определить идеальную длину статьи, поста или письма для максимального вовлечения читателей.',
    descriptionEn: 'How to determine the ideal length of an article, post, or email for maximum reader engagement.',
    toolSlug: 'reading-time',
    type: 'tips',
    keywords: ['длина текста', 'вовлечённость', 'контент', 'блогинг', 'оптимизация'],
    date: '2026-02-20',
    readTime: 5,
    content: `
## 5 советов по оптимизации длины текстов

### 1. Учитывайте платформу
Каждая платформа имеет оптимальную длину контента:
- Пост в Telegram — 200-500 слов (1-2 мин)
- Статья в блоге — 1000-2000 слов (5-8 мин)
- Лонгрид — 3000-5000 слов (15-20 мин)

### 2. Ориентируйтесь на время чтения 7 минут
Исследования показывают, что статьи с временем чтения около 7 минут получают максимальное вовлечение.

### 3. Разбивайте длинные тексты
Если статья длиннее 10 минут чтения, разбейте её на серию. Каждая часть должна быть самостоятельной.

### 4. Используйте промежуточные заголовки
Подзаголовки каждые 300-400 слов помогают читателю ориентироваться и не терять интерес.

### 5. Проверяйте время перед публикацией
Вставьте текст в калькулятор и убедитесь, что время чтения соответствует вашей цели.

## Оптимальная длина по типу контента

| Тип контента | Слова | Время |
|---|---|---|
| Email-рассылка | 200-300 | 1-2 мин |
| Новость | 300-600 | 2-3 мин |
| Обзор товара | 1000-1500 | 5-7 мин |
| Руководство | 2000-3000 | 8-12 мин |
| Исследование | 3000-5000 | 15-20 мин |

Проверьте ваш текст в [Калькуляторе времени чтения](/tools/reading-time).

Смотрите также: [Заметки](/tools/notes), [Скорость печати](/tools/typing-speed)
    `.trim(),
    contentEn: `
## 5 Tips for Optimizing Text Length

### 1. Consider the Platform
Each platform has an optimal content length:
- Telegram post — 200-500 words (1-2 min)
- Blog article — 1000-2000 words (5-8 min)
- Long-form — 3000-5000 words (15-20 min)

### 2. Aim for 7 Minutes of Reading Time
Research shows that articles with a reading time of about 7 minutes get maximum engagement.

### 3. Split Long Texts
If an article exceeds 10 minutes of reading time, break it into a series. Each part should be self-contained.

### 4. Use Subheadings
Subheadings every 300-400 words help readers navigate and maintain interest.

### 5. Check the Time Before Publishing
Paste your text into the calculator and make sure the reading time matches your goal.

## Optimal Length by Content Type

| Content Type | Words | Time |
|---|---|---|
| Email newsletter | 200-300 | 1-2 min |
| News | 300-600 | 2-3 min |
| Product review | 1000-1500 | 5-7 min |
| Guide | 2000-3000 | 8-12 min |
| Research | 3000-5000 | 15-20 min |

Check your text with the [Reading Time Calculator](/tools/reading-time).

See also: [Notes](/tools/notes), [Typing Speed](/tools/typing-speed)
    `.trim(),
  },
  {
    slug: 'reading-time-use-cases',
    title: 'Калькулятор времени чтения: кому и зачем',
    titleEn: 'Reading Time Calculator: Who Needs It and Why',
    description: 'Как блогеры, маркетологи, редакторы и преподаватели используют калькулятор времени чтения в работе.',
    descriptionEn: 'How bloggers, marketers, editors, and teachers use the reading time calculator in their work.',
    toolSlug: 'reading-time',
    type: 'use-cases',
    keywords: ['блогеры', 'маркетологи', 'редакторы', 'контент-маркетинг', 'сценарии'],
    date: '2026-03-06',
    readTime: 4,
    content: `
## Кому нужен калькулятор времени чтения

### 1. Блогеры и авторы
Проверка длины статьи перед публикацией. Оптимальное время чтения блога — 5-8 минут. Слишком короткие статьи не дают ценности, слишком длинные — теряют читателя.

### 2. Email-маркетологи
Рассылки читают на ходу. Идеальное время — 1-2 минуты (200-400 слов). Калькулятор помогает не превысить лимит.

### 3. Редакторы и контент-менеджеры
Планирование контент-плана с учётом времени чтения. Чередование коротких и длинных материалов удерживает аудиторию.

### 4. Преподаватели и методисты
Расчёт объёма домашних заданий. Если задали 3 статьи по 15 минут — это 45 минут только на чтение, без учёта выполнения заданий.

### 5. UX-писатели
Тексты интерфейсов должны быть максимально короткими. Калькулятор помогает контролировать объём инструкций и подсказок.

## Время чтения как метрика

| Метрика | Значение |
|---|---|
| Среднее время на странице | Сравните с расчётным |
| Процент дочитываний | Выше для коротких текстов |
| Глубина скролла | Коррелирует с вовлечённостью |

Рассчитайте время в [Калькуляторе времени чтения](/tools/reading-time).

Смотрите также: [Скорость печати](/tools/typing-speed), [Список задач](/tools/todo-list)
    `.trim(),
    contentEn: `
## Who Needs the Reading Time Calculator

### 1. Bloggers and Authors
Checking article length before publishing. The optimal blog reading time is 5-8 minutes. Too-short articles lack value; too-long ones lose the reader.

### 2. Email Marketers
Newsletters are read on the go. The ideal time is 1-2 minutes (200-400 words). The calculator helps stay within limits.

### 3. Editors and Content Managers
Planning a content calendar with reading time in mind. Alternating short and long content keeps the audience engaged.

### 4. Teachers and Curriculum Designers
Estimating homework volume. If you assigned 3 articles at 15 minutes each, that is 45 minutes of reading alone, not counting exercises.

### 5. UX Writers
Interface copy should be as short as possible. The calculator helps control the volume of instructions and tooltips.

## Reading Time as a Metric

| Metric | Meaning |
|---|---|
| Average time on page | Compare with calculated time |
| Completion rate | Higher for shorter texts |
| Scroll depth | Correlates with engagement |

Calculate the time with the [Reading Time Calculator](/tools/reading-time).

See also: [Typing Speed](/tools/typing-speed), [To-Do List](/tools/todo-list)
    `.trim(),
  },

  // === Скорость печати ===
  {
    slug: 'typing-speed-guide',
    title: 'Тест скорости печати: полное руководство',
    titleEn: 'Typing Speed Test: Complete Guide',
    description: 'Как измерить скорость печати, что такое WPM и CPM, какая скорость считается хорошей и как улучшить навык.',
    descriptionEn: 'How to measure typing speed, what WPM and CPM are, what speed is considered good, and how to improve the skill.',
    toolSlug: 'typing-speed',
    type: 'guide',
    keywords: ['скорость печати', 'WPM', 'слепая печать', 'клавиатурный тренажёр'],
    date: '2026-02-06',
    readTime: 7,
    content: `
## Зачем измерять скорость печати?

Средний офисный работник тратит на набор текста 30-40% рабочего времени. Увеличение скорости печати с 30 до 60 слов в минуту экономит до 1,5 часов ежедневно.

## Единицы измерения

| Единица | Расшифровка | Описание |
|---|---|---|
| WPM | Words Per Minute | Слов в минуту (стандарт — 5 символов = 1 слово) |
| CPM | Characters Per Minute | Символов в минуту |
| Точность | % | Процент правильно набранных символов |

## Уровни скорости печати

| Уровень | WPM | Описание |
|---|---|---|
| Начинающий | 10-25 | Печать двумя пальцами с подсматриванием |
| Средний | 25-40 | Знакомство с расположением клавиш |
| Уверенный | 40-60 | Слепая печать с редкими ошибками |
| Продвинутый | 60-80 | Профессиональный уровень |
| Эксперт | 80+ | Уровень стенографиста |

## Как проходит тест

1. На экране появляется текст для набора
2. Вы печатаете текст как можно быстрее
3. Система фиксирует скорость и ошибки
4. По завершении выводится результат в WPM и процент точности

## Метод слепой печати

Слепая (десятипальцевая) печать — навык набора текста без взгляда на клавиатуру. Каждый палец отвечает за определённую группу клавиш.

Проверьте свою скорость в [Тесте скорости печати](/tools/typing-speed).

Смотрите также: [Время чтения](/tools/reading-time), [Заметки](/tools/notes)
    `.trim(),
    contentEn: `
## Why Measure Typing Speed?

The average office worker spends 30-40% of work time typing. Increasing typing speed from 30 to 60 words per minute saves up to 1.5 hours daily.

## Units of Measurement

| Unit | Full Name | Description |
|---|---|---|
| WPM | Words Per Minute | Words per minute (standard: 5 characters = 1 word) |
| CPM | Characters Per Minute | Characters per minute |
| Accuracy | % | Percentage of correctly typed characters |

## Typing Speed Levels

| Level | WPM | Description |
|---|---|---|
| Beginner | 10-25 | Two-finger typing while looking at the keyboard |
| Intermediate | 25-40 | Familiar with key layout |
| Confident | 40-60 | Touch typing with rare errors |
| Advanced | 60-80 | Professional level |
| Expert | 80+ | Stenographer level |

## How the Test Works

1. Text appears on the screen to type
2. You type the text as fast as possible
3. The system records speed and errors
4. Upon completion, the result is shown in WPM and accuracy percentage

## Touch Typing Method

Touch typing is the skill of typing without looking at the keyboard. Each finger is responsible for a specific group of keys.

Check your speed with the [Typing Speed Test](/tools/typing-speed).

See also: [Reading Time](/tools/reading-time), [Notes](/tools/notes)
    `.trim(),
  },
  {
    slug: 'typing-speed-tips',
    title: '7 советов для увеличения скорости печати',
    titleEn: '7 Tips to Increase Your Typing Speed',
    description: 'Практические рекомендации по освоению слепой печати: правильная посадка, тренировки и полезные привычки.',
    descriptionEn: 'Practical recommendations for mastering touch typing: proper posture, practice routines, and useful habits.',
    toolSlug: 'typing-speed',
    type: 'tips',
    keywords: ['увеличение скорости', 'тренировка печати', 'слепая печать', 'советы'],
    date: '2026-02-24',
    readTime: 6,
    content: `
## 7 советов для увеличения скорости печати

### 1. Освойте правильное положение рук
Исходная позиция: пальцы на клавишах F и J (на них есть выступы). Указательные пальцы — на F и J, остальные — на соседних клавишах.

### 2. Не смотрите на клавиатуру
Это самое сложное правило. Заклейте буквы на клавишах или используйте пустую клавиатуру для тренировки.

### 3. Тренируйтесь по 15 минут ежедневно
Регулярность важнее длительности. 15 минут каждый день эффективнее часа раз в неделю.

### 4. Сначала — точность, потом — скорость
Не гонитесь за скоростью. Целевая точность — 95%+. Скорость придёт с практикой.

### 5. Используйте все 10 пальцев
Каждый палец отвечает за свою зону клавиатуры:

| Палец | Клавиши |
|---|---|
| Левый мизинец | Q, A, Z, 1 |
| Левый безымянный | W, S, X, 2 |
| Левый средний | E, D, C, 3 |
| Левый указательный | R, T, F, G, V, B |
| Правый указательный | Y, U, H, J, N, M |

### 6. Тренируйтесь на реальных текстах
После освоения базовых упражнений переходите к набору статей и книг — это развивает навык в реальных условиях.

### 7. Отслеживайте прогресс
Проходите тест раз в неделю и записывайте результаты. Видимый прогресс мотивирует продолжать.

Проверьте свой уровень в [Тесте скорости печати](/tools/typing-speed).

Смотрите также: [Время чтения](/tools/reading-time), [Таймер Помодоро](/tools/pomodoro-timer)
    `.trim(),
    contentEn: `
## 7 Tips to Increase Your Typing Speed

### 1. Master the Correct Hand Position
Starting position: fingers on the F and J keys (they have bumps). Index fingers on F and J, the rest on adjacent keys.

### 2. Do Not Look at the Keyboard
This is the hardest rule. Cover the letters on the keys or use a blank keyboard for practice.

### 3. Practice 15 Minutes Daily
Consistency matters more than duration. 15 minutes every day is more effective than one hour once a week.

### 4. Accuracy First, Speed Second
Do not chase speed. Target accuracy is 95%+. Speed comes with practice.

### 5. Use All 10 Fingers
Each finger is responsible for its own keyboard zone:

| Finger | Keys |
|---|---|
| Left pinky | Q, A, Z, 1 |
| Left ring | W, S, X, 2 |
| Left middle | E, D, C, 3 |
| Left index | R, T, F, G, V, B |
| Right index | Y, U, H, J, N, M |

### 6. Practice with Real Texts
After mastering basic exercises, move on to typing articles and books — this develops the skill in real conditions.

### 7. Track Your Progress
Take the test once a week and record results. Visible progress motivates you to continue.

Check your level with the [Typing Speed Test](/tools/typing-speed).

See also: [Reading Time](/tools/reading-time), [Pomodoro Timer](/tools/pomodoro-timer)
    `.trim(),
  },
  {
    slug: 'typing-speed-use-cases',
    title: 'Тест скорости печати: кому это нужно',
    titleEn: 'Typing Speed Test: Who Needs It',
    description: 'Зачем проходить тест скорости печати: от трудоустройства до учёбы и личной продуктивности.',
    descriptionEn: 'Why take a typing speed test: from job applications to studying and personal productivity.',
    toolSlug: 'typing-speed',
    type: 'use-cases',
    keywords: ['трудоустройство', 'продуктивность', 'навыки', 'карьера', 'тест'],
    date: '2026-03-09',
    readTime: 4,
    content: `
## Кому нужен тест скорости печати

### 1. Соискатели на вакансии
Многие работодатели требуют скорость печати от 40-60 WPM. Секретари, операторы колл-центров и журналисты проходят тест при приёме на работу.

### 2. Студенты
Быстрая печать позволяет вести конспекты лекций в реальном времени. При средней скорости речи лектора 120-150 слов/мин нужна скорость печати минимум 40 WPM.

### 3. Программисты
Хотя скорость печати — не главный навык разработчика, быстрый набор кода снижает когнитивную нагрузку и позволяет сосредоточиться на логике.

### 4. Писатели и журналисты
Профессиональные авторы печатают со скоростью 60-80 WPM. Это позволяет фиксировать мысли быстрее, чем они ускользают.

### 5. Все, кто работает за компьютером
Даже если вы не печатаете весь день, ускорение набора текста в 2 раза экономит десятки часов в год.

## Требования по профессиям

| Профессия | Минимум WPM | Рекомендация |
|---|---|---|
| Секретарь | 50 | 70+ |
| Программист | 30 | 50+ |
| Журналист | 60 | 80+ |
| Студент | 30 | 45+ |
| Оператор ввода данных | 60 | 80+ |

## Статистика

Средняя скорость печати в мире — 40 WPM. Рекорд мира — более 200 WPM.

Узнайте свой результат в [Тесте скорости печати](/tools/typing-speed).

Смотрите также: [Время чтения](/tools/reading-time), [Список задач](/tools/todo-list)
    `.trim(),
    contentEn: `
## Who Needs a Typing Speed Test

### 1. Job Seekers
Many employers require a typing speed of 40-60 WPM. Secretaries, call center operators, and journalists take typing tests during hiring.

### 2. Students
Fast typing allows taking lecture notes in real time. With an average lecturer speaking speed of 120-150 words/min, a typing speed of at least 40 WPM is needed.

### 3. Programmers
Although typing speed is not a developer's main skill, faster code entry reduces cognitive load and lets you focus on logic.

### 4. Writers and Journalists
Professional authors type at 60-80 WPM. This allows capturing thoughts faster than they slip away.

### 5. Anyone Who Works at a Computer
Even if you do not type all day, doubling your typing speed saves dozens of hours per year.

## Requirements by Profession

| Profession | Minimum WPM | Recommended |
|---|---|---|
| Secretary | 50 | 70+ |
| Programmer | 30 | 50+ |
| Journalist | 60 | 80+ |
| Student | 30 | 45+ |
| Data entry operator | 60 | 80+ |

## Statistics

The average typing speed worldwide is 40 WPM. The world record is over 200 WPM.

Find out your result with the [Typing Speed Test](/tools/typing-speed).

See also: [Reading Time](/tools/reading-time), [To-Do List](/tools/todo-list)
    `.trim(),
  },
];
