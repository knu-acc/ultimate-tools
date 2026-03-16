import { Article } from '../articles';

export const networkArticles: Article[] = [
  // === IP-калькулятор ===
  {
    slug: 'ip-calculator-guide',
    title: 'IP-калькулятор: руководство по расчёту IP-адресов и подсетей',
    titleEn: 'IP Calculator: Guide to IP Address and Subnet Calculation',
    description: 'Полное руководство по работе с IP-калькулятором. Как рассчитать диапазон адресов, маску подсети и сетевой адрес.',
    descriptionEn: 'Complete guide to using the IP calculator. How to calculate address ranges, subnet masks, and network addresses.',
    toolSlug: 'ip-calculator',
    type: 'guide',
    keywords: ['IP-калькулятор', 'IP-адрес', 'маска подсети', 'CIDR', 'сетевой адрес'],
    date: '2026-01-20',
    readTime: 8,
    content: `
## Что такое IP-калькулятор?

IP-калькулятор — инструмент для расчёта параметров сети на основе IP-адреса и маски подсети. Он определяет диапазон доступных адресов, широковещательный адрес и количество хостов.

## Основные понятия

| Термин | Описание | Пример |
|---|---|---|
| IP-адрес | Уникальный идентификатор устройства | 192.168.1.100 |
| Маска подсети | Определяет границы сети | 255.255.255.0 |
| CIDR-нотация | Краткая запись маски | /24 |
| Сетевой адрес | Первый адрес подсети | 192.168.1.0 |
| Широковещательный | Последний адрес подсети | 192.168.1.255 |

## Как пользоваться калькулятором

1. Введите IP-адрес устройства (например, 192.168.1.100)
2. Укажите маску подсети или CIDR-префикс (/24)
3. Получите результат: сетевой адрес, диапазон хостов, широковещательный адрес
4. Используйте данные для настройки сетевого оборудования

## Классы IP-адресов

- **Класс A** (1.0.0.0 – 126.255.255.255) — крупные сети, до 16 млн хостов
- **Класс B** (128.0.0.0 – 191.255.255.255) — средние сети, до 65 534 хостов
- **Класс C** (192.0.0.0 – 223.255.255.255) — малые сети, до 254 хостов

## Частные диапазоны

Для локальных сетей зарезервированы: 10.0.0.0/8, 172.16.0.0/12 и 192.168.0.0/16. Эти адреса не маршрутизируются в интернете.

Рассчитайте параметры сети в [IP-калькуляторе](/tools/ip-calculator).

Смотрите также: [Калькулятор подсетей](/tools/subnet-calc), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## What Is an IP Calculator?

An IP calculator is a tool for computing network parameters based on an IP address and subnet mask. It determines the available address range, broadcast address, and number of hosts.

## Key Concepts

| Term | Description | Example |
|---|---|---|
| IP Address | Unique device identifier | 192.168.1.100 |
| Subnet Mask | Defines network boundaries | 255.255.255.0 |
| CIDR Notation | Short mask notation | /24 |
| Network Address | First address of the subnet | 192.168.1.0 |
| Broadcast Address | Last address of the subnet | 192.168.1.255 |

## How to Use the Calculator

1. Enter the device IP address (e.g., 192.168.1.100)
2. Specify the subnet mask or CIDR prefix (/24)
3. Get the result: network address, host range, broadcast address
4. Use the data to configure network equipment

## IP Address Classes

- **Class A** (1.0.0.0 – 126.255.255.255) — large networks, up to 16 million hosts
- **Class B** (128.0.0.0 – 191.255.255.255) — medium networks, up to 65,534 hosts
- **Class C** (192.0.0.0 – 223.255.255.255) — small networks, up to 254 hosts

## Private Ranges

Reserved for local networks: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. These addresses are not routed on the internet.

Calculate network parameters with the [IP Calculator](/tools/ip-calculator).

See also: [Subnet Calculator](/tools/subnet-calc), [Port List](/tools/port-list)
    `.trim(),
  },
  {
    slug: 'ip-calculator-tips',
    title: '6 советов по работе с IP-адресами и подсетями',
    titleEn: '6 Tips for Working with IP Addresses and Subnets',
    description: 'Практические рекомендации по расчёту подсетей, избежанию ошибок и оптимальному планированию адресного пространства.',
    descriptionEn: 'Practical recommendations for subnet calculation, avoiding mistakes, and optimal address space planning.',
    toolSlug: 'ip-calculator',
    type: 'tips',
    keywords: ['советы IP', 'планирование подсетей', 'адресное пространство', 'ошибки сети'],
    date: '2026-02-12',
    readTime: 5,
    content: `
## 6 советов по работе с IP-адресами

### 1. Всегда учитывайте два зарезервированных адреса
В каждой подсети первый адрес — сетевой, последний — широковещательный. Для /24 доступно 254 хоста, а не 256.

### 2. Планируйте с запасом
При проектировании сети закладывайте минимум 30% запаса адресов для будущего роста.

### 3. Используйте CIDR вместо классовой адресации
CIDR позволяет гибко нарезать подсети нужного размера, не привязываясь к устаревшим классам A, B, C.

### 4. Документируйте адресный план
Ведите таблицу распределения подсетей. Это предотвращает конфликты адресов и упрощает администрирование.

### 5. Разделяйте сервисы по подсетям
Выделяйте отдельные подсети для серверов, рабочих станций, Wi-Fi и IoT-устройств. Это повышает безопасность.

### 6. Проверяйте пересечения
Перед добавлением новой подсети убедитесь, что она не пересекается с существующими. IP-калькулятор покажет полный диапазон.

Проверьте ваши расчёты в [IP-калькуляторе](/tools/ip-calculator).

Смотрите также: [Калькулятор подсетей](/tools/subnet-calc), [MAC-адрес](/tools/mac-lookup)
    `.trim(),
    contentEn: `
## 6 Tips for Working with IP Addresses

### 1. Always Account for Two Reserved Addresses
In every subnet, the first address is the network address and the last is the broadcast address. A /24 has 254 usable hosts, not 256.

### 2. Plan with a Buffer
When designing a network, allocate at least a 30% address buffer for future growth.

### 3. Use CIDR Instead of Classful Addressing
CIDR allows you to flexibly carve subnets of the needed size without being tied to the outdated Class A, B, C system.

### 4. Document the Address Plan
Maintain a subnet allocation table. This prevents address conflicts and simplifies administration.

### 5. Separate Services by Subnets
Allocate separate subnets for servers, workstations, Wi-Fi, and IoT devices. This improves security.

### 6. Check for Overlaps
Before adding a new subnet, make sure it does not overlap with existing ones. The IP calculator will show the full range.

Verify your calculations with the [IP Calculator](/tools/ip-calculator).

See also: [Subnet Calculator](/tools/subnet-calc), [MAC Lookup](/tools/mac-lookup)
    `.trim(),
  },
  {
    slug: 'ip-calculator-use-cases',
    title: 'IP-калькулятор: сценарии применения в работе сетевого инженера',
    titleEn: 'IP Calculator: Use Cases for Network Engineers',
    description: 'Как IP-калькулятор помогает при настройке сетей, устранении неполадок и планировании инфраструктуры.',
    descriptionEn: 'How the IP calculator helps with network configuration, troubleshooting, and infrastructure planning.',
    toolSlug: 'ip-calculator',
    type: 'use-cases',
    keywords: ['IP сети', 'сетевой инженер', 'настройка сети', 'планирование инфраструктуры'],
    date: '2026-03-02',
    readTime: 6,
    content: `
## Сценарии использования IP-калькулятора

### Настройка корпоративной сети
При развёртывании сети офиса необходимо разделить адресное пространство между отделами. Калькулятор рассчитывает оптимальные маски для каждого сегмента.

### Устранение сетевых неполадок

| Проблема | Что проверить | Как поможет калькулятор |
|---|---|---|
| Нет связи | Находятся ли хосты в одной подсети | Сравнить сетевые адреса |
| Конфликт IP | Пересекаются ли подсети | Проверить диапазоны |
| Нет интернета | Правильная ли маска шлюза | Рассчитать маску |

### Планирование VPN-сетей
При создании VPN-туннелей между офисами нужно убедиться, что локальные подсети не пересекаются. Калькулятор помогает подобрать непересекающиеся диапазоны.

### Подготовка к сертификации
Экзамены CCNA, CompTIA Network+ требуют быстрого расчёта подсетей. IP-калькулятор — отличный инструмент для проверки ответов при подготовке.

### Настройка домашней сети
Даже для домашнего использования калькулятор полезен: разделить сеть на сегмент для IoT-устройств и основную сеть для компьютеров.

### Миграция в облако
При переносе инфраструктуры в облако (AWS, Azure) нужно спланировать VPC/VNet с правильными подсетями. Калькулятор ускоряет этот процесс.

Рассчитайте параметры сети в [IP-калькуляторе](/tools/ip-calculator).

Смотрите также: [Калькулятор подсетей](/tools/subnet-calc), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## IP Calculator Use Cases

### Corporate Network Setup
When deploying an office network, you need to divide the address space among departments. The calculator computes optimal masks for each segment.

### Network Troubleshooting

| Problem | What to Check | How the Calculator Helps |
|---|---|---|
| No connectivity | Are hosts on the same subnet | Compare network addresses |
| IP conflict | Do subnets overlap | Check ranges |
| No internet | Is the gateway mask correct | Calculate the mask |

### VPN Network Planning
When creating VPN tunnels between offices, you need to ensure local subnets do not overlap. The calculator helps select non-overlapping ranges.

### Certification Preparation
CCNA and CompTIA Network+ exams require quick subnet calculations. The IP calculator is an excellent tool for verifying answers during preparation.

### Home Network Setup
Even for home use, the calculator is helpful: split the network into a segment for IoT devices and the main network for computers.

### Cloud Migration
When migrating infrastructure to the cloud (AWS, Azure), you need to plan VPC/VNet with proper subnets. The calculator speeds up this process.

Calculate network parameters with the [IP Calculator](/tools/ip-calculator).

See also: [Subnet Calculator](/tools/subnet-calc), [Port List](/tools/port-list)
    `.trim(),
  },

  // === Калькулятор подсетей ===
  {
    slug: 'subnet-calc-guide',
    title: 'Калькулятор подсетей: руководство по разделению сетей',
    titleEn: 'Subnet Calculator: Guide to Network Subnetting',
    description: 'Как разделить сеть на подсети с помощью калькулятора. Принципы VLSM, суперсетей и агрегации маршрутов.',
    descriptionEn: 'How to divide a network into subnets using a calculator. VLSM principles, supernetting, and route aggregation.',
    toolSlug: 'subnet-calc',
    type: 'guide',
    keywords: ['калькулятор подсетей', 'VLSM', 'разделение сети', 'суперсеть', 'подсеть'],
    date: '2026-01-28',
    readTime: 8,
    content: `
## Что такое калькулятор подсетей?

Калькулятор подсетей помогает разделить большую сеть на несколько меньших сегментов. Это базовый навык для любого сетевого специалиста.

## Зачем разделять сеть?

- **Безопасность** — изоляция сегментов ограничивает распространение угроз
- **Производительность** — уменьшение широковещательного домена снижает нагрузку
- **Управление** — проще администрировать небольшие сегменты

## Таблица масок подсетей

| CIDR | Маска | Кол-во хостов |
|---|---|---|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |

## VLSM — маски переменной длины

VLSM позволяет использовать разные маски для подсетей одной сети. Например, для серверов — /28 (14 хостов), для точки-точки — /30 (2 хоста).

## Как пользоваться калькулятором

1. Введите исходную сеть (например, 10.0.0.0/16)
2. Укажите количество нужных подсетей или хостов
3. Получите список подсетей с диапазонами адресов
4. Распределите подсети между сегментами

Разделите сеть в [Калькуляторе подсетей](/tools/subnet-calc).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## What Is a Subnet Calculator?

A subnet calculator helps divide a large network into several smaller segments. This is a fundamental skill for any network professional.

## Why Subnet a Network?

- **Security** — segment isolation limits the spread of threats
- **Performance** — reducing the broadcast domain lowers the load
- **Management** — smaller segments are easier to administer

## Subnet Mask Table

| CIDR | Mask | Host Count |
|---|---|---|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |

## VLSM — Variable Length Subnet Masks

VLSM allows using different masks for subnets within the same network. For example, /28 (14 hosts) for servers, /30 (2 hosts) for point-to-point links.

## How to Use the Calculator

1. Enter the source network (e.g., 10.0.0.0/16)
2. Specify the number of subnets or hosts needed
3. Get a list of subnets with address ranges
4. Distribute subnets among segments

Subnet your network with the [Subnet Calculator](/tools/subnet-calc).

See also: [IP Calculator](/tools/ip-calculator), [Port List](/tools/port-list)
    `.trim(),
  },
  {
    slug: 'subnet-calc-tips',
    title: '5 советов по эффективному разделению сетей на подсети',
    titleEn: '5 Tips for Effective Network Subnetting',
    description: 'Практические рекомендации по планированию подсетей: как избежать ошибок и оптимизировать адресное пространство.',
    descriptionEn: 'Practical recommendations for subnet planning: how to avoid mistakes and optimize address space.',
    toolSlug: 'subnet-calc',
    type: 'tips',
    keywords: ['разделение подсетей', 'планирование сети', 'оптимизация адресов', 'CIDR советы'],
    date: '2026-02-20',
    readTime: 5,
    content: `
## 5 советов по разделению сетей

### 1. Начинайте с самой большой подсети
При использовании VLSM сначала выделяйте подсети для самых больших сегментов, затем нарезайте оставшееся пространство на меньшие.

### 2. Используйте степени двойки
Количество хостов в подсети всегда равно 2^n - 2. Планируйте потребности, округляя вверх до ближайшей степени двойки.

### 3. Резервируйте подсети для роста
Не используйте всё адресное пространство сразу. Оставьте свободные блоки между подсетями для будущего расширения.

### 4. Группируйте подсети для суммаризации
Размещайте связанные подсети в непрерывных блоках. Это позволит агрегировать маршруты и упростить таблицу маршрутизации.

### 5. Документируйте каждую подсеть
Для каждой подсети фиксируйте:
- Назначение (серверы, пользователи, управление)
- Диапазон адресов и маску
- VLAN-идентификатор
- Ответственного администратора

## Частые ошибки

- Забывают вычесть сетевой и широковещательный адреса
- Создают пересекающиеся подсети
- Не оставляют запаса для роста

Проверьте ваши подсети в [Калькуляторе подсетей](/tools/subnet-calc).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [MAC-адрес](/tools/mac-lookup)
    `.trim(),
    contentEn: `
## 5 Tips for Network Subnetting

### 1. Start with the Largest Subnet
When using VLSM, allocate subnets for the largest segments first, then carve the remaining space into smaller ones.

### 2. Use Powers of Two
The number of hosts in a subnet is always 2^n - 2. Plan your needs by rounding up to the nearest power of two.

### 3. Reserve Subnets for Growth
Do not use up all address space at once. Leave free blocks between subnets for future expansion.

### 4. Group Subnets for Summarization
Place related subnets in contiguous blocks. This allows route aggregation and simplifies the routing table.

### 5. Document Every Subnet
For each subnet, record:
- Purpose (servers, users, management)
- Address range and mask
- VLAN identifier
- Responsible administrator

## Common Mistakes

- Forgetting to subtract the network and broadcast addresses
- Creating overlapping subnets
- Not leaving room for growth

Check your subnets with the [Subnet Calculator](/tools/subnet-calc).

See also: [IP Calculator](/tools/ip-calculator), [MAC Lookup](/tools/mac-lookup)
    `.trim(),
  },
  {
    slug: 'subnet-calc-use-cases',
    title: 'Калькулятор подсетей: 5 реальных сценариев применения',
    titleEn: 'Subnet Calculator: 5 Real-World Use Cases',
    description: 'Примеры использования калькулятора подсетей при проектировании сетей, настройке VLAN и облачных миграциях.',
    descriptionEn: 'Examples of using the subnet calculator for network design, VLAN configuration, and cloud migrations.',
    toolSlug: 'subnet-calc',
    type: 'use-cases',
    keywords: ['подсети примеры', 'VLAN', 'сеть офиса', 'облачная сеть'],
    date: '2026-03-07',
    readTime: 6,
    content: `
## 5 сценариев использования калькулятора подсетей

### 1. Проектирование сети нового офиса
Разделение сети 10.10.0.0/16 для офиса на 200 сотрудников:
- Рабочие станции — 10.10.1.0/24 (254 хоста)
- Серверы — 10.10.10.0/28 (14 хостов)
- Wi-Fi гости — 10.10.20.0/24 (254 хоста)
- Управление — 10.10.100.0/28 (14 хостов)

### 2. Настройка VLAN в коммутаторах

| VLAN | Подсеть | Назначение |
|---|---|---|
| VLAN 10 | 192.168.10.0/24 | Бухгалтерия |
| VLAN 20 | 192.168.20.0/24 | Разработка |
| VLAN 30 | 192.168.30.0/24 | Гостевая сеть |
| VLAN 99 | 192.168.99.0/28 | Управление |

### 3. Планирование облачной инфраструктуры
В AWS VPC или Azure VNet нужно заранее спланировать подсети для публичных и приватных ресурсов, баз данных и балансировщиков.

### 4. Объединение филиалов через VPN
При соединении нескольких офисов подсети каждого филиала не должны пересекаться. Калькулятор помогает подобрать уникальные диапазоны.

### 5. Подготовка к экзаменам
Задачи на разделение подсетей — ключевая часть экзаменов CCNA и Network+. Калькулятор позволяет проверить решения и разобрать ошибки.

Спланируйте подсети в [Калькуляторе подсетей](/tools/subnet-calc).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## 5 Use Cases for the Subnet Calculator

### 1. Designing a New Office Network
Subnetting the 10.10.0.0/16 network for an office with 200 employees:
- Workstations — 10.10.1.0/24 (254 hosts)
- Servers — 10.10.10.0/28 (14 hosts)
- Guest Wi-Fi — 10.10.20.0/24 (254 hosts)
- Management — 10.10.100.0/28 (14 hosts)

### 2. Configuring VLANs on Switches

| VLAN | Subnet | Purpose |
|---|---|---|
| VLAN 10 | 192.168.10.0/24 | Accounting |
| VLAN 20 | 192.168.20.0/24 | Development |
| VLAN 30 | 192.168.30.0/24 | Guest network |
| VLAN 99 | 192.168.99.0/28 | Management |

### 3. Planning Cloud Infrastructure
In AWS VPC or Azure VNet, you need to plan subnets in advance for public and private resources, databases, and load balancers.

### 4. Connecting Branch Offices via VPN
When connecting multiple offices, each branch's subnets must not overlap. The calculator helps select unique ranges.

### 5. Exam Preparation
Subnetting problems are a key part of CCNA and Network+ exams. The calculator lets you verify solutions and analyze mistakes.

Plan your subnets with the [Subnet Calculator](/tools/subnet-calc).

See also: [IP Calculator](/tools/ip-calculator), [Port List](/tools/port-list)
    `.trim(),
  },

  // === MAC-адрес ===
  {
    slug: 'mac-lookup-guide',
    title: 'Поиск по MAC-адресу: руководство по определению производителя',
    titleEn: 'MAC Address Lookup: Guide to Identifying Device Manufacturers',
    description: 'Как определить производителя устройства по MAC-адресу. Что такое OUI и как работает идентификация.',
    descriptionEn: 'How to identify a device manufacturer by MAC address. What is OUI and how identification works.',
    toolSlug: 'mac-lookup',
    type: 'guide',
    keywords: ['MAC-адрес', 'OUI', 'производитель устройства', 'сетевой адаптер', 'поиск MAC'],
    date: '2026-02-01',
    readTime: 6,
    content: `
## Что такое MAC-адрес?

MAC-адрес (Media Access Control) — уникальный аппаратный идентификатор сетевого устройства. Он состоит из 48 бит (6 байт) и записывается в шестнадцатеричном формате.

## Структура MAC-адреса

| Часть | Биты | Описание |
|---|---|---|
| OUI | Первые 24 бита | Идентификатор производителя (IEEE) |
| NIC | Последние 24 бита | Уникальный номер устройства |

Пример: **00:1A:2B**:3C:4D:5E — первые три октета (00:1A:2B) определяют производителя.

## Форматы записи

MAC-адрес может быть записан в нескольких форматах:
- **Двоеточия:** 00:1A:2B:3C:4D:5E
- **Дефисы:** 00-1A-2B-3C-4D-5E
- **Точки (Cisco):** 001A.2B3C.4D5E
- **Без разделителей:** 001A2B3C4D5E

## Как найти MAC-адрес

- **Windows:** команда ipconfig /all
- **macOS/Linux:** команда ifconfig или ip link
- **Роутер:** таблица DHCP-клиентов в админ-панели

## Как пользоваться поиском

1. Скопируйте MAC-адрес устройства
2. Вставьте в поле поиска (любой формат)
3. Получите информацию о производителе

Определите производителя в инструменте [Поиск по MAC-адресу](/tools/mac-lookup).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Парсер User-Agent](/tools/user-agent-parser)
    `.trim(),
    contentEn: `
## What Is a MAC Address?

A MAC address (Media Access Control) is a unique hardware identifier of a network device. It consists of 48 bits (6 bytes) and is written in hexadecimal format.

## MAC Address Structure

| Part | Bits | Description |
|---|---|---|
| OUI | First 24 bits | Manufacturer identifier (IEEE) |
| NIC | Last 24 bits | Unique device number |

Example: **00:1A:2B**:3C:4D:5E — the first three octets (00:1A:2B) identify the manufacturer.

## Notation Formats

A MAC address can be written in several formats:
- **Colons:** 00:1A:2B:3C:4D:5E
- **Hyphens:** 00-1A-2B-3C-4D-5E
- **Dots (Cisco):** 001A.2B3C.4D5E
- **No separators:** 001A2B3C4D5E

## How to Find a MAC Address

- **Windows:** ipconfig /all command
- **macOS/Linux:** ifconfig or ip link command
- **Router:** DHCP client table in the admin panel

## How to Use the Lookup

1. Copy the device's MAC address
2. Paste it into the search field (any format)
3. Get information about the manufacturer

Identify the manufacturer with the [MAC Address Lookup](/tools/mac-lookup) tool.

See also: [IP Calculator](/tools/ip-calculator), [User-Agent Parser](/tools/user-agent-parser)
    `.trim(),
  },
  {
    slug: 'mac-lookup-tips',
    title: '5 советов по работе с MAC-адресами в сети',
    titleEn: '5 Tips for Working with MAC Addresses in Networks',
    description: 'Как использовать MAC-адреса для управления сетью, фильтрации устройств и повышения безопасности.',
    descriptionEn: 'How to use MAC addresses for network management, device filtering, and improving security.',
    toolSlug: 'mac-lookup',
    type: 'tips',
    keywords: ['MAC фильтрация', 'безопасность сети', 'управление устройствами', 'ARP'],
    date: '2026-02-25',
    readTime: 5,
    content: `
## 5 советов по работе с MAC-адресами

### 1. Используйте MAC-фильтрацию на роутере
Настройте белый список MAC-адресов для Wi-Fi. Это не заменяет пароль, но добавляет дополнительный уровень защиты.

### 2. Отслеживайте неизвестные устройства
Периодически проверяйте список подключённых устройств на роутере. Неизвестные MAC-адреса можно идентифицировать через поиск производителя.

### 3. Учитывайте рандомизацию MAC
Современные смартфоны (iOS, Android) используют случайные MAC-адреса для Wi-Fi. Реальный MAC виден только после подключения к доверенной сети.

### 4. Фиксируйте привязки DHCP
Создайте статические привязки MAC к IP для серверов и принтеров. Это гарантирует, что устройства всегда получают одинаковый IP-адрес.

### 5. Проверяйте ARP-таблицу при проблемах
Команда arp -a показывает соответствия IP и MAC в локальной сети. Дублирующиеся MAC-адреса указывают на ARP-спуфинг.

## Когда MAC-адрес бесполезен

- MAC-адрес не проходит через маршрутизатор — он виден только в локальной сети
- MAC-адрес можно подменить программно (спуфинг)
- Рандомизация на мобильных устройствах скрывает реальный адрес

Определите устройство по MAC в инструменте [Поиск по MAC-адресу](/tools/mac-lookup).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Калькулятор подсетей](/tools/subnet-calc)
    `.trim(),
    contentEn: `
## 5 Tips for Working with MAC Addresses

### 1. Use MAC Filtering on Your Router
Set up a whitelist of MAC addresses for Wi-Fi. It does not replace a password but adds an extra layer of protection.

### 2. Track Unknown Devices
Periodically check the connected device list on your router. Unknown MAC addresses can be identified by looking up the manufacturer.

### 3. Account for MAC Randomization
Modern smartphones (iOS, Android) use random MAC addresses for Wi-Fi. The real MAC is only visible after connecting to a trusted network.

### 4. Set Up DHCP Reservations
Create static MAC-to-IP bindings for servers and printers. This ensures devices always receive the same IP address.

### 5. Check the ARP Table When Troubleshooting
The arp -a command shows IP-to-MAC mappings on the local network. Duplicate MAC addresses may indicate ARP spoofing.

## When a MAC Address Is Useless

- A MAC address does not pass through a router — it is only visible on the local network
- A MAC address can be spoofed programmatically
- Randomization on mobile devices hides the real address

Identify a device by MAC with the [MAC Address Lookup](/tools/mac-lookup) tool.

See also: [IP Calculator](/tools/ip-calculator), [Subnet Calculator](/tools/subnet-calc)
    `.trim(),
  },
  {
    slug: 'mac-lookup-use-cases',
    title: 'Поиск по MAC-адресу: 4 практических сценария',
    titleEn: 'MAC Address Lookup: 4 Practical Scenarios',
    description: 'Реальные примеры использования поиска по MAC-адресу: инвентаризация, безопасность и диагностика сети.',
    descriptionEn: 'Real-world examples of MAC address lookup usage: inventory, security, and network diagnostics.',
    toolSlug: 'mac-lookup',
    type: 'use-cases',
    keywords: ['инвентаризация сети', 'диагностика MAC', 'безопасность Wi-Fi', 'определение устройств'],
    date: '2026-03-09',
    readTime: 5,
    content: `
## 4 сценария использования поиска по MAC-адресу

### 1. Инвентаризация сетевого оборудования
При аудите сети администратор собирает MAC-адреса всех устройств. Поиск по OUI позволяет быстро определить производителя каждого устройства без физического доступа.

### 2. Расследование инцидентов безопасности

| Ситуация | Действие |
|---|---|
| Неизвестное устройство в сети | Определить производителя по MAC |
| Подозрительный трафик | Найти источник по MAC в ARP-таблице |
| Несанкционированная точка доступа | Идентифицировать оборудование по OUI |

### 3. Настройка сетевого оборудования
При конфигурации VLAN, port security и ACL на коммутаторах необходимо знать MAC-адреса устройств. Поиск производителя помогает убедиться, что политика применяется к правильным устройствам.

### 4. Управление домашней сетью
- Определение, какие устройства подключены к Wi-Fi
- Идентификация IoT-устройств (камеры, умные розетки) по производителю
- Блокировка нежелательных устройств по MAC-адресу

## Ограничения метода

Помните, что MAC-адрес можно подменить, поэтому для критичных задач безопасности используйте дополнительные методы аутентификации (802.1X, сертификаты).

Проверьте MAC-адрес в инструменте [Поиск по MAC-адресу](/tools/mac-lookup).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Парсер User-Agent](/tools/user-agent-parser)
    `.trim(),
    contentEn: `
## 4 Use Cases for MAC Address Lookup

### 1. Network Equipment Inventory
During a network audit, an administrator collects MAC addresses of all devices. OUI lookup quickly identifies the manufacturer of each device without physical access.

### 2. Security Incident Investigation

| Situation | Action |
|---|---|
| Unknown device on the network | Identify the manufacturer by MAC |
| Suspicious traffic | Find the source by MAC in the ARP table |
| Unauthorized access point | Identify equipment by OUI |

### 3. Network Equipment Configuration
When configuring VLANs, port security, and ACLs on switches, you need to know device MAC addresses. Manufacturer lookup helps ensure policies are applied to the correct devices.

### 4. Home Network Management
- Identifying which devices are connected to Wi-Fi
- Identifying IoT devices (cameras, smart plugs) by manufacturer
- Blocking unwanted devices by MAC address

## Method Limitations

Remember that MAC addresses can be spoofed, so for critical security tasks use additional authentication methods (802.1X, certificates).

Check a MAC address with the [MAC Address Lookup](/tools/mac-lookup) tool.

See also: [IP Calculator](/tools/ip-calculator), [User-Agent Parser](/tools/user-agent-parser)
    `.trim(),
  },

  // === Список портов ===
  {
    slug: 'port-list-guide',
    title: 'Список сетевых портов: полное руководство по TCP и UDP',
    titleEn: 'Network Port List: Complete TCP and UDP Guide',
    description: 'Справочник по сетевым портам TCP/UDP. Какие порты используются популярными сервисами и протоколами.',
    descriptionEn: 'TCP/UDP network port reference. Which ports are used by popular services and protocols.',
    toolSlug: 'port-list',
    type: 'guide',
    keywords: ['сетевые порты', 'TCP', 'UDP', 'порт сервиса', 'список портов'],
    date: '2026-01-22',
    readTime: 7,
    content: `
## Что такое сетевые порты?

Сетевой порт — это числовой идентификатор (0–65535), определяющий конкретное приложение или сервис на устройстве. Порты работают поверх протоколов TCP и UDP.

## Диапазоны портов

| Диапазон | Название | Назначение |
|---|---|---|
| 0–1023 | Well-known | Стандартные сервисы (HTTP, FTP, SSH) |
| 1024–49151 | Registered | Зарегистрированные приложения |
| 49152–65535 | Dynamic | Временные (эфемерные) порты |

## Основные порты

| Порт | Протокол | Сервис |
|---|---|---|
| 22 | TCP | SSH |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 25 | TCP | SMTP |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 3389 | TCP | RDP |

## TCP vs UDP

- **TCP** — надёжная доставка с подтверждением. Используется для веб-трафика, почты, файлов.
- **UDP** — быстрая доставка без подтверждения. Используется для DNS, видеопотоков, игр.

## Как проверить открытые порты

- **Windows:** netstat -an или Test-NetConnection
- **Linux:** ss -tlnp или nmap
- **Онлайн:** сканеры портов (проверка извне)

Найдите нужный порт в [Списке портов](/tools/port-list).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Калькулятор подсетей](/tools/subnet-calc)
    `.trim(),
    contentEn: `
## What Are Network Ports?

A network port is a numeric identifier (0–65535) that specifies a particular application or service on a device. Ports operate on top of the TCP and UDP protocols.

## Port Ranges

| Range | Name | Purpose |
|---|---|---|
| 0–1023 | Well-known | Standard services (HTTP, FTP, SSH) |
| 1024–49151 | Registered | Registered applications |
| 49152–65535 | Dynamic | Temporary (ephemeral) ports |

## Common Ports

| Port | Protocol | Service |
|---|---|---|
| 22 | TCP | SSH |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 25 | TCP | SMTP |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 3389 | TCP | RDP |

## TCP vs UDP

- **TCP** — reliable delivery with acknowledgment. Used for web traffic, email, files.
- **UDP** — fast delivery without acknowledgment. Used for DNS, video streams, games.

## How to Check Open Ports

- **Windows:** netstat -an or Test-NetConnection
- **Linux:** ss -tlnp or nmap
- **Online:** port scanners (external check)

Find the port you need in the [Port List](/tools/port-list).

See also: [IP Calculator](/tools/ip-calculator), [Subnet Calculator](/tools/subnet-calc)
    `.trim(),
  },
  {
    slug: 'port-list-tips',
    title: '7 советов по безопасности сетевых портов',
    titleEn: '7 Network Port Security Tips',
    description: 'Как защитить сервер, правильно настроить файрвол и минимизировать поверхность атаки через управление портами.',
    descriptionEn: 'How to protect a server, properly configure a firewall, and minimize the attack surface through port management.',
    toolSlug: 'port-list',
    type: 'tips',
    keywords: ['безопасность портов', 'файрвол', 'закрытие портов', 'защита сервера'],
    date: '2026-02-14',
    readTime: 6,
    content: `
## 7 советов по безопасности сетевых портов

### 1. Закрывайте неиспользуемые порты
Каждый открытый порт — потенциальная точка входа для атаки. Оставляйте открытыми только необходимые.

### 2. Меняйте стандартные порты
Перенесите SSH с порта 22 на нестандартный (например, 2222). Это не полноценная защита, но снижает количество автоматических атак.

### 3. Используйте файрвол с белым списком
Настройте правила «запретить всё, разрешить конкретное». Это надёжнее, чем блокировка отдельных портов.

### 4. Регулярно сканируйте порты
Проводите периодический аудит открытых портов на серверах. Неожиданно открытый порт может указывать на компрометацию.

### 5. Разделяйте публичные и внутренние сервисы
Базы данных (3306, 5432) и административные интерфейсы никогда не должны быть доступны из интернета.

### 6. Включайте логирование
Настройте запись попыток подключения к закрытым портам. Это поможет выявить разведку и сканирование.

### 7. Обновляйте сервисы
Уязвимости в ПО, слушающем порт, опаснее самого открытого порта. Своевременные обновления критически важны.

Проверьте назначение портов в [Списке портов](/tools/port-list).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [MAC-адрес](/tools/mac-lookup)
    `.trim(),
    contentEn: `
## 7 Network Port Security Tips

### 1. Close Unused Ports
Every open port is a potential entry point for an attack. Keep only the necessary ones open.

### 2. Change Default Ports
Move SSH from port 22 to a non-standard one (e.g., 2222). This is not full protection but reduces the number of automated attacks.

### 3. Use a Whitelist Firewall
Configure "deny all, allow specific" rules. This is more reliable than blocking individual ports.

### 4. Scan Ports Regularly
Conduct periodic audits of open ports on servers. An unexpectedly open port may indicate a compromise.

### 5. Separate Public and Internal Services
Databases (3306, 5432) and admin interfaces should never be accessible from the internet.

### 6. Enable Logging
Set up logging of connection attempts to closed ports. This helps detect reconnaissance and scanning.

### 7. Keep Services Updated
Vulnerabilities in software listening on a port are more dangerous than the open port itself. Timely updates are critical.

Check port assignments in the [Port List](/tools/port-list).

See also: [IP Calculator](/tools/ip-calculator), [MAC Lookup](/tools/mac-lookup)
    `.trim(),
  },
  {
    slug: 'port-list-use-cases',
    title: 'Справочник портов: сценарии использования для администраторов',
    titleEn: 'Port Reference: Use Cases for System Administrators',
    description: 'Как справочник сетевых портов помогает при настройке серверов, файрволов и диагностике проблем.',
    descriptionEn: 'How the network port reference helps with server configuration, firewall setup, and troubleshooting.',
    toolSlug: 'port-list',
    type: 'use-cases',
    keywords: ['администрирование портов', 'настройка файрвола', 'диагностика сети', 'серверные порты'],
    date: '2026-03-04',
    readTime: 5,
    content: `
## Сценарии использования справочника портов

### Настройка файрвола
При конфигурации iptables, ufw или Windows Firewall нужно знать, какие порты открыть для каждого сервиса. Справочник даёт быстрый ответ.

### Диагностика подключений

| Симптом | Порт для проверки | Сервис |
|---|---|---|
| Сайт недоступен | 80, 443 | HTTP/HTTPS |
| Почта не отправляется | 25, 587, 465 | SMTP |
| Не подключается к БД | 3306, 5432 | MySQL/PostgreSQL |
| Не работает RDP | 3389 | Remote Desktop |

### Настройка Docker и микросервисов
При контейнеризации необходимо маппить порты контейнера на хост. Справочник помогает избежать конфликтов между сервисами.

### Настройка NAT и проброса портов
Для доступа к домашнему серверу извне нужно пробросить порты на роутере. Справочник подскажет правильные номера.

### Аудит безопасности
Сканирование портов — первый этап пентеста. Зная стандартные порты сервисов, аудитор быстро определяет работающее ПО и его версии.

### Обучение и подготовка к экзаменам
Знание основных портов (22, 53, 80, 443, 3389) — обязательное требование для сертификаций CompTIA, Cisco и других вендоров.

Найдите нужный порт в [Списке портов](/tools/port-list).

Смотрите также: [IP-калькулятор](/tools/ip-calculator), [Калькулятор подсетей](/tools/subnet-calc)
    `.trim(),
    contentEn: `
## Port Reference Use Cases

### Firewall Configuration
When configuring iptables, ufw, or Windows Firewall, you need to know which ports to open for each service. The reference provides a quick answer.

### Connection Diagnostics

| Symptom | Port to Check | Service |
|---|---|---|
| Website unavailable | 80, 443 | HTTP/HTTPS |
| Email not sending | 25, 587, 465 | SMTP |
| Cannot connect to DB | 3306, 5432 | MySQL/PostgreSQL |
| RDP not working | 3389 | Remote Desktop |

### Docker and Microservices Setup
When containerizing, you need to map container ports to the host. The reference helps avoid conflicts between services.

### NAT and Port Forwarding Setup
To access a home server from outside, you need to forward ports on your router. The reference suggests the correct port numbers.

### Security Auditing
Port scanning is the first step of a pentest. Knowing the standard service ports, an auditor quickly identifies running software and its versions.

### Training and Exam Preparation
Knowledge of key ports (22, 53, 80, 443, 3389) is a mandatory requirement for CompTIA, Cisco, and other vendor certifications.

Find the port you need in the [Port List](/tools/port-list).

See also: [IP Calculator](/tools/ip-calculator), [Subnet Calculator](/tools/subnet-calc)
    `.trim(),
  },

  // === Парсер User-Agent ===
  {
    slug: 'user-agent-parser-guide',
    title: 'Парсер User-Agent: руководство по анализу строк браузера',
    titleEn: 'User-Agent Parser: Guide to Browser String Analysis',
    description: 'Как работает парсер User-Agent, какую информацию можно извлечь и зачем это нужно веб-разработчикам.',
    descriptionEn: 'How the User-Agent parser works, what information can be extracted, and why web developers need it.',
    toolSlug: 'user-agent-parser',
    type: 'guide',
    keywords: ['User-Agent', 'парсер браузера', 'HTTP заголовки', 'определение браузера', 'веб-разработка'],
    date: '2026-02-03',
    readTime: 7,
    content: `
## Что такое User-Agent?

User-Agent — это строка в HTTP-заголовке, которую браузер отправляет серверу при каждом запросе. Она содержит информацию о браузере, операционной системе и устройстве.

## Структура строки User-Agent

Типичная строка содержит:
- Название и версию браузера
- Движок рендеринга (Blink, Gecko, WebKit)
- Операционную систему и её версию
- Тип устройства (desktop, mobile, tablet)

## Что можно определить

| Параметр | Пример |
|---|---|
| Браузер | Chrome 120, Firefox 121, Safari 17 |
| ОС | Windows 11, macOS 14, Android 14 |
| Устройство | Desktop, iPhone, Samsung Galaxy |
| Движок | Blink, Gecko, WebKit |
| Бот | Googlebot, Bingbot, YandexBot |

## Как пользоваться парсером

1. Скопируйте строку User-Agent из браузера или логов
2. Вставьте в поле анализа
3. Получите структурированную информацию об устройстве и браузере

## Где найти User-Agent

- **В браузере:** введите navigator.userAgent в консоли разработчика
- **В логах сервера:** поле User-Agent в access-логах
- **В аналитике:** отчёты по браузерам и устройствам

## Ограничения

User-Agent может быть подменён пользователем или расширением. Также многие современные браузеры стандартизируют строку для защиты приватности.

Проанализируйте строку в [Парсере User-Agent](/tools/user-agent-parser).

Смотрите также: [Поиск по MAC-адресу](/tools/mac-lookup), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## What Is a User-Agent?

A User-Agent is a string in the HTTP header that the browser sends to the server with every request. It contains information about the browser, operating system, and device.

## User-Agent String Structure

A typical string contains:
- Browser name and version
- Rendering engine (Blink, Gecko, WebKit)
- Operating system and its version
- Device type (desktop, mobile, tablet)

## What Can Be Detected

| Parameter | Example |
|---|---|
| Browser | Chrome 120, Firefox 121, Safari 17 |
| OS | Windows 11, macOS 14, Android 14 |
| Device | Desktop, iPhone, Samsung Galaxy |
| Engine | Blink, Gecko, WebKit |
| Bot | Googlebot, Bingbot, YandexBot |

## How to Use the Parser

1. Copy the User-Agent string from the browser or logs
2. Paste it into the analysis field
3. Get structured information about the device and browser

## Where to Find the User-Agent

- **In the browser:** type navigator.userAgent in the developer console
- **In server logs:** the User-Agent field in access logs
- **In analytics:** reports by browsers and devices

## Limitations

The User-Agent can be spoofed by the user or an extension. Many modern browsers also standardize the string for privacy protection.

Analyze a string with the [User-Agent Parser](/tools/user-agent-parser).

See also: [MAC Address Lookup](/tools/mac-lookup), [Port List](/tools/port-list)
    `.trim(),
  },
  {
    slug: 'user-agent-parser-tips',
    title: '5 советов по работе с User-Agent для веб-разработчиков',
    titleEn: '5 User-Agent Tips for Web Developers',
    description: 'Рекомендации по корректному определению браузера, обработке ботов и адаптации контента по User-Agent.',
    descriptionEn: 'Recommendations for correct browser detection, bot handling, and content adaptation via User-Agent.',
    toolSlug: 'user-agent-parser',
    type: 'tips',
    keywords: ['определение браузера', 'боты', 'адаптивный контент', 'User-Agent советы'],
    date: '2026-02-27',
    readTime: 5,
    content: `
## 5 советов по работе с User-Agent

### 1. Не полагайтесь только на User-Agent для функциональности
Используйте feature detection (проверку возможностей) вместо определения браузера. Библиотека Modernizr или нативные API надёжнее.

### 2. Обрабатывайте ботов отдельно
Поисковые роботы отправляют специфические User-Agent. Определяйте Googlebot, Bingbot и другие для корректной выдачи контента:
- Отдавайте ботам полную HTML-версию для индексации
- Не показывайте ботам интерстициальную рекламу
- Проверяйте подлинность бота через обратный DNS

### 3. Учитывайте Client Hints
Современные браузеры (Chrome 90+) поддерживают HTTP Client Hints как замену User-Agent. Это более структурированный и приватный способ передачи данных.

### 4. Логируйте для аналитики
Записывайте User-Agent в серверные логи для анализа аудитории. Это помогает принять решения о поддержке старых браузеров.

### 5. Тестируйте с разными User-Agent
Используйте DevTools для подмены User-Agent при тестировании адаптивной логики на стороне сервера.

## Типичные ошибки

- Блокировка легитимных пользователей из-за неизвестного User-Agent
- Жёсткая привязка функциональности к конкретной версии браузера
- Игнорирование мобильных User-Agent

Проанализируйте строку в [Парсере User-Agent](/tools/user-agent-parser).

Смотрите также: [Поиск по MAC-адресу](/tools/mac-lookup), [Список портов](/tools/port-list)
    `.trim(),
    contentEn: `
## 5 Tips for Working with User-Agent

### 1. Do Not Rely Solely on User-Agent for Functionality
Use feature detection instead of browser identification. The Modernizr library or native APIs are more reliable.

### 2. Handle Bots Separately
Search bots send specific User-Agent strings. Detect Googlebot, Bingbot, and others for correct content delivery:
- Serve bots the full HTML version for indexing
- Do not show bots interstitial ads
- Verify bot authenticity via reverse DNS

### 3. Consider Client Hints
Modern browsers (Chrome 90+) support HTTP Client Hints as a replacement for User-Agent. This is a more structured and privacy-friendly way to transmit data.

### 4. Log for Analytics
Record User-Agent in server logs for audience analysis. This helps make decisions about supporting older browsers.

### 5. Test with Different User-Agents
Use DevTools to override User-Agent when testing server-side adaptive logic.

## Common Mistakes

- Blocking legitimate users due to an unknown User-Agent
- Hardcoding functionality to a specific browser version
- Ignoring mobile User-Agents

Analyze a string with the [User-Agent Parser](/tools/user-agent-parser).

See also: [MAC Address Lookup](/tools/mac-lookup), [Port List](/tools/port-list)
    `.trim(),
  },
  {
    slug: 'user-agent-parser-use-cases',
    title: 'Парсер User-Agent: сценарии применения в разработке и аналитике',
    titleEn: 'User-Agent Parser: Use Cases in Development and Analytics',
    description: 'Как анализ User-Agent помогает в веб-разработке, SEO, безопасности и маркетинговой аналитике.',
    descriptionEn: 'How User-Agent analysis helps with web development, SEO, security, and marketing analytics.',
    toolSlug: 'user-agent-parser',
    type: 'use-cases',
    keywords: ['аналитика браузеров', 'SEO боты', 'безопасность User-Agent', 'маркетинг'],
    date: '2026-03-06',
    readTime: 6,
    content: `
## Сценарии использования парсера User-Agent

### Веб-аналитика
Анализ User-Agent из серверных логов позволяет понять:
- Какие браузеры используют посетители
- Соотношение мобильного и десктопного трафика
- Какие ОС популярны у аудитории

### SEO и индексация

| Бот | User-Agent содержит | Назначение |
|---|---|---|
| Googlebot | Googlebot | Индексация для Google |
| Bingbot | bingbot | Индексация для Bing |
| YandexBot | YandexBot | Индексация для Яндекса |
| Googlebot-Mobile | Mobile + Googlebot | Мобильная индексация |

### Безопасность
Анализ User-Agent помогает обнаружить:
- Сканеры уязвимостей (Nmap, Nikto, SQLMap)
- Автоматические парсеры и скраперы
- Подозрительные запросы с нестандартными User-Agent

### Адаптация контента
Серверная адаптация контента на основе User-Agent:
- Отдача WebP-изображений для поддерживающих браузеров
- Загрузка полифиллов для старых версий
- Редирект мобильных пользователей на m.site.com

### Маркетинг и таргетинг
Маркетологи используют данные User-Agent для:
- Определения целевых платформ для рекламных кампаний
- Анализа технической оснащённости аудитории
- Оптимизации лендингов под популярные браузеры

### Тестирование совместимости
QA-инженеры проверяют, как сайт работает под разными User-Agent, эмулируя различные браузеры и устройства.

Проанализируйте строку в [Парсере User-Agent](/tools/user-agent-parser).

Смотрите также: [Поиск по MAC-адресу](/tools/mac-lookup), [IP-калькулятор](/tools/ip-calculator)
    `.trim(),
    contentEn: `
## User-Agent Parser Use Cases

### Web Analytics
Analyzing User-Agent from server logs reveals:
- Which browsers visitors use
- The ratio of mobile to desktop traffic
- Which operating systems are popular with the audience

### SEO and Indexing

| Bot | User-Agent Contains | Purpose |
|---|---|---|
| Googlebot | Googlebot | Indexing for Google |
| Bingbot | bingbot | Indexing for Bing |
| YandexBot | YandexBot | Indexing for Yandex |
| Googlebot-Mobile | Mobile + Googlebot | Mobile indexing |

### Security
User-Agent analysis helps detect:
- Vulnerability scanners (Nmap, Nikto, SQLMap)
- Automated parsers and scrapers
- Suspicious requests with non-standard User-Agents

### Content Adaptation
Server-side content adaptation based on User-Agent:
- Serving WebP images for supporting browsers
- Loading polyfills for older versions
- Redirecting mobile users to m.site.com

### Marketing and Targeting
Marketers use User-Agent data to:
- Identify target platforms for advertising campaigns
- Analyze the technical capabilities of the audience
- Optimize landing pages for popular browsers

### Compatibility Testing
QA engineers check how a site works under different User-Agents by emulating various browsers and devices.

Analyze a string with the [User-Agent Parser](/tools/user-agent-parser).

See also: [MAC Address Lookup](/tools/mac-lookup), [IP Calculator](/tools/ip-calculator)
    `.trim(),
  },
];
