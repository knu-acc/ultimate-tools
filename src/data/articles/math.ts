import { Article } from '../articles';

export const mathArticles: Article[] = [
  // === equation-solver (Решатель уравнений) ===
  {
    slug: 'equation-solver-guide',
    title: 'Как решать уравнения онлайн: полное руководство',
    description: 'Подробное руководство по использованию онлайн-решателя уравнений для линейных, квадратных и систем уравнений.',
    toolSlug: 'equation-solver',
    type: 'guide',
    keywords: ['решение уравнений', 'линейные уравнения', 'квадратные уравнения', 'онлайн калькулятор'],
    date: '2026-01-15',
    readTime: 6,
    content: `## Как решать уравнения онлайн

Решатель уравнений позволяет быстро находить корни линейных, квадратных и кубических уравнений. Инструмент поддерживает пошаговое отображение решения.

### Поддерживаемые типы уравнений

- **Линейные уравнения** вида ax + b = 0
- **Квадратные уравнения** вида ax² + bx + c = 0
- **Кубические уравнения** и уравнения высших степеней
- **Системы линейных уравнений** с двумя и тремя неизвестными

### Как пользоваться

1. Введите уравнение в поле ввода
2. Укажите переменную, относительно которой нужно решить
3. Нажмите кнопку «Решить»
4. Получите пошаговое решение с объяснениями

### Примеры использования

| Тип уравнения | Пример | Результат |
|---|---|---|
| Линейное | 2x + 5 = 11 | x = 3 |
| Квадратное | x² - 5x + 6 = 0 | x = 2, x = 3 |
| Система | x + y = 5, x - y = 1 | x = 3, y = 2 |

Инструмент автоматически определяет тип уравнения и применяет соответствующий метод решения. Для квадратных уравнений вычисляется дискриминант и проверяется наличие действительных корней.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Построитель графиков](/tools/graph-plotter), [Калькулятор пропорций](/tools/proportion-calc)`,
    titleEn: 'How to Solve Equations Online: A Complete Guide',
    descriptionEn: 'A detailed guide to using the online equation solver for linear, quadratic, and systems of equations.',
    contentEn: `## How to Solve Equations Online

The equation solver allows you to quickly find the roots of linear, quadratic, and cubic equations. The tool supports step-by-step solution display.

### Supported Equation Types

- **Linear equations** of the form ax + b = 0
- **Quadratic equations** of the form ax² + bx + c = 0
- **Cubic equations** and higher-degree equations
- **Systems of linear equations** with two and three unknowns

### How to Use

1. Enter the equation in the input field
2. Specify the variable to solve for
3. Click the "Solve" button
4. Get a step-by-step solution with explanations

### Usage Examples

| Equation Type | Example | Result |
|---|---|---|
| Linear | 2x + 5 = 11 | x = 3 |
| Quadratic | x² - 5x + 6 = 0 | x = 2, x = 3 |
| System | x + y = 5, x - y = 1 | x = 3, y = 2 |

The tool automatically detects the equation type and applies the appropriate solving method. For quadratic equations, it calculates the discriminant and checks for real roots.

See also: [Fraction Calculator](/tools/fraction-calc), [Graph Plotter](/tools/graph-plotter), [Proportion Calculator](/tools/proportion-calc)`
  },
  {
    slug: 'equation-solver-tips',
    title: '7 советов для эффективного решения уравнений',
    description: 'Практические советы по решению уравнений различной сложности с использованием онлайн-инструмента.',
    toolSlug: 'equation-solver',
    type: 'tips',
    keywords: ['советы', 'решение уравнений', 'математика', 'лайфхаки'],
    date: '2026-01-22',
    readTime: 5,
    content: `## Советы для эффективного решения уравнений

Правильный подход к решению уравнений экономит время и снижает вероятность ошибок. Используйте эти рекомендации для повышения точности.

### 1. Всегда упрощайте перед решением

Приведите подобные члены и раскройте скобки до того, как вводить уравнение в калькулятор. Это уменьшает вероятность ошибки ввода.

### 2. Проверяйте ответ подстановкой

После получения корней подставьте их обратно в исходное уравнение. Если обе части равны — решение верное.

### 3. Обращайте внимание на ОДЗ

Область допустимых значений важна для дробных и иррациональных уравнений. Не забывайте проверять, не обращается ли знаменатель в ноль.

### 4. Используйте графический метод

Постройте график функции, чтобы визуально определить количество корней и их приблизительные значения.

### 5. Разбивайте сложные уравнения

Сложное уравнение часто можно разбить на несколько простых с помощью замены переменных или факторизации.

### 6. Следите за знаками

Наиболее частая ошибка — неправильный перенос слагаемых через знак равенства. Помните: при переносе знак меняется на противоположный.

### 7. Используйте пошаговое решение

Наш инструмент показывает каждый шаг решения — используйте это для обучения и понимания алгоритмов.

Смотрите также: [Калькулятор матриц](/tools/matrix-calc), [Статистика](/tools/statistics-calc), [Построитель графиков](/tools/graph-plotter)`,
    titleEn: '7 Tips for Solving Equations Effectively',
    descriptionEn: 'Practical tips for solving equations of varying complexity using the online tool.',
    contentEn: `## Tips for Solving Equations Effectively

The right approach to solving equations saves time and reduces the chance of errors. Use these recommendations to improve accuracy.

### 1. Always Simplify Before Solving

Combine like terms and expand brackets before entering the equation into the calculator. This reduces the chance of input errors.

### 2. Verify Your Answer by Substitution

After finding the roots, substitute them back into the original equation. If both sides are equal, the solution is correct.

### 3. Watch for Domain Restrictions

The domain of permissible values is important for fractional and irrational equations. Don't forget to check whether the denominator equals zero.

### 4. Use the Graphical Method

Plot the function graph to visually determine the number of roots and their approximate values.

### 5. Break Down Complex Equations

A complex equation can often be broken into several simpler ones using variable substitution or factorization.

### 6. Watch the Signs

The most common mistake is incorrectly moving terms across the equals sign. Remember: when moving a term, the sign changes to its opposite.

### 7. Use Step-by-Step Solutions

Our tool shows every step of the solution — use this for learning and understanding the algorithms.

See also: [Matrix Calculator](/tools/matrix-calc), [Statistics](/tools/statistics-calc), [Graph Plotter](/tools/graph-plotter)`
  },
  {
    slug: 'equation-solver-use-cases',
    title: 'Где применяется решение уравнений: практические примеры',
    description: 'Реальные сценарии использования решателя уравнений в учёбе, работе и повседневной жизни.',
    toolSlug: 'equation-solver',
    type: 'use-cases',
    keywords: ['применение', 'уравнения', 'задачи', 'практика'],
    date: '2026-02-03',
    readTime: 7,
    content: `## Практические применения решения уравнений

Уравнения окружают нас повсюду — от расчёта бюджета до инженерных задач. Рассмотрим конкретные сценарии.

### Финансовые расчёты

Линейные уравнения помогают рассчитать, через сколько месяцев накопится нужная сумма при фиксированных ежемесячных вложениях. Например, если откладывать по 15 000 рублей в месяц и нужно накопить 180 000 рублей, уравнение 15000x = 180000 даст ответ: 12 месяцев.

### Физика и инженерия

- Расчёт траектории движения тела (квадратные уравнения)
- Определение точки равновесия сил (системы уравнений)
- Вычисление параметров электрических цепей (закон Ома)

### Образование

Студенты и школьники используют решатель для проверки домашних заданий и подготовки к экзаменам. Пошаговое решение помогает понять методику.

### Бизнес-аналитика

- Определение точки безубыточности: доходы = расходы
- Расчёт оптимальной цены товара
- Прогнозирование спроса на основе математических моделей

### Строительство и ремонт

Расчёт количества материалов, определение пропорций смесей и вычисление площадей сложных фигур — всё это сводится к решению уравнений.

Смотрите также: [Калькулятор пропорций](/tools/proportion-calc), [Статистика](/tools/statistics-calc), [Калькулятор дробей](/tools/fraction-calc)`,
    titleEn: 'Where Equation Solving Is Used: Practical Examples',
    descriptionEn: 'Real-world scenarios for using the equation solver in education, work, and everyday life.',
    contentEn: `## Practical Applications of Equation Solving

Equations surround us everywhere — from budget calculations to engineering tasks. Let's look at specific scenarios.

### Financial Calculations

Linear equations help calculate how many months it will take to save up a needed amount with fixed monthly contributions. For example, if you save 15,000 rubles per month and need to accumulate 180,000 rubles, the equation 15000x = 180000 gives the answer: 12 months.

### Physics and Engineering

- Calculating the trajectory of a moving body (quadratic equations)
- Determining the equilibrium point of forces (systems of equations)
- Computing parameters of electrical circuits (Ohm's law)

### Education

Students use the solver to check homework and prepare for exams. The step-by-step solution helps understand the methodology.

### Business Analytics

- Determining the break-even point: revenue = expenses
- Calculating the optimal product price
- Forecasting demand based on mathematical models

### Construction and Renovation

Calculating the amount of materials, determining mixture proportions, and computing areas of complex shapes — all of this comes down to solving equations.

See also: [Proportion Calculator](/tools/proportion-calc), [Statistics](/tools/statistics-calc), [Fraction Calculator](/tools/fraction-calc)`
  },

  // === matrix-calc (Калькулятор матриц) ===
  {
    slug: 'matrix-calc-guide',
    title: 'Руководство по калькулятору матриц: все операции',
    description: 'Полное руководство по выполнению матричных операций: сложение, умножение, транспонирование, нахождение определителя.',
    toolSlug: 'matrix-calc',
    type: 'guide',
    keywords: ['матрицы', 'определитель', 'умножение матриц', 'линейная алгебра'],
    date: '2026-01-18',
    readTime: 7,
    content: `## Калькулятор матриц: полное руководство

Калькулятор матриц поддерживает все основные операции линейной алгебры. Работайте с матрицами размером до 10×10.

### Поддерживаемые операции

- **Сложение и вычитание** матриц одинакового размера
- **Умножение** матрицы на число и матрицу на матрицу
- **Транспонирование** — замена строк на столбцы
- **Определитель** — вычисление для квадратных матриц
- **Обратная матрица** — если определитель не равен нулю
- **Ранг матрицы** — методом Гаусса

### Как ввести матрицу

1. Укажите размерность матрицы (строки × столбцы)
2. Заполните ячейки числовыми значениями
3. Для дробных чисел используйте точку в качестве разделителя
4. Выберите нужную операцию из списка

### Правила умножения матриц

Для умножения матрицы A(m×n) на матрицу B(p×q) необходимо, чтобы n = p. Результатом будет матрица размером m×q.

### Определитель матрицы

Определитель вычисляется только для квадратных матриц. Для матриц 2×2 используется формула ad - bc. Для матриц большего размера применяется разложение по строке или столбцу.

Результаты отображаются с пошаговыми промежуточными вычислениями, что помогает проверить правильность и понять алгоритм.

Смотрите также: [Решатель уравнений](/tools/equation-solver), [Статистика](/tools/statistics-calc), [Калькулятор дробей](/tools/fraction-calc)`,
    titleEn: 'Matrix Calculator Guide: All Operations',
    descriptionEn: 'A complete guide to matrix operations: addition, multiplication, transposition, and finding the determinant.',
    contentEn: `## Matrix Calculator: Complete Guide

The matrix calculator supports all basic linear algebra operations. Work with matrices up to 10x10.

### Supported Operations

- **Addition and subtraction** of matrices of the same size
- **Multiplication** of a matrix by a scalar and matrix by matrix
- **Transposition** — swapping rows and columns
- **Determinant** — calculation for square matrices
- **Inverse matrix** — if the determinant is non-zero
- **Matrix rank** — using Gaussian elimination

### How to Enter a Matrix

1. Specify the matrix dimensions (rows x columns)
2. Fill in the cells with numerical values
3. Use a period as the decimal separator for fractional numbers
4. Select the desired operation from the list

### Matrix Multiplication Rules

To multiply matrix A(m×n) by matrix B(p×q), n must equal p. The result will be a matrix of size m×q.

### Matrix Determinant

The determinant is calculated only for square matrices. For 2×2 matrices, the formula ad - bc is used. For larger matrices, expansion along a row or column is applied.

Results are displayed with step-by-step intermediate calculations, which helps verify correctness and understand the algorithm.

See also: [Equation Solver](/tools/equation-solver), [Statistics](/tools/statistics-calc), [Fraction Calculator](/tools/fraction-calc)`
  },
  {
    slug: 'matrix-calc-tips',
    title: 'Советы по работе с матрицами для студентов',
    description: 'Полезные советы и приёмы для эффективной работы с матрицами в учебных задачах.',
    toolSlug: 'matrix-calc',
    type: 'tips',
    keywords: ['матрицы', 'советы', 'студентам', 'линейная алгебра'],
    date: '2026-02-10',
    readTime: 5,
    content: `## Советы по работе с матрицами

Матричные вычисления требуют внимательности и понимания правил. Эти советы помогут избежать типичных ошибок.

### Проверяйте размерности

Перед умножением убедитесь, что число столбцов первой матрицы равно числу строк второй. Это самая частая причина ошибок.

### Используйте свойства определителя

- Определитель треугольной матрицы равен произведению диагональных элементов
- При замене строк местами определитель меняет знак
- Если строка состоит из нулей, определитель равен нулю

### Упрощайте перед вычислением

Если в матрице есть строка или столбец с большим количеством нулей, разложите определитель именно по этой строке или столбцу.

### Проверяйте обратную матрицу

Умножьте исходную матрицу на найденную обратную. Если результат — единичная матрица, вычисления верны.

### Транспонирование — ваш помощник

Иногда транспонирование матрицы перед операцией упрощает вычисления. Помните, что (AB)ᵀ = BᵀAᵀ.

### Метод Гаусса — универсальный инструмент

Метод Гаусса подходит для нахождения определителя, обратной матрицы, ранга и решения систем уравнений. Освойте его в первую очередь.

Смотрите также: [Решатель уравнений](/tools/equation-solver), [Калькулятор дробей](/tools/fraction-calc), [НОД и НОК](/tools/gcd-lcm)`,
    titleEn: 'Matrix Tips for Students',
    descriptionEn: 'Useful tips and techniques for working effectively with matrices in academic problems.',
    contentEn: `## Tips for Working with Matrices

Matrix calculations require attention and understanding of the rules. These tips will help you avoid common mistakes.

### Check the Dimensions

Before multiplication, make sure the number of columns in the first matrix equals the number of rows in the second. This is the most common cause of errors.

### Use Determinant Properties

- The determinant of a triangular matrix equals the product of diagonal elements
- Swapping rows changes the sign of the determinant
- If a row consists of zeros, the determinant is zero

### Simplify Before Calculating

If a matrix has a row or column with many zeros, expand the determinant along that row or column.

### Verify the Inverse Matrix

Multiply the original matrix by the found inverse. If the result is the identity matrix, the calculations are correct.

### Transposition Is Your Friend

Sometimes transposing a matrix before an operation simplifies the calculations. Remember that (AB)^T = B^T A^T.

### Gaussian Elimination — A Universal Tool

Gaussian elimination works for finding the determinant, inverse matrix, rank, and solving systems of equations. Master it first.

See also: [Equation Solver](/tools/equation-solver), [Fraction Calculator](/tools/fraction-calc), [GCD and LCM](/tools/gcd-lcm)`
  },
  {
    slug: 'matrix-calc-use-cases',
    title: 'Применение матриц: от компьютерной графики до экономики',
    description: 'Практические сценарии использования матричных вычислений в различных областях.',
    toolSlug: 'matrix-calc',
    type: 'use-cases',
    keywords: ['матрицы', 'применение', 'графика', 'экономика'],
    date: '2026-02-20',
    readTime: 6,
    content: `## Где применяются матрицы

Матрицы — один из важнейших инструментов прикладной математики. Они используются в самых разных областях.

### Компьютерная графика

Все трансформации в 3D-графике выполняются с помощью матриц: поворот, масштабирование, перемещение объектов. Каждый кадр в видеоигре — результат тысяч матричных умножений.

### Машинное обучение

Нейронные сети основаны на матричных операциях. Веса нейронов хранятся в матрицах, а процесс обучения — это последовательные умножения и преобразования матриц.

### Экономическое моделирование

- Модель Леонтьева «затраты — выпуск» описывается матричным уравнением
- Портфельная теория Марковица использует ковариационные матрицы
- Транспортные задачи решаются методами линейного программирования

### Криптография

Шифр Хилла использует умножение матриц для шифрования текста. Обратная матрица применяется для расшифровки сообщений.

### Инженерия и физика

- Расчёт напряжений в конструкциях (тензоры напряжений)
- Анализ электрических цепей
- Квантовая механика (операторы как матрицы)

Матрицы — фундамент современных вычислений, и умение работать с ними открывает двери во множество профессий.

Смотрите также: [Статистика](/tools/statistics-calc), [Решатель уравнений](/tools/equation-solver), [Построитель графиков](/tools/graph-plotter)`,
    titleEn: 'Applications of Matrices: From Computer Graphics to Economics',
    descriptionEn: 'Practical scenarios for using matrix calculations in various fields.',
    contentEn: `## Where Matrices Are Used

Matrices are one of the most important tools in applied mathematics. They are used across a wide range of fields.

### Computer Graphics

All transformations in 3D graphics are performed using matrices: rotation, scaling, and translation of objects. Every frame in a video game is the result of thousands of matrix multiplications.

### Machine Learning

Neural networks are based on matrix operations. Neuron weights are stored in matrices, and the training process is a series of matrix multiplications and transformations.

### Economic Modeling

- Leontief's input-output model is described by a matrix equation
- Markowitz's portfolio theory uses covariance matrices
- Transportation problems are solved using linear programming methods

### Cryptography

The Hill cipher uses matrix multiplication for text encryption. The inverse matrix is used for decryption.

### Engineering and Physics

- Stress calculations in structures (stress tensors)
- Electrical circuit analysis
- Quantum mechanics (operators as matrices)

Matrices are the foundation of modern computing, and knowing how to work with them opens doors to many professions.

See also: [Statistics](/tools/statistics-calc), [Equation Solver](/tools/equation-solver), [Graph Plotter](/tools/graph-plotter)`
  },

  // === statistics-calc (Статистика) ===
  {
    slug: 'statistics-calc-guide',
    title: 'Руководство по статистическому калькулятору',
    description: 'Как использовать статистический калькулятор для анализа данных: среднее, медиана, дисперсия и другие показатели.',
    toolSlug: 'statistics-calc',
    type: 'guide',
    keywords: ['статистика', 'среднее', 'медиана', 'дисперсия', 'анализ данных'],
    date: '2026-01-25',
    readTime: 7,
    content: `## Статистический калькулятор: руководство

Статистический калькулятор вычисляет все основные показатели описательной статистики для вашего набора данных.

### Доступные показатели

- **Среднее арифметическое** — сумма всех значений, делённая на их количество
- **Медиана** — значение, делящее отсортированный ряд пополам
- **Мода** — наиболее часто встречающееся значение
- **Дисперсия** — мера разброса данных относительно среднего
- **Стандартное отклонение** — квадратный корень из дисперсии
- **Размах** — разница между максимальным и минимальным значением

### Как ввести данные

1. Введите числа через запятую или пробел
2. Поддерживаются целые и дробные числа
3. Для больших наборов данных можно вставить из таблицы
4. Нажмите «Рассчитать» для получения результатов

### Интерпретация результатов

| Показатель | Что означает |
|---|---|
| Малая дисперсия | Данные сгруппированы близко к среднему |
| Большая дисперсия | Данные сильно разбросаны |
| Среднее ≈ Медиана | Распределение близко к симметричному |
| Среднее ≠ Медиана | Присутствует асимметрия распределения |

Калькулятор автоматически сортирует данные, определяет выбросы и предоставляет полную сводку по всем показателям.

Смотрите также: [Построитель графиков](/tools/graph-plotter), [Решатель уравнений](/tools/equation-solver), [Калькулятор пропорций](/tools/proportion-calc)`,
    titleEn: 'Statistics Calculator Guide',
    descriptionEn: 'How to use the statistics calculator for data analysis: mean, median, variance, and other measures.',
    contentEn: `## Statistics Calculator: Guide

The statistics calculator computes all major descriptive statistics measures for your dataset.

### Available Measures

- **Arithmetic mean** — the sum of all values divided by their count
- **Median** — the value that divides the sorted series in half
- **Mode** — the most frequently occurring value
- **Variance** — a measure of data spread relative to the mean
- **Standard deviation** — the square root of the variance
- **Range** — the difference between the maximum and minimum values

### How to Enter Data

1. Enter numbers separated by commas or spaces
2. Both integers and decimal numbers are supported
3. For large datasets, you can paste from a spreadsheet
4. Click "Calculate" to get results

### Interpreting Results

| Measure | What It Means |
|---|---|
| Low variance | Data is clustered close to the mean |
| High variance | Data is widely spread |
| Mean ≈ Median | Distribution is close to symmetric |
| Mean ≠ Median | There is distribution asymmetry |

The calculator automatically sorts the data, identifies outliers, and provides a complete summary of all measures.

See also: [Graph Plotter](/tools/graph-plotter), [Equation Solver](/tools/equation-solver), [Proportion Calculator](/tools/proportion-calc)`
  },
  {
    slug: 'statistics-calc-tips',
    title: 'Советы по статистическому анализу данных',
    description: 'Практические рекомендации по правильному выбору и интерпретации статистических показателей.',
    toolSlug: 'statistics-calc',
    type: 'tips',
    keywords: ['статистика', 'советы', 'анализ', 'интерпретация'],
    date: '2026-02-14',
    readTime: 5,
    content: `## Советы по статистическому анализу

Правильная интерпретация статистических показателей не менее важна, чем их вычисление. Следуйте этим рекомендациям.

### Выбирайте правильную меру центральной тенденции

- **Среднее** подходит для симметричных распределений без выбросов
- **Медиана** устойчива к выбросам и лучше описывает асимметричные данные
- **Мода** полезна для категориальных данных

### Не игнорируйте выбросы

Выбросы могут быть ошибками измерений или важными аномалиями. Всегда проверяйте их природу перед исключением из анализа.

### Размер выборки имеет значение

Для надёжных статистических выводов нужна достаточная выборка. Малые выборки (менее 30 наблюдений) могут давать неустойчивые результаты.

### Визуализируйте данные

Числовые показатели не дают полной картины. Постройте гистограмму или диаграмму рассеяния для лучшего понимания структуры данных.

### Различайте корреляцию и причинность

Два показателя могут быть коррелированы, но это не означает, что один является причиной другого.

### Проверяйте нормальность распределения

Многие статистические тесты предполагают нормальное распределение. Убедитесь, что ваши данные соответствуют этому допущению.

Смотрите также: [Построитель графиков](/tools/graph-plotter), [Калькулятор матриц](/tools/matrix-calc), [Решатель уравнений](/tools/equation-solver)`,
    titleEn: 'Tips for Statistical Data Analysis',
    descriptionEn: 'Practical recommendations for correctly choosing and interpreting statistical measures.',
    contentEn: `## Tips for Statistical Analysis

Correct interpretation of statistical measures is just as important as calculating them. Follow these recommendations.

### Choose the Right Measure of Central Tendency

- **Mean** is suitable for symmetric distributions without outliers
- **Median** is resistant to outliers and better describes asymmetric data
- **Mode** is useful for categorical data

### Don't Ignore Outliers

Outliers may be measurement errors or important anomalies. Always investigate their nature before excluding them from analysis.

### Sample Size Matters

For reliable statistical conclusions, you need a sufficient sample. Small samples (fewer than 30 observations) may produce unstable results.

### Visualize Your Data

Numerical measures don't tell the full story. Build a histogram or scatter plot for a better understanding of data structure.

### Distinguish Correlation from Causation

Two measures may be correlated, but this doesn't mean one causes the other.

### Check for Normal Distribution

Many statistical tests assume a normal distribution. Make sure your data meets this assumption.

See also: [Graph Plotter](/tools/graph-plotter), [Matrix Calculator](/tools/matrix-calc), [Equation Solver](/tools/equation-solver)`
  },
  {
    slug: 'statistics-calc-use-cases',
    title: 'Применение статистики в реальной жизни',
    description: 'Примеры использования статистических расчётов в бизнесе, науке и повседневной жизни.',
    toolSlug: 'statistics-calc',
    type: 'use-cases',
    keywords: ['статистика', 'применение', 'бизнес', 'наука'],
    date: '2026-03-01',
    readTime: 6,
    content: `## Статистика в реальной жизни

Статистические методы применяются повсеместно — от анализа продаж до медицинских исследований.

### Маркетинг и продажи

Анализ средних чеков, медианных доходов клиентов, стандартного отклонения продаж по дням — всё это помогает принимать обоснованные бизнес-решения.

### Контроль качества

На производстве статистика используется для контроля качества продукции. Если стандартное отклонение размеров деталей превышает допуск — процесс требует настройки.

### Образование

- Анализ успеваемости учеников
- Оценка сложности тестовых заданий
- Сравнение результатов разных групп

### Медицина и здоровье

Клинические испытания лекарств, эпидемиологические исследования, анализ эффективности лечения — всё это основано на статистических методах.

### Спорт

Спортивная аналитика использует статистику для оценки результатов игроков, прогнозирования исходов матчей и оптимизации тренировочных программ.

### Личные финансы

Отслеживание расходов по категориям, вычисление средних ежемесячных трат и определение тенденций помогает лучше управлять бюджетом.

Смотрите также: [Построитель графиков](/tools/graph-plotter), [Калькулятор пропорций](/tools/proportion-calc), [Решатель уравнений](/tools/equation-solver)`,
    titleEn: 'Statistics in Real Life',
    descriptionEn: 'Examples of using statistical calculations in business, science, and everyday life.',
    contentEn: `## Statistics in Real Life

Statistical methods are used everywhere — from sales analysis to medical research.

### Marketing and Sales

Analyzing average receipts, median customer income, and standard deviation of daily sales — all of this helps make informed business decisions.

### Quality Control

In manufacturing, statistics is used for product quality control. If the standard deviation of part dimensions exceeds the tolerance, the process needs adjustment.

### Education

- Analyzing student performance
- Evaluating test question difficulty
- Comparing results across different groups

### Medicine and Health

Clinical drug trials, epidemiological studies, and treatment effectiveness analysis — all of this is based on statistical methods.

### Sports

Sports analytics uses statistics to evaluate player performance, predict match outcomes, and optimize training programs.

### Personal Finance

Tracking expenses by category, calculating average monthly spending, and identifying trends helps manage your budget better.

See also: [Graph Plotter](/tools/graph-plotter), [Proportion Calculator](/tools/proportion-calc), [Equation Solver](/tools/equation-solver)`
  },

  // === factorial-calc (Факториал и Комбинаторика) ===
  {
    slug: 'factorial-calc-guide',
    title: 'Руководство по калькулятору факториалов и комбинаторики',
    description: 'Как вычислять факториалы, перестановки, сочетания и размещения с помощью онлайн-калькулятора.',
    toolSlug: 'factorial-calc',
    type: 'guide',
    keywords: ['факториал', 'комбинаторика', 'перестановки', 'сочетания'],
    date: '2026-01-20',
    readTime: 6,
    content: `## Калькулятор факториалов и комбинаторики

Инструмент для вычисления факториалов, перестановок, сочетаний и размещений. Поддерживает работу с большими числами.

### Основные операции

- **Факториал (n!)** — произведение всех натуральных чисел от 1 до n
- **Перестановки (P)** — число способов расположить n элементов в ряд
- **Сочетания (C)** — число способов выбрать k элементов из n без учёта порядка
- **Размещения (A)** — число способов выбрать k элементов из n с учётом порядка

### Формулы

| Операция | Формула |
|---|---|
| Факториал | n! = 1 × 2 × 3 × ... × n |
| Сочетания | C(n,k) = n! / (k! × (n-k)!) |
| Размещения | A(n,k) = n! / (n-k)! |
| Перестановки | P(n) = n! |

### Как пользоваться

1. Выберите тип вычисления из списка
2. Введите значения n и k (если требуется)
3. Нажмите «Рассчитать»
4. Получите результат с промежуточными вычислениями

### Ограничения

Факториал быстро растёт: 20! уже превышает 2 квинтиллиона. Калькулятор поддерживает вычисления до 170!, после чего число выходит за пределы стандартного представления.

Смотрите также: [Проверка простых чисел](/tools/prime-checker), [НОД и НОК](/tools/gcd-lcm), [Статистика](/tools/statistics-calc)`,
    titleEn: 'Factorials and Combinatorics Calculator Guide',
    descriptionEn: 'How to calculate factorials, permutations, combinations, and arrangements using the online calculator.',
    contentEn: `## Factorials and Combinatorics Calculator

A tool for computing factorials, permutations, combinations, and arrangements. Supports working with large numbers.

### Basic Operations

- **Factorial (n!)** — the product of all natural numbers from 1 to n
- **Permutations (P)** — the number of ways to arrange n elements in a row
- **Combinations (C)** — the number of ways to choose k elements from n without regard to order
- **Arrangements (A)** — the number of ways to choose k elements from n with regard to order

### Formulas

| Operation | Formula |
|---|---|
| Factorial | n! = 1 × 2 × 3 × ... × n |
| Combinations | C(n,k) = n! / (k! × (n-k)!) |
| Arrangements | A(n,k) = n! / (n-k)! |
| Permutations | P(n) = n! |

### How to Use

1. Select the type of calculation from the list
2. Enter the values of n and k (if required)
3. Click "Calculate"
4. Get the result with intermediate calculations

### Limitations

Factorials grow rapidly: 20! already exceeds 2 quintillion. The calculator supports computations up to 170!, after which the number exceeds the standard representation limit.

See also: [Prime Number Checker](/tools/prime-checker), [GCD and LCM](/tools/gcd-lcm), [Statistics](/tools/statistics-calc)`
  },
  {
    slug: 'factorial-calc-tips',
    title: 'Советы по решению комбинаторных задач',
    description: 'Как правильно определять тип комбинаторной задачи и выбирать формулу для решения.',
    toolSlug: 'factorial-calc',
    type: 'tips',
    keywords: ['комбинаторика', 'советы', 'задачи', 'формулы'],
    date: '2026-02-05',
    readTime: 5,
    content: `## Советы по решению комбинаторных задач

Главная сложность комбинаторики — определить, какую формулу применять. Эти советы помогут разобраться.

### Задайте два ключевых вопроса

1. **Важен ли порядок?** Если да — это размещения или перестановки. Если нет — сочетания.
2. **Все ли элементы используются?** Если да — перестановки. Если выбираем часть — сочетания или размещения.

### Запомните простые примеры

- Сколько способов расставить 5 книг на полке? → Перестановки: P(5) = 120
- Сколько способов выбрать 3 книги из 10? → Сочетания: C(10,3) = 120
- Сколько трёхзначных кодов из цифр 1-9? → Размещения: A(9,3) = 504

### Используйте правило произведения

Если задача состоит из нескольких независимых этапов, перемножьте количество вариантов на каждом этапе.

### Проверяйте ответ здравым смыслом

Результат не может быть больше, чем общее число всех возможных перестановок. Если C(n,k) > P(n), значит где-то ошибка.

### Не путайте с повторениями и без

Размещения с повторениями (nᵏ) и без повторений (A(n,k)) — разные формулы. Определите, допускается ли повторный выбор.

### Используйте свойство симметрии сочетаний

C(n,k) = C(n, n-k). Выбрать 2 из 10 — то же самое, что отбросить 8 из 10. Это упрощает вычисления при больших k.

Смотрите также: [Проверка простых чисел](/tools/prime-checker), [Статистика](/tools/statistics-calc), [Решатель уравнений](/tools/equation-solver)`,
    titleEn: 'Tips for Solving Combinatorics Problems',
    descriptionEn: 'How to correctly identify the type of combinatorics problem and choose the right formula.',
    contentEn: `## Tips for Solving Combinatorics Problems

The main difficulty in combinatorics is determining which formula to apply. These tips will help you figure it out.

### Ask Two Key Questions

1. **Does order matter?** If yes — it's arrangements or permutations. If no — combinations.
2. **Are all elements used?** If yes — permutations. If selecting a subset — combinations or arrangements.

### Remember Simple Examples

- How many ways to arrange 5 books on a shelf? → Permutations: P(5) = 120
- How many ways to choose 3 books from 10? → Combinations: C(10,3) = 120
- How many three-digit codes from digits 1-9? → Arrangements: A(9,3) = 504

### Use the Multiplication Principle

If a problem consists of several independent stages, multiply the number of options at each stage.

### Check the Answer with Common Sense

The result cannot be greater than the total number of all possible permutations. If C(n,k) > P(n), there's an error somewhere.

### Don't Confuse With and Without Repetition

Arrangements with repetition (n^k) and without repetition (A(n,k)) use different formulas. Determine whether repeated selection is allowed.

### Use the Symmetry Property of Combinations

C(n,k) = C(n, n-k). Choosing 2 from 10 is the same as discarding 8 from 10. This simplifies calculations for large k.

See also: [Prime Number Checker](/tools/prime-checker), [Statistics](/tools/statistics-calc), [Equation Solver](/tools/equation-solver)`
  },
  {
    slug: 'factorial-calc-use-cases',
    title: 'Комбинаторика в жизни: от лотерей до паролей',
    description: 'Практические примеры применения комбинаторных вычислений в повседневных ситуациях.',
    toolSlug: 'factorial-calc',
    type: 'use-cases',
    keywords: ['комбинаторика', 'применение', 'вероятность', 'пароли'],
    date: '2026-02-28',
    readTime: 5,
    content: `## Комбинаторика в повседневной жизни

Комбинаторные формулы помогают оценить количество возможных вариантов в самых разных ситуациях.

### Безопасность паролей

Пароль из 8 символов (строчные + заглавные буквы + цифры) имеет 62⁸ ≈ 218 триллионов комбинаций. Добавление спецсимволов увеличивает это число многократно.

### Лотереи и азартные игры

Вероятность угадать 6 чисел из 45 равна 1/C(45,6) = 1/8 145 060. Это помогает понять, насколько малы шансы на выигрыш.

### Составление расписания

- Сколько способов распределить 5 предметов по 5 дням? → 120 вариантов
- Сколько способов выбрать 3 дежурных из 20 человек? → 1140 вариантов

### Генетика

Количество возможных комбинаций генов определяется комбинаторными формулами. Это объясняет генетическое разнообразие.

### Спортивные турниры

Количество матчей в турнире «каждый с каждым» для n команд вычисляется как C(n,2). Для 16 команд это 120 матчей.

### Кулинария

Если в меню 4 закуски, 6 основных блюд и 3 десерта, то количество уникальных обедов из трёх блюд: 4 × 6 × 3 = 72 варианта.

Комбинаторика помогает оценить масштаб задачи и понять, возможно ли перебрать все варианты или нужен оптимизационный подход.

Смотрите также: [Статистика](/tools/statistics-calc), [Проверка простых чисел](/tools/prime-checker), [НОД и НОК](/tools/gcd-lcm)`,
    titleEn: 'Combinatorics in Life: From Lotteries to Passwords',
    descriptionEn: 'Practical examples of applying combinatorics calculations in everyday situations.',
    contentEn: `## Combinatorics in Everyday Life

Combinatorics formulas help estimate the number of possible options in a variety of situations.

### Password Security

A password of 8 characters (lowercase + uppercase letters + digits) has 62^8 ≈ 218 trillion combinations. Adding special characters increases this number significantly.

### Lotteries and Gambling

The probability of guessing 6 numbers out of 45 is 1/C(45,6) = 1/8,145,060. This helps understand how slim the chances of winning are.

### Scheduling

- How many ways to distribute 5 subjects across 5 days? → 120 options
- How many ways to choose 3 duty officers from 20 people? → 1140 options

### Genetics

The number of possible gene combinations is determined by combinatorics formulas. This explains genetic diversity.

### Sports Tournaments

The number of matches in a round-robin tournament for n teams is calculated as C(n,2). For 16 teams, that's 120 matches.

### Cooking

If a menu has 4 appetizers, 6 main courses, and 3 desserts, the number of unique three-course meals is 4 × 6 × 3 = 72 options.

Combinatorics helps estimate the scale of a problem and understand whether it's possible to enumerate all options or whether an optimization approach is needed.

See also: [Statistics](/tools/statistics-calc), [Prime Number Checker](/tools/prime-checker), [GCD and LCM](/tools/gcd-lcm)`
  },

  // === roman-numerals (Римские числа) ===
  {
    slug: 'roman-numerals-guide',
    title: 'Руководство по конвертеру римских чисел',
    description: 'Как переводить числа из арабской системы в римскую и обратно с помощью онлайн-конвертера.',
    toolSlug: 'roman-numerals',
    type: 'guide',
    keywords: ['римские числа', 'конвертер', 'нумерация', 'перевод'],
    date: '2026-01-28',
    readTime: 4,
    content: `## Конвертер римских чисел

Инструмент позволяет переводить числа между арабской и римской системами записи. Поддерживается диапазон от 1 до 3999.

### Основные символы римской нумерации

| Римская | Арабская |
|---|---|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1000 |

### Правила записи

1. Символы записываются от большего к меньшему слева направо
2. Одинаковые символы можно повторять не более 3 раз подряд
3. Если меньший символ стоит перед большим — он вычитается (IV = 4, IX = 9)
4. Вычитание применяется только для I, X и C

### Как пользоваться конвертером

- Для перевода в римские: введите арабское число от 1 до 3999
- Для перевода в арабские: введите римское число (например, MCMXCIV)
- Результат отображается мгновенно при вводе

### Примеры преобразования

- 2024 → MMXXIV
- 1999 → MCMXCIX
- 3888 → MMMDCCCLXXXVIII (самое длинное число до 3999)

Смотрите также: [Проверка простых чисел](/tools/prime-checker), [Калькулятор дробей](/tools/fraction-calc), [НОД и НОК](/tools/gcd-lcm)`,
    titleEn: 'Roman Numeral Converter Guide',
    descriptionEn: 'How to convert numbers between Arabic and Roman numeral systems using the online converter.',
    contentEn: `## Roman Numeral Converter

The tool allows you to convert numbers between Arabic and Roman numeral systems. The supported range is from 1 to 3999.

### Basic Roman Numeral Symbols

| Roman | Arabic |
|---|---|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1000 |

### Writing Rules

1. Symbols are written from largest to smallest, left to right
2. The same symbol can be repeated no more than 3 times in a row
3. If a smaller symbol precedes a larger one, it is subtracted (IV = 4, IX = 9)
4. Subtraction applies only to I, X, and C

### How to Use the Converter

- To convert to Roman: enter an Arabic number from 1 to 3999
- To convert to Arabic: enter a Roman number (e.g., MCMXCIV)
- The result is displayed instantly as you type

### Conversion Examples

- 2024 → MMXXIV
- 1999 → MCMXCIX
- 3888 → MMMDCCCLXXXVIII (the longest number up to 3999)

See also: [Prime Number Checker](/tools/prime-checker), [Fraction Calculator](/tools/fraction-calc), [GCD and LCM](/tools/gcd-lcm)`
  },
  {
    slug: 'roman-numerals-tips',
    title: 'Советы по запоминанию римских чисел',
    description: 'Мнемонические приёмы и хитрости для быстрого чтения и записи римских чисел.',
    toolSlug: 'roman-numerals',
    type: 'tips',
    keywords: ['римские числа', 'запоминание', 'мнемоника', 'советы'],
    date: '2026-02-18',
    readTime: 4,
    content: `## Как быстро запомнить римские числа

Римская нумерация кажется сложной, но несколько приёмов помогут освоить её за считанные минуты.

### Мнемоническое правило

Запомните фразу для основных символов в порядке убывания: **М**ы **D**арим **С**очные **L**имоны, **Х**ватит **V**сем **I** каждому. Это MDCLXVI = 1000, 500, 100, 50, 10, 5, 1.

### Правило вычитания — только 6 случаев

Запомните всего шесть комбинаций с вычитанием:
- IV = 4, IX = 9
- XL = 40, XC = 90
- CD = 400, CM = 900

### Читайте число по частям

Разбивайте длинное число на группы по разрядам: MCMXCIV = M + CM + XC + IV = 1000 + 900 + 90 + 4 = 1994.

### Проверяйте корректность

Если в числе встречается IIII, VV, LL, DD — запись некорректна. Символы V, L и D никогда не повторяются.

### Используйте часы с римским циферблатом

Практикуйтесь, определяя время по часам с римскими цифрами. Обратите внимание: на многих часах 4 обозначается как IIII, а не IV — это историческая традиция.

### Запомните ключевые годы

Несколько известных дат в римских числах помогут закрепить навык: MCMLXIX (1969, высадка на Луну), MMXXVI (2026, текущий год).

Смотрите также: [НОД и НОК](/tools/gcd-lcm), [Калькулятор дробей](/tools/fraction-calc), [Проверка простых чисел](/tools/prime-checker)`,
    titleEn: 'Tips for Memorizing Roman Numerals',
    descriptionEn: 'Mnemonic techniques and tricks for quickly reading and writing Roman numerals.',
    contentEn: `## How to Quickly Memorize Roman Numerals

Roman numeration seems complex, but a few techniques will help you master it in minutes.

### Mnemonic Rule

Remember a phrase for the main symbols in descending order: **M**y **D**ear **C**at **L**oves **X**tra **V**itamins **I**mmensely. That's MDCLXVI = 1000, 500, 100, 50, 10, 5, 1.

### Subtraction Rule — Only 6 Cases

Memorize just six subtraction combinations:
- IV = 4, IX = 9
- XL = 40, XC = 90
- CD = 400, CM = 900

### Read the Number in Parts

Break a long number into groups by place value: MCMXCIV = M + CM + XC + IV = 1000 + 900 + 90 + 4 = 1994.

### Check for Correctness

If a number contains IIII, VV, LL, DD — the notation is incorrect. Symbols V, L, and D are never repeated.

### Use a Clock with Roman Numerals

Practice telling time on clocks with Roman numerals. Note: many clocks show 4 as IIII rather than IV — this is a historical tradition.

### Remember Key Years

A few famous dates in Roman numerals help reinforce the skill: MCMLXIX (1969, Moon landing), MMXXVI (2026, current year).

See also: [GCD and LCM](/tools/gcd-lcm), [Fraction Calculator](/tools/fraction-calc), [Prime Number Checker](/tools/prime-checker)`
  },
  {
    slug: 'roman-numerals-use-cases',
    title: 'Где используются римские числа сегодня',
    description: 'Современные области применения римской нумерации: от часов до кинематографа.',
    toolSlug: 'roman-numerals',
    type: 'use-cases',
    keywords: ['римские числа', 'применение', 'культура', 'история'],
    date: '2026-03-05',
    readTime: 4,
    content: `## Римские числа в современном мире

Несмотря на возраст более двух тысяч лет, римская нумерация активно используется и сегодня.

### Нумерация глав и разделов

В книгах, научных работах и юридических документах главы и разделы часто нумеруются римскими цифрами. Это создаёт визуальное разделение уровней нумерации.

### Часы и циферблаты

Классические настенные и наручные часы традиционно используют римские цифры. Это придаёт дизайну элегантность и статусность.

### Кинематограф и телевидение

- Год производства фильма в титрах указывается римскими цифрами
- Номера частей франшиз: Star Wars Episode IV, Rocky III
- Номера сезонов сериалов

### Спорт

Суперкубок в американском футболе нумеруется римскими цифрами (Super Bowl LVIII). Олимпийские игры также используют эту нумерацию.

### Монархи и папы

Имена монархов и пап традиционно содержат римские числа: Елизавета II, Пётр I, Папа Франциск I.

### Архитектура и памятники

На фасадах зданий, памятниках и мемориальных досках даты часто выгравированы римскими цифрами. Это придаёт надписям торжественность.

### Музыка

Ступени гармонии и аккорды обозначаются римскими цифрами в теории музыки (I, IV, V — основные функции).

Смотрите также: [Проверка простых чисел](/tools/prime-checker), [Калькулятор дробей](/tools/fraction-calc), [Факториал и Комбинаторика](/tools/factorial-calc)`,
    titleEn: 'Where Roman Numerals Are Used Today',
    descriptionEn: 'Modern uses of Roman numeration: from clocks to cinema.',
    contentEn: `## Roman Numerals in the Modern World

Despite being over two thousand years old, Roman numeration is still actively used today.

### Chapter and Section Numbering

In books, academic papers, and legal documents, chapters and sections are often numbered with Roman numerals. This creates a visual separation of numbering levels.

### Clocks and Dials

Classic wall and wrist watches traditionally use Roman numerals. This gives the design elegance and a sense of prestige.

### Cinema and Television

- The production year in film credits is indicated in Roman numerals
- Franchise installment numbers: Star Wars Episode IV, Rocky III
- TV series season numbers

### Sports

The Super Bowl in American football is numbered with Roman numerals (Super Bowl LVIII). The Olympic Games also use this numbering.

### Monarchs and Popes

The names of monarchs and popes traditionally include Roman numerals: Elizabeth II, Peter I, Pope Francis I.

### Architecture and Monuments

On building facades, monuments, and memorial plaques, dates are often engraved in Roman numerals. This adds a sense of solemnity to inscriptions.

### Music

Scale degrees and chords are denoted with Roman numerals in music theory (I, IV, V — basic functions).

See also: [Prime Number Checker](/tools/prime-checker), [Fraction Calculator](/tools/fraction-calc), [Factorials and Combinatorics](/tools/factorial-calc)`
  },

  // === fraction-calc (Калькулятор дробей) ===
  {
    slug: 'fraction-calc-guide',
    title: 'Руководство по калькулятору дробей',
    description: 'Как выполнять арифметические операции с обыкновенными и десятичными дробями онлайн.',
    toolSlug: 'fraction-calc',
    type: 'guide',
    keywords: ['дроби', 'калькулятор', 'сложение дробей', 'обыкновенные дроби'],
    date: '2026-02-01',
    readTime: 6,
    content: `## Калькулятор дробей: полное руководство

Калькулятор дробей выполняет все арифметические операции с обыкновенными, смешанными и десятичными дробями.

### Поддерживаемые операции

- **Сложение** и **вычитание** дробей с разными знаменателями
- **Умножение** и **деление** дробей
- **Сокращение** дроби до несократимого вида
- **Перевод** между обыкновенными и десятичными дробями
- **Сравнение** двух дробей

### Как ввести дробь

1. Для обыкновенной дроби: введите числитель и знаменатель
2. Для смешанного числа: укажите целую часть, числитель и знаменатель
3. Для десятичной дроби: введите число с точкой

### Алгоритм сложения дробей

1. Найти общий знаменатель (НОК знаменателей)
2. Привести дроби к общему знаменателю
3. Сложить числители
4. Сократить результат

### Пример

Сложение 2/3 + 3/4:
- НОК(3, 4) = 12
- 2/3 = 8/12, 3/4 = 9/12
- 8/12 + 9/12 = 17/12 = 1 5/12

Калькулятор показывает каждый шаг решения и автоматически сокращает результат до несократимого вида.

Смотрите также: [НОД и НОК](/tools/gcd-lcm), [Решатель уравнений](/tools/equation-solver), [Калькулятор пропорций](/tools/proportion-calc)`,
    titleEn: 'Fraction Calculator Guide',
    descriptionEn: 'How to perform arithmetic operations with common and decimal fractions online.',
    contentEn: `## Fraction Calculator: Complete Guide

The fraction calculator performs all arithmetic operations with common, mixed, and decimal fractions.

### Supported Operations

- **Addition** and **subtraction** of fractions with different denominators
- **Multiplication** and **division** of fractions
- **Simplification** of fractions to lowest terms
- **Conversion** between common and decimal fractions
- **Comparison** of two fractions

### How to Enter a Fraction

1. For a common fraction: enter the numerator and denominator
2. For a mixed number: specify the whole part, numerator, and denominator
3. For a decimal fraction: enter the number with a period

### Fraction Addition Algorithm

1. Find the common denominator (LCM of the denominators)
2. Convert fractions to the common denominator
3. Add the numerators
4. Simplify the result

### Example

Adding 2/3 + 3/4:
- LCM(3, 4) = 12
- 2/3 = 8/12, 3/4 = 9/12
- 8/12 + 9/12 = 17/12 = 1 5/12

The calculator shows each step of the solution and automatically simplifies the result to lowest terms.

See also: [GCD and LCM](/tools/gcd-lcm), [Equation Solver](/tools/equation-solver), [Proportion Calculator](/tools/proportion-calc)`
  },
  {
    slug: 'fraction-calc-tips',
    title: 'Советы по работе с дробями без ошибок',
    description: 'Типичные ошибки при работе с дробями и способы их избежать.',
    toolSlug: 'fraction-calc',
    type: 'tips',
    keywords: ['дроби', 'ошибки', 'советы', 'математика'],
    date: '2026-02-22',
    readTime: 5,
    content: `## Как избежать ошибок при работе с дробями

Дроби — одна из тем, где допускается больше всего ошибок. Следуйте этим советам для точных вычислений.

### Не складывайте знаменатели

Самая распространённая ошибка: 1/2 + 1/3 ≠ 2/5. Правильно: найти общий знаменатель и привести к нему обе дроби.

### Помните правило деления

Деление на дробь — это умножение на перевёрнутую дробь. a/b ÷ c/d = a/b × d/c. Не забывайте переворачивать именно делитель.

### Сокращайте до вычислений

При умножении дробей сначала сократите «крест-накрест». Это упрощает вычисления и уменьшает размер чисел.

### Переводите смешанные числа

Перед выполнением операций переведите смешанные числа в неправильные дроби. После вычислений можно перевести обратно.

### Проверяйте знак результата

При умножении и делении: одинаковые знаки дают плюс, разные — минус. Считайте количество отрицательных множителей.

### Используйте десятичное представление для проверки

Переведите дроби в десятичные числа и проверьте результат приблизительным вычислением. Если 2/3 ≈ 0.67 и 1/4 = 0.25, то сумма ≈ 0.92.

### Не забывайте про ОДЗ

Знаменатель дроби не может быть равен нулю. В алгебраических выражениях всегда проверяйте это условие.

Смотрите также: [НОД и НОК](/tools/gcd-lcm), [Калькулятор пропорций](/tools/proportion-calc), [Решатель уравнений](/tools/equation-solver)`,
    titleEn: 'Tips for Working with Fractions Without Mistakes',
    descriptionEn: 'Common mistakes when working with fractions and how to avoid them.',
    contentEn: `## How to Avoid Mistakes When Working with Fractions

Fractions are one of the topics where the most mistakes are made. Follow these tips for accurate calculations.

### Don't Add the Denominators

The most common mistake: 1/2 + 1/3 ≠ 2/5. Correct approach: find a common denominator and convert both fractions to it.

### Remember the Division Rule

Dividing by a fraction means multiplying by the reciprocal. a/b ÷ c/d = a/b × d/c. Don't forget to flip the divisor specifically.

### Simplify Before Calculating

When multiplying fractions, first cross-cancel. This simplifies the calculations and keeps the numbers smaller.

### Convert Mixed Numbers

Before performing operations, convert mixed numbers to improper fractions. You can convert back after the calculations.

### Check the Sign of the Result

For multiplication and division: same signs give positive, different signs give negative. Count the number of negative factors.

### Use Decimal Representation for Verification

Convert fractions to decimals and verify the result with an approximate calculation. If 2/3 ≈ 0.67 and 1/4 = 0.25, then the sum ≈ 0.92.

### Don't Forget Domain Restrictions

The denominator of a fraction cannot equal zero. In algebraic expressions, always check this condition.

See also: [GCD and LCM](/tools/gcd-lcm), [Proportion Calculator](/tools/proportion-calc), [Equation Solver](/tools/equation-solver)`
  },
  {
    slug: 'fraction-calc-use-cases',
    title: 'Дроби в повседневной жизни: практические примеры',
    description: 'Как дроби используются в кулинарии, строительстве, музыке и других областях.',
    toolSlug: 'fraction-calc',
    type: 'use-cases',
    keywords: ['дроби', 'применение', 'кулинария', 'строительство'],
    date: '2026-03-08',
    readTime: 5,
    content: `## Дроби вокруг нас

Дроби встречаются в повседневной жизни гораздо чаще, чем кажется. Вот основные области их применения.

### Кулинария

Рецепты часто содержат дробные количества: 3/4 стакана муки, 1/2 чайной ложки соли. При изменении количества порций нужно пересчитывать дроби.

### Строительство и ремонт

- Разметка и измерения (5 3/8 метра)
- Расчёт расхода материалов на дробную площадь
- Деление пространства на равные части

### Музыка

Длительности нот выражаются дробями: целая, половинная (1/2), четвертная (1/4), восьмая (1/8). Музыкальные размеры — это тоже дроби: 3/4, 6/8.

### Финансы

- Доли акций и процентные ставки
- Расчёт налогов (1/5 от суммы = 20%)
- Распределение прибыли между партнёрами

### Время

Мы постоянно оперируем дробями времени: четверть часа (1/4), полчаса (1/2), три четверти часа (3/4).

### Шитьё и рукоделие

Выкройки содержат дробные размеры. Припуски на швы выражаются в долях сантиметра.

Понимание дробей — это базовый навык, необходимый каждому для решения бытовых задач и профессиональной деятельности.

Смотрите также: [Калькулятор пропорций](/tools/proportion-calc), [НОД и НОК](/tools/gcd-lcm), [Статистика](/tools/statistics-calc)`,
    titleEn: 'Fractions in Everyday Life: Practical Examples',
    descriptionEn: 'How fractions are used in cooking, construction, music, and other areas.',
    contentEn: `## Fractions All Around Us

Fractions appear in everyday life much more often than you might think. Here are the main areas where they're used.

### Cooking

Recipes often contain fractional amounts: 3/4 cup of flour, 1/2 teaspoon of salt. When changing the number of servings, you need to recalculate the fractions.

### Construction and Renovation

- Marking and measurements (5 3/8 meters)
- Calculating material consumption for fractional areas
- Dividing space into equal parts

### Music

Note durations are expressed as fractions: whole, half (1/2), quarter (1/4), eighth (1/8). Time signatures are also fractions: 3/4, 6/8.

### Finance

- Stock shares and interest rates
- Tax calculation (1/5 of the amount = 20%)
- Distributing profits among partners

### Time

We constantly work with fractions of time: quarter of an hour (1/4), half an hour (1/2), three quarters of an hour (3/4).

### Sewing and Crafts

Patterns contain fractional measurements. Seam allowances are expressed in fractions of a centimeter.

Understanding fractions is a basic skill that everyone needs for everyday tasks and professional work.

See also: [Proportion Calculator](/tools/proportion-calc), [GCD and LCM](/tools/gcd-lcm), [Statistics](/tools/statistics-calc)`
  },

  // === graph-plotter (Построитель графиков) ===
  {
    slug: 'graph-plotter-guide',
    title: 'Руководство по построителю графиков функций',
    description: 'Как строить графики математических функций онлайн: линейные, квадратичные, тригонометрические.',
    toolSlug: 'graph-plotter',
    type: 'guide',
    keywords: ['графики', 'функции', 'построение', 'координатная плоскость'],
    date: '2026-01-30',
    readTime: 7,
    content: `## Построитель графиков функций

Инструмент для визуализации математических функций на координатной плоскости. Поддерживает одновременное построение нескольких графиков.

### Поддерживаемые типы функций

- **Линейные**: y = kx + b
- **Квадратичные**: y = ax² + bx + c
- **Кубические**: y = ax³ + bx² + cx + d
- **Тригонометрические**: sin(x), cos(x), tan(x)
- **Показательные**: y = aˣ, y = eˣ
- **Логарифмические**: y = log(x), y = ln(x)

### Как построить график

1. Введите формулу функции в поле ввода
2. Используйте стандартные обозначения: x для переменной, ^ для степени
3. Настройте масштаб осей при необходимости
4. Добавьте дополнительные функции для сравнения

### Настройки отображения

- Изменение диапазона осей X и Y
- Включение и отключение сетки
- Выбор цвета для каждого графика
- Отображение точек пересечения с осями

### Анализ графика

Инструмент автоматически определяет ключевые точки: нули функции, экстремумы и точки перегиба. Наведите курсор на график, чтобы увидеть координаты любой точки.

Построитель графиков незаменим для изучения свойств функций и визуального анализа математических зависимостей.

Смотрите также: [Решатель уравнений](/tools/equation-solver), [Статистика](/tools/statistics-calc), [Калькулятор пропорций](/tools/proportion-calc)`,
    titleEn: 'Function Graph Plotter Guide',
    descriptionEn: 'How to plot mathematical function graphs online: linear, quadratic, and trigonometric.',
    contentEn: `## Function Graph Plotter

A tool for visualizing mathematical functions on a coordinate plane. Supports plotting multiple graphs simultaneously.

### Supported Function Types

- **Linear**: y = kx + b
- **Quadratic**: y = ax² + bx + c
- **Cubic**: y = ax³ + bx² + cx + d
- **Trigonometric**: sin(x), cos(x), tan(x)
- **Exponential**: y = a^x, y = e^x
- **Logarithmic**: y = log(x), y = ln(x)

### How to Plot a Graph

1. Enter the function formula in the input field
2. Use standard notation: x for the variable, ^ for exponentiation
3. Adjust the axis scale as needed
4. Add additional functions for comparison

### Display Settings

- Adjusting X and Y axis ranges
- Toggling the grid on and off
- Choosing colors for each graph
- Displaying intersection points with axes

### Graph Analysis

The tool automatically identifies key points: function zeros, extrema, and inflection points. Hover over the graph to see the coordinates of any point.

The graph plotter is indispensable for studying function properties and visual analysis of mathematical relationships.

See also: [Equation Solver](/tools/equation-solver), [Statistics](/tools/statistics-calc), [Proportion Calculator](/tools/proportion-calc)`
  },
  {
    slug: 'graph-plotter-tips',
    title: 'Советы по эффективному построению графиков',
    description: 'Как правильно настраивать масштаб, выбирать тип функции и анализировать графики.',
    toolSlug: 'graph-plotter',
    type: 'tips',
    keywords: ['графики', 'советы', 'масштаб', 'анализ'],
    date: '2026-02-12',
    readTime: 5,
    content: `## Советы по построению графиков

Правильно построенный график — мощный инструмент анализа. Следуйте этим рекомендациям.

### Выбирайте правильный масштаб

Слишком большой масштаб скрывает детали, слишком маленький — искажает общую форму. Начните с диапазона [-10, 10] и корректируйте по необходимости.

### Используйте несколько графиков

Для решения уравнения f(x) = g(x) постройте оба графика на одной плоскости. Точки пересечения — это решения.

### Обращайте внимание на область определения

Не все функции определены для всех x. Например, ln(x) существует только при x > 0, а tan(x) имеет разрывы.

### Ищите симметрию

- Чётные функции симметричны относительно оси Y
- Нечётные функции симметричны относительно начала координат
- Это помогает проверить правильность построения

### Используйте производную

Если функция возрастает, её производная положительна. Точки, где производная равна нулю, — это экстремумы или точки перегиба.

### Сравнивайте с эталоном

При изучении трансформаций постройте базовую функцию (например, y = x²) и её модификацию рядом. Так легче увидеть эффект параметров.

### Проверяйте характерные точки

Подставьте x = 0, x = 1, x = -1 в формулу и убедитесь, что график проходит через полученные точки.

Смотрите также: [Решатель уравнений](/tools/equation-solver), [Статистика](/tools/statistics-calc), [Калькулятор матриц](/tools/matrix-calc)`,
    titleEn: 'Tips for Effective Graph Plotting',
    descriptionEn: 'How to properly set the scale, choose the function type, and analyze graphs.',
    contentEn: `## Tips for Plotting Graphs

A well-constructed graph is a powerful analysis tool. Follow these recommendations.

### Choose the Right Scale

Too large a scale hides details; too small a scale distorts the overall shape. Start with a range of [-10, 10] and adjust as needed.

### Use Multiple Graphs

To solve the equation f(x) = g(x), plot both graphs on the same plane. The intersection points are the solutions.

### Pay Attention to the Domain

Not all functions are defined for all x. For example, ln(x) exists only for x > 0, and tan(x) has discontinuities.

### Look for Symmetry

- Even functions are symmetric about the Y-axis
- Odd functions are symmetric about the origin
- This helps verify the correctness of the plot

### Use the Derivative

If the function is increasing, its derivative is positive. Points where the derivative equals zero are extrema or inflection points.

### Compare with a Reference

When studying transformations, plot the base function (e.g., y = x²) and its modification side by side. This makes it easier to see the effect of parameters.

### Check Key Points

Substitute x = 0, x = 1, x = -1 into the formula and make sure the graph passes through the resulting points.

See also: [Equation Solver](/tools/equation-solver), [Statistics](/tools/statistics-calc), [Matrix Calculator](/tools/matrix-calc)`
  },
  {
    slug: 'graph-plotter-use-cases',
    title: 'Графики функций: где и зачем они нужны',
    description: 'Практические применения визуализации функций в науке, экономике и инженерии.',
    toolSlug: 'graph-plotter',
    type: 'use-cases',
    keywords: ['графики', 'визуализация', 'наука', 'экономика'],
    date: '2026-03-03',
    readTime: 6,
    content: `## Применение графиков функций

Графики — это универсальный инструмент визуализации зависимостей, используемый практически во всех областях знаний.

### Физика

Графики помогают визуализировать законы движения, колебания, волновые процессы. Зависимость пути от времени, скорости от ускорения — всё это наглядно представляется графически.

### Экономика и бизнес

- Кривые спроса и предложения
- График безубыточности
- Динамика продаж и прогнозирование
- Функция полезности

### Биология и медицина

Кривые роста популяций (логистическая функция), фармакокинетика лекарств (концентрация вещества в крови от времени), эпидемиологические модели.

### Инженерия

- Амплитудно-частотные характеристики
- Графики напряжений и деформаций
- Переходные процессы в электрических цепях

### Образование

Графики незаменимы при изучении математики. Визуальное представление функций помогает интуитивно понять их свойства.

### Анализ данных

Регрессионный анализ — построение графика, наилучшим образом аппроксимирующего экспериментальные данные. Это основа предсказательной аналитики.

Умение строить и интерпретировать графики — ключевой навык для специалистов во всех технических и экономических областях.

Смотрите также: [Статистика](/tools/statistics-calc), [Решатель уравнений](/tools/equation-solver), [Калькулятор матриц](/tools/matrix-calc)`,
    titleEn: 'Function Graphs: Where and Why They Are Needed',
    descriptionEn: 'Practical applications of function visualization in science, economics, and engineering.',
    contentEn: `## Applications of Function Graphs

Graphs are a universal tool for visualizing relationships, used in virtually every field of knowledge.

### Physics

Graphs help visualize laws of motion, oscillations, and wave processes. The relationship between distance and time, speed and acceleration — all of these are clearly represented graphically.

### Economics and Business

- Supply and demand curves
- Break-even charts
- Sales dynamics and forecasting
- Utility functions

### Biology and Medicine

Population growth curves (logistic function), drug pharmacokinetics (substance concentration in blood over time), and epidemiological models.

### Engineering

- Amplitude-frequency characteristics
- Stress and strain graphs
- Transient processes in electrical circuits

### Education

Graphs are indispensable for studying mathematics. Visual representation of functions helps intuitively understand their properties.

### Data Analysis

Regression analysis — plotting the graph that best approximates experimental data. This is the foundation of predictive analytics.

The ability to plot and interpret graphs is a key skill for professionals in all technical and economic fields.

See also: [Statistics](/tools/statistics-calc), [Equation Solver](/tools/equation-solver), [Matrix Calculator](/tools/matrix-calc)`
  },

  // === gcd-lcm (НОД и НОК) ===
  {
    slug: 'gcd-lcm-guide',
    title: 'Руководство по вычислению НОД и НОК',
    description: 'Как находить наибольший общий делитель и наименьшее общее кратное с помощью онлайн-калькулятора.',
    toolSlug: 'gcd-lcm',
    type: 'guide',
    keywords: ['НОД', 'НОК', 'делитель', 'кратное', 'алгоритм Евклида'],
    date: '2026-02-04',
    readTime: 5,
    content: `## Калькулятор НОД и НОК

Инструмент вычисляет наибольший общий делитель (НОД) и наименьшее общее кратное (НОК) для двух и более чисел.

### Что такое НОД и НОК

- **НОД** — наибольшее число, на которое делятся все заданные числа без остатка
- **НОК** — наименьшее число, которое делится на все заданные числа без остатка

### Методы вычисления

**Алгоритм Евклида** для НОД:
1. Делим большее число на меньшее
2. Если остаток равен нулю — меньшее число и есть НОД
3. Иначе заменяем большее число на меньшее, а меньшее на остаток
4. Повторяем до получения остатка, равного нулю

**Связь НОД и НОК:**
НОК(a, b) = (a × b) / НОД(a, b)

### Как пользоваться

1. Введите два или более числа через запятую
2. Нажмите «Рассчитать»
3. Получите НОД и НОК с пошаговым решением

### Примеры

| Числа | НОД | НОК |
|---|---|---|
| 12 и 18 | 6 | 36 |
| 24 и 36 | 12 | 72 |
| 15, 25 и 35 | 5 | 525 |

Калькулятор также показывает разложение каждого числа на простые множители, что помогает понять природу НОД и НОК.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Проверка простых чисел](/tools/prime-checker), [Факториал и Комбинаторика](/tools/factorial-calc)`,
    titleEn: 'GCD and LCM Calculator Guide',
    descriptionEn: 'How to find the greatest common divisor and least common multiple using the online calculator.',
    contentEn: `## GCD and LCM Calculator

A tool that calculates the greatest common divisor (GCD) and least common multiple (LCM) for two or more numbers.

### What Are GCD and LCM

- **GCD** — the largest number that divides all given numbers without a remainder
- **LCM** — the smallest number that is divisible by all given numbers without a remainder

### Calculation Methods

**Euclidean Algorithm** for GCD:
1. Divide the larger number by the smaller
2. If the remainder is zero — the smaller number is the GCD
3. Otherwise, replace the larger number with the smaller, and the smaller with the remainder
4. Repeat until the remainder equals zero

**GCD and LCM Relationship:**
LCM(a, b) = (a × b) / GCD(a, b)

### How to Use

1. Enter two or more numbers separated by commas
2. Click "Calculate"
3. Get the GCD and LCM with a step-by-step solution

### Examples

| Numbers | GCD | LCM |
|---|---|---|
| 12 and 18 | 6 | 36 |
| 24 and 36 | 12 | 72 |
| 15, 25, and 35 | 5 | 525 |

The calculator also shows the prime factorization of each number, which helps understand the nature of the GCD and LCM.

See also: [Fraction Calculator](/tools/fraction-calc), [Prime Number Checker](/tools/prime-checker), [Factorials and Combinatorics](/tools/factorial-calc)`
  },
  {
    slug: 'gcd-lcm-tips',
    title: 'Советы по нахождению НОД и НОК быстро',
    description: 'Приёмы для быстрого устного вычисления НОД и НОК без калькулятора.',
    toolSlug: 'gcd-lcm',
    type: 'tips',
    keywords: ['НОД', 'НОК', 'быстрое вычисление', 'советы'],
    date: '2026-02-25',
    readTime: 4,
    content: `## Быстрое вычисление НОД и НОК

Эти приёмы помогут находить НОД и НОК даже без калькулятора.

### Начинайте с малых делителей

Проверяйте делимость последовательно: на 2, на 3, на 5, на 7. Для большинства задач этого достаточно.

### Признаки делимости

- На 2: последняя цифра чётная
- На 3: сумма цифр делится на 3
- На 5: оканчивается на 0 или 5
- На 9: сумма цифр делится на 9
- На 4: последние две цифры делятся на 4

### Используйте разложение на множители

Разложите оба числа на простые множители. НОД — произведение общих множителей, НОК — произведение всех множителей в наибольших степенях.

### НОД взаимно простых чисел

Если два числа взаимно просты (не имеют общих делителей кроме 1), их НОД = 1, а НОК = их произведению.

### НОК для нахождения общего знаменателя

При сложении дробей общий знаменатель — это НОК знаменателей. Не берите просто произведение — НОК часто меньше.

### Проверяйте результат

НОД не может быть больше меньшего из чисел. НОК не может быть меньше большего из чисел. Используйте эти ограничения для проверки.

### Свойство для трёх чисел

НОД(a, b, c) = НОД(НОД(a, b), c). Вычисляйте последовательно для пар — это проще, чем работать сразу с тремя числами.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Проверка простых чисел](/tools/prime-checker), [Римские числа](/tools/roman-numerals)`,
    titleEn: 'Tips for Finding GCD and LCM Quickly',
    descriptionEn: 'Techniques for quickly calculating GCD and LCM mentally without a calculator.',
    contentEn: `## Quick GCD and LCM Calculation

These techniques will help you find GCD and LCM even without a calculator.

### Start with Small Divisors

Check divisibility sequentially: by 2, by 3, by 5, by 7. For most problems, this is sufficient.

### Divisibility Rules

- By 2: the last digit is even
- By 3: the sum of digits is divisible by 3
- By 5: ends in 0 or 5
- By 9: the sum of digits is divisible by 9
- By 4: the last two digits are divisible by 4

### Use Prime Factorization

Factor both numbers into primes. The GCD is the product of common factors; the LCM is the product of all factors at their highest powers.

### GCD of Coprime Numbers

If two numbers are coprime (share no common divisors other than 1), their GCD = 1 and their LCM = their product.

### LCM for Finding Common Denominators

When adding fractions, the common denominator is the LCM of the denominators. Don't just take the product — the LCM is often smaller.

### Verify the Result

The GCD cannot be larger than the smaller of the numbers. The LCM cannot be smaller than the larger of the numbers. Use these constraints for verification.

### Property for Three Numbers

GCD(a, b, c) = GCD(GCD(a, b), c). Calculate sequentially for pairs — it's simpler than working with three numbers at once.

See also: [Fraction Calculator](/tools/fraction-calc), [Prime Number Checker](/tools/prime-checker), [Roman Numerals](/tools/roman-numerals)`
  },
  {
    slug: 'gcd-lcm-use-cases',
    title: 'НОД и НОК: практическое применение',
    description: 'Реальные задачи, где необходимо вычисление наибольшего общего делителя и наименьшего общего кратного.',
    toolSlug: 'gcd-lcm',
    type: 'use-cases',
    keywords: ['НОД', 'НОК', 'задачи', 'применение'],
    date: '2026-03-07',
    readTime: 5,
    content: `## Практическое применение НОД и НОК

НОД и НОК — не просто абстрактные понятия. Они решают конкретные практические задачи.

### Укладка плитки

Какой наибольший размер квадратной плитки можно уложить на пол размером 360 × 480 см без подрезки? Ответ: НОД(360, 480) = 120 см.

### Синхронизация событий

Два светофора переключаются с интервалами 40 и 60 секунд. Через сколько секунд они снова совпадут? Ответ: НОК(40, 60) = 120 секунд.

### Работа с дробями

При сложении дробей с разными знаменателями НОК знаменателей даёт наименьший общий знаменатель. Это делает вычисления проще.

### Распределение предметов

Нужно разделить 48 яблок и 36 апельсинов поровну на максимальное число корзин. НОД(48, 36) = 12 корзин, по 4 яблока и 3 апельсина.

### Музыка и ритм

Полиритмы в музыке описываются через НОК. Два ритма с периодами 3 и 4 удара совпадут через НОК(3, 4) = 12 ударов.

### Шестерёнки и механизмы

Две шестерёнки с 24 и 36 зубцами. Через сколько оборотов малой шестерёнки они вернутся в исходное положение? НОК(24, 36) / 24 = 3 оборота.

### Расписание и планирование

Автобусы отправляются каждые 15 и 20 минут. НОК(15, 20) = 60 — они совпадут каждый час.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Проверка простых чисел](/tools/prime-checker), [Калькулятор пропорций](/tools/proportion-calc)`,
    titleEn: 'GCD and LCM: Practical Applications',
    descriptionEn: 'Real-world problems that require calculating the greatest common divisor and least common multiple.',
    contentEn: `## Practical Applications of GCD and LCM

GCD and LCM are not just abstract concepts. They solve specific practical problems.

### Tile Laying

What is the largest square tile that can be laid on a floor measuring 360 × 480 cm without cutting? Answer: GCD(360, 480) = 120 cm.

### Event Synchronization

Two traffic lights switch at intervals of 40 and 60 seconds. After how many seconds will they coincide again? Answer: LCM(40, 60) = 120 seconds.

### Working with Fractions

When adding fractions with different denominators, the LCM of the denominators gives the lowest common denominator. This makes calculations simpler.

### Distributing Items

You need to divide 48 apples and 36 oranges equally into the maximum number of baskets. GCD(48, 36) = 12 baskets, with 4 apples and 3 oranges each.

### Music and Rhythm

Polyrhythms in music are described using LCM. Two rhythms with periods of 3 and 4 beats will coincide after LCM(3, 4) = 12 beats.

### Gears and Mechanisms

Two gears with 24 and 36 teeth. After how many rotations of the small gear will they return to their starting position? LCM(24, 36) / 24 = 3 rotations.

### Scheduling and Planning

Buses depart every 15 and 20 minutes. LCM(15, 20) = 60 — they will coincide every hour.

See also: [Fraction Calculator](/tools/fraction-calc), [Prime Number Checker](/tools/prime-checker), [Proportion Calculator](/tools/proportion-calc)`
  },

  // === prime-checker (Проверка простых чисел) ===
  {
    slug: 'prime-checker-guide',
    title: 'Руководство по проверке простых чисел',
    description: 'Как проверить, является ли число простым, и найти все простые числа в заданном диапазоне.',
    toolSlug: 'prime-checker',
    type: 'guide',
    keywords: ['простые числа', 'проверка', 'факторизация', 'решето Эратосфена'],
    date: '2026-02-07',
    readTime: 6,
    content: `## Проверка простых чисел

Инструмент определяет, является ли число простым, выполняет факторизацию и находит простые числа в диапазоне.

### Что такое простое число

Простое число — натуральное число больше 1, которое делится только на 1 и на само себя. Первые простые числа: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.

### Возможности инструмента

- **Проверка простоты** — определение, является ли число простым
- **Факторизация** — разложение числа на простые множители
- **Решето Эратосфена** — поиск всех простых чисел до заданного числа
- **Ближайшие простые** — нахождение простых чисел рядом с заданным

### Как пользоваться

1. Введите число или диапазон в поле ввода
2. Выберите операцию: проверка, факторизация или поиск в диапазоне
3. Нажмите «Проверить»
4. Получите результат с объяснением

### Алгоритм проверки

Для проверки простоты достаточно проверить делимость на все простые числа до квадратного корня из проверяемого числа. Если ни одно не делит — число простое.

### Факторизация

Любое составное число можно единственным образом представить как произведение простых множителей. Например: 360 = 2³ × 3² × 5.

Смотрите также: [НОД и НОК](/tools/gcd-lcm), [Факториал и Комбинаторика](/tools/factorial-calc), [Римские числа](/tools/roman-numerals)`,
    titleEn: 'Prime Number Checker Guide',
    descriptionEn: 'How to check whether a number is prime and find all prime numbers within a given range.',
    contentEn: `## Prime Number Checker

The tool determines whether a number is prime, performs factorization, and finds prime numbers within a range.

### What Is a Prime Number

A prime number is a natural number greater than 1 that is divisible only by 1 and itself. The first prime numbers are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29.

### Tool Features

- **Primality check** — determining whether a number is prime
- **Factorization** — breaking a number into prime factors
- **Sieve of Eratosthenes** — finding all prime numbers up to a given number
- **Nearest primes** — finding prime numbers near a given number

### How to Use

1. Enter a number or range in the input field
2. Choose the operation: check, factorization, or range search
3. Click "Check"
4. Get the result with an explanation

### Checking Algorithm

To check primality, it is sufficient to test divisibility by all prime numbers up to the square root of the number being checked. If none divides it evenly, the number is prime.

### Factorization

Any composite number can be uniquely represented as a product of prime factors. For example: 360 = 2³ × 3² × 5.

See also: [GCD and LCM](/tools/gcd-lcm), [Factorials and Combinatorics](/tools/factorial-calc), [Roman Numerals](/tools/roman-numerals)`
  },
  {
    slug: 'prime-checker-tips',
    title: 'Советы по определению простых чисел',
    description: 'Быстрые способы проверки простоты числа и полезные свойства простых чисел.',
    toolSlug: 'prime-checker',
    type: 'tips',
    keywords: ['простые числа', 'советы', 'проверка', 'свойства'],
    date: '2026-02-16',
    readTime: 4,
    content: `## Советы по работе с простыми числами

Быстрое определение простоты числа — полезный навык. Эти приёмы помогут.

### Исключайте чётные числа

Все чётные числа, кроме 2, составные. Это сразу исключает половину всех чисел.

### Проверяйте делимость на малые простые

Для чисел до 100 достаточно проверить делимость на 2, 3, 5 и 7. Если число не делится ни на одно из них — оно простое.

### Используйте правило корня

Проверяйте делители только до квадратного корня из числа. Для числа 97 достаточно проверить делители до 9 (поскольку 10² = 100 > 97).

### Запомните простые числа до 100

Их всего 25: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97. Запомните хотя бы первые 15.

### Правило 6k ± 1

Все простые числа, кроме 2 и 3, имеют вид 6k - 1 или 6k + 1. Это значит, что простые числа находятся по соседству с числами, кратными 6.

### Числа Мерсенна

Числа вида 2ⁿ - 1 часто бывают простыми (при простом n). Это используется для поиска рекордно больших простых чисел.

### Не путайте с взаимно простыми

Два числа могут быть взаимно простыми (НОД = 1), даже если каждое из них составное. Например, 8 и 15 взаимно просты.

Смотрите также: [НОД и НОК](/tools/gcd-lcm), [Факториал и Комбинаторика](/tools/factorial-calc), [Калькулятор дробей](/tools/fraction-calc)`,
    titleEn: 'Tips for Identifying Prime Numbers',
    descriptionEn: 'Quick methods for checking primality and useful properties of prime numbers.',
    contentEn: `## Tips for Working with Prime Numbers

Quickly determining whether a number is prime is a useful skill. These techniques will help.

### Eliminate Even Numbers

All even numbers except 2 are composite. This immediately eliminates half of all numbers.

### Check Divisibility by Small Primes

For numbers up to 100, it's enough to check divisibility by 2, 3, 5, and 7. If the number is not divisible by any of them, it's prime.

### Use the Square Root Rule

Only check divisors up to the square root of the number. For the number 97, it's enough to check divisors up to 9 (since 10² = 100 > 97).

### Memorize Prime Numbers up to 100

There are only 25: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97. Memorize at least the first 15.

### The 6k ± 1 Rule

All prime numbers except 2 and 3 have the form 6k - 1 or 6k + 1. This means prime numbers are found adjacent to multiples of 6.

### Mersenne Numbers

Numbers of the form 2^n - 1 are often prime (when n is prime). This is used to search for record-breaking large prime numbers.

### Don't Confuse with Coprime Numbers

Two numbers can be coprime (GCD = 1) even if each of them is composite. For example, 8 and 15 are coprime.

See also: [GCD and LCM](/tools/gcd-lcm), [Factorials and Combinatorics](/tools/factorial-calc), [Fraction Calculator](/tools/fraction-calc)`
  },
  {
    slug: 'prime-checker-use-cases',
    title: 'Простые числа: от криптографии до природы',
    description: 'Удивительные применения простых чисел в криптографии, информатике и природе.',
    toolSlug: 'prime-checker',
    type: 'use-cases',
    keywords: ['простые числа', 'криптография', 'RSA', 'применение'],
    date: '2026-03-10',
    readTime: 6,
    content: `## Простые числа в реальном мире

Простые числа — основа современной информационной безопасности и одна из самых загадочных тем математики.

### Криптография и безопасность

Алгоритм RSA, защищающий интернет-транзакции, основан на сложности факторизации произведения двух больших простых чисел. Ваш банковский перевод защищён простыми числами.

### Хеш-таблицы в программировании

Простые числа используются как размеры хеш-таблиц для минимизации коллизий. Это ускоряет поиск данных в базах и программах.

### Цикады и эволюция

Периодические цикады появляются каждые 13 или 17 лет — оба числа простые. Это защищает их от синхронизации с жизненными циклами хищников.

### Штрих-коды и контрольные суммы

Системы проверки контрольных цифр (ISBN, штрих-коды) используют арифметику с простыми числами для обнаружения ошибок.

### Генерация случайных чисел

Генераторы псевдослучайных чисел часто используют большие простые числа в своих формулах для обеспечения длинного периода последовательности.

### Квантовые вычисления

Алгоритм Шора на квантовом компьютере способен быстро факторизовать большие числа. Это потенциальная угроза для RSA-шифрования и стимул для развития постквантовой криптографии.

Простые числа — один из фундаментальных объектов математики, их свойства продолжают открываться и находить новые применения.

Смотрите также: [НОД и НОК](/tools/gcd-lcm), [Факториал и Комбинаторика](/tools/factorial-calc), [Калькулятор матриц](/tools/matrix-calc)`,
    titleEn: 'Prime Numbers: From Cryptography to Nature',
    descriptionEn: 'Amazing applications of prime numbers in cryptography, computer science, and nature.',
    contentEn: `## Prime Numbers in the Real World

Prime numbers are the foundation of modern information security and one of the most fascinating topics in mathematics.

### Cryptography and Security

The RSA algorithm, which protects internet transactions, is based on the difficulty of factoring the product of two large prime numbers. Your bank transfers are protected by prime numbers.

### Hash Tables in Programming

Prime numbers are used as hash table sizes to minimize collisions. This speeds up data searches in databases and programs.

### Cicadas and Evolution

Periodical cicadas emerge every 13 or 17 years — both are prime numbers. This protects them from synchronizing with predator life cycles.

### Barcodes and Checksums

Check digit verification systems (ISBN, barcodes) use arithmetic with prime numbers to detect errors.

### Random Number Generation

Pseudorandom number generators often use large prime numbers in their formulas to ensure long sequence periods.

### Quantum Computing

Shor's algorithm on a quantum computer can quickly factor large numbers. This is a potential threat to RSA encryption and a stimulus for developing post-quantum cryptography.

Prime numbers are one of the fundamental objects of mathematics, and their properties continue to be discovered and find new applications.

See also: [GCD and LCM](/tools/gcd-lcm), [Factorials and Combinatorics](/tools/factorial-calc), [Matrix Calculator](/tools/matrix-calc)`
  },

  // === proportion-calc (Калькулятор пропорций) ===
  {
    slug: 'proportion-calc-guide',
    title: 'Руководство по калькулятору пропорций',
    description: 'Как решать пропорции и находить неизвестный член пропорции с помощью онлайн-калькулятора.',
    toolSlug: 'proportion-calc',
    type: 'guide',
    keywords: ['пропорции', 'калькулятор', 'соотношение', 'крест-накрест'],
    date: '2026-02-08',
    readTime: 5,
    content: `## Калькулятор пропорций

Инструмент для решения пропорций вида a/b = c/d, где одно из значений неизвестно. Также поддерживает расчёт процентов и масштабирование.

### Что такое пропорция

Пропорция — это равенство двух отношений: a/b = c/d. Основное свойство: произведение крайних членов равно произведению средних (a × d = b × c).

### Как пользоваться

1. Введите три известных значения пропорции
2. Оставьте одно поле пустым — это неизвестное
3. Нажмите «Рассчитать»
4. Получите ответ с формулой решения

### Типы задач

| Задача | Пример |
|---|---|
| Найти неизвестный член | 3/5 = x/20, x = ? |
| Процентные расчёты | 15% от 200 = ? |
| Масштаб карты | 1:50000, 3 см = ? м |
| Пересчёт рецепта | На 4 порции — 200г, на 6 — ? |

### Проверка пропорции

Для проверки правильности пропорции вычислите произведение крайних и средних членов. Если они равны — пропорция верна.

### Прямая и обратная пропорциональность

- **Прямая**: увеличение одной величины ведёт к увеличению другой
- **Обратная**: увеличение одной величины ведёт к уменьшению другой

Калькулятор поддерживает оба типа пропорциональности и автоматически подбирает правильную формулу.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Решатель уравнений](/tools/equation-solver), [Статистика](/tools/statistics-calc)`,
    titleEn: 'Proportion Calculator Guide',
    descriptionEn: 'How to solve proportions and find an unknown term using the online calculator.',
    contentEn: `## Proportion Calculator

A tool for solving proportions of the form a/b = c/d, where one value is unknown. Also supports percentage calculations and scaling.

### What Is a Proportion

A proportion is an equality of two ratios: a/b = c/d. The key property: the product of the extremes equals the product of the means (a × d = b × c).

### How to Use

1. Enter three known values of the proportion
2. Leave one field empty — that is the unknown
3. Click Calculate
4. Get the answer with the solution formula

### Problem Types

| Problem type | Example |
|---|---|
| Find an unknown term | 3/5 = x/20, x = ? |
| Percentage problems | 15% of 200 = ? |
| Map scale | 1:50000, 3 cm = ? m |
| Recipe scaling | For 4 servings — 200 g, for 6 — ? |

### Checking a Proportion

To verify a proportion, compute the product of the extremes and the product of the means. If they are equal, the proportion is correct.

### Direct and Inverse Proportionality

- **Direct**: increasing one quantity increases the other
- **Inverse**: increasing one quantity decreases the other

The calculator supports both kinds and picks the right formula automatically.

See also: [Fraction Calculator](/tools/fraction-calc), [Equation Solver](/tools/equation-solver), [Statistics](/tools/statistics-calc)`
  },
  {
    slug: 'proportion-calc-tips',
    title: 'Советы по решению задач на пропорции',
    description: 'Как правильно составлять и решать пропорции в различных типах задач.',
    toolSlug: 'proportion-calc',
    type: 'tips',
    keywords: ['пропорции', 'советы', 'задачи', 'проценты'],
    date: '2026-02-27',
    readTime: 5,
    content: `## Советы по решению пропорций

Пропорции — один из самых универсальных инструментов математики. Эти советы помогут решать задачи быстро и точно.

### Правильно определяйте тип пропорциональности

Задайте вопрос: если одна величина увеличивается, другая тоже увеличивается или уменьшается? Прямая пропорциональность — увеличивается, обратная — уменьшается.

### Следите за единицами измерения

Все значения в пропорции должны быть в одинаковых единицах. Переведите километры в метры или часы в минуты до составления пропорции.

### Используйте метод «крест-накрест»

В пропорции a/b = c/d неизвестное x находится по формуле: если x = a, то x = (b × c) / d. Запомните это как перемножение «крестом».

### Проверяйте логичность ответа

Если в рецепте на 4 порции нужно 200 г муки, то на 8 порций нужно больше, а не меньше. Всегда проверяйте, соответствует ли направление изменения логике задачи.

### Процентные задачи — это тоже пропорции

Задача «Найти 35% от 800» — это пропорция: 35/100 = x/800. Отсюда x = 280.

### Цепочки пропорций

Для связанных величин составляйте цепочку пропорций. Например: скорость → время → расстояние. Решайте последовательно.

### Округление в практических задачах

В реальных задачах часто нужно округлять результат. Округляйте в большую сторону для запасов материалов и в меньшую для ограничений.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Решатель уравнений](/tools/equation-solver), [НОД и НОК](/tools/gcd-lcm)`,
    titleEn: 'Tips for Solving Proportion Problems',
    descriptionEn: 'How to set up and solve proportions across different problem types.',
    contentEn: `## Tips for Working with Proportions

Proportions are one of the most versatile tools in math. These tips help you solve problems quickly and accurately.

### Identify the Type of Proportionality

Ask: if one quantity increases, does the other increase or decrease? Direct — both increase together; inverse — one goes up as the other goes down.

### Watch Your Units

All values in the proportion must use the same units. Convert km to m or hours to minutes before you set up the proportion.

### Use the Cross-Multiplication Method

In a/b = c/d, an unknown x can be found with cross products. Memorize this as multiplying “on the diagonal.”

### Check That the Answer Makes Sense

If a recipe needs 200 g of flour for 4 servings, you need more for 8, not less. Always check that the direction of change matches the story.

### Percent Problems Are Proportions Too

“Find 35% of 800” is a proportion: 35/100 = x/800, so x = 280.

### Chains of Proportions

For linked quantities, build a chain — for example speed → time → distance — and solve step by step.

### Rounding in Real Problems

In practice you often round. Round up for material margins and down when there are hard limits.

See also: [Fraction Calculator](/tools/fraction-calc), [Equation Solver](/tools/equation-solver), [GCD and LCM](/tools/gcd-lcm)`
  },
  {
    slug: 'proportion-calc-use-cases',
    title: 'Пропорции в жизни: от кулинарии до картографии',
    description: 'Практические примеры использования пропорций в быту, работе и учёбе.',
    toolSlug: 'proportion-calc',
    type: 'use-cases',
    keywords: ['пропорции', 'масштаб', 'рецепты', 'применение'],
    date: '2026-03-09',
    readTime: 5,
    content: `## Пропорции в повседневной жизни

Пропорции — один из самых практичных разделов математики. Мы используем их каждый день, часто даже не осознавая.

### Кулинария

Пересчёт рецепта на другое количество порций — классическая задача на пропорции. Если на 6 порций нужно 300 г риса, то на 4 порции: 300 × 4 / 6 = 200 г.

### Картография и масштаб

На карте масштаба 1:100 000 один сантиметр соответствует одному километру. Пропорции помогают переводить расстояния между картой и реальностью.

### Финансы и проценты

- Расчёт скидок: товар за 5000 руб. со скидкой 15% → 5000 × 85/100 = 4250 руб.
- Определение процентной ставки по кредиту
- Распределение бюджета по категориям

### Строительство и ремонт

Расчёт количества краски, обоев, плитки для помещения. Если 1 литр краски покрывает 8 м², то для 24 м² нужно 3 литра.

### Фотография и дизайн

Масштабирование изображений с сохранением пропорций. Если оригинал 1920×1080, то уменьшение ширины до 960 даёт высоту 540.

### Медицина

Дозировка лекарств для детей часто рассчитывается пропорционально массе тела. Концентрации растворов тоже определяются через пропорции.

### Путешествия

Расход топлива на 100 км позволяет рассчитать, сколько бензина нужно для поездки любой длины.

Смотрите также: [Калькулятор дробей](/tools/fraction-calc), [Статистика](/tools/statistics-calc), [Решатель уравнений](/tools/equation-solver)`,
    titleEn: 'Proportions in Real Life: From Cooking to Maps',
    descriptionEn: 'Practical examples of proportions at home, work, and school.',
    contentEn: `## Proportions in Everyday Life

Proportions are one of the most practical parts of math. We use them every day, often without thinking about it.

### Cooking

Scaling a recipe to another number of servings is a classic proportion. If you need 300 g of rice for 6 servings, for 4 servings: 300 × 4 / 6 = 200 g.

### Maps and Scale

On a 1:100 000 map, one centimeter on the map equals one kilometer in reality. Proportions convert between map distances and real distances.

### Finance and Percentages

- Discounts: an item at 5000 with 15% off → 5000 × 85/100 = 4250
- Figuring out interest on a loan
- Splitting a budget across categories

### Construction and Renovation

Paint, wallpaper, or tile for a room: if 1 liter covers 8 m², you need 3 liters for 24 m².

### Photography and Design

Scaling images while keeping aspect ratio. If the original is 1920×1080, halving the width to 960 gives height 540.

### Medicine

Children’s drug doses are often proportional to body weight. Solution concentrations are also set with proportions.

### Travel

Fuel use per 100 km lets you estimate fuel needed for any trip length.

See also: [Fraction Calculator](/tools/fraction-calc), [Statistics](/tools/statistics-calc), [Equation Solver](/tools/equation-solver)`
  }
];
