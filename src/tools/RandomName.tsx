'use client';

import { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, useTheme, Slider, alpha
} from '@mui/material';
import { Casino, Person } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

const RUSSIAN_MALE_FIRST = [
  'Александр', 'Дмитрий', 'Максим', 'Иван', 'Артём', 'Михаил', 'Даниил', 'Матвей',
  'Кирилл', 'Андрей', 'Никита', 'Егор', 'Илья', 'Алексей', 'Роман', 'Владислав',
  'Тимофей', 'Арсений', 'Сергей', 'Николай', 'Владимир', 'Павел', 'Степан', 'Фёдор',
  'Георгий', 'Марк', 'Виктор', 'Олег', 'Борис', 'Антон', 'Василий', 'Денис',
];

const RUSSIAN_FEMALE_FIRST = [
  'Анастасия', 'Мария', 'Анна', 'Виктория', 'Полина', 'Елизавета', 'Екатерина',
  'Дарья', 'Варвара', 'Софья', 'Алиса', 'Ксения', 'Александра', 'Ольга', 'Ирина',
  'Татьяна', 'Наталья', 'Юлия', 'Светлана', 'Валерия', 'Кристина', 'Вероника',
  'Маргарита', 'Диана', 'Евгения', 'Людмила', 'Надежда', 'Лариса', 'Галина',
  'Елена', 'Марина', 'Алёна',
];

const RUSSIAN_MALE_LAST = [
  'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов',
  'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев',
  'Семёнов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов',
  'Андреев', 'Макаров', 'Никитин', 'Захаров', 'Зайцев', 'Соловьёв', 'Борисов',
  'Яковлев', 'Григорьев', 'Романов', 'Белов',
];

const RUSSIAN_FEMALE_LAST = [
  'Иванова', 'Смирнова', 'Кузнецова', 'Попова', 'Васильева', 'Петрова', 'Соколова',
  'Михайлова', 'Новикова', 'Фёдорова', 'Морозова', 'Волкова', 'Алексеева', 'Лебедева',
  'Семёнова', 'Егорова', 'Павлова', 'Козлова', 'Степанова', 'Николаева', 'Орлова',
  'Андреева', 'Макарова', 'Никитина', 'Захарова', 'Зайцева', 'Соловьёва', 'Борисова',
  'Яковлева', 'Григорьева', 'Романова', 'Белова',
];

const ENGLISH_MALE_FIRST = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark',
  'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George',
  'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas',
];

const ENGLISH_FEMALE_FIRST = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica',
  'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley',
  'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa',
  'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy',
];

const ENGLISH_LAST = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
];

type Gender = 'male' | 'female' | 'any';
type NameType = 'first' | 'last' | 'full';
type Nationality = 'russian' | 'english';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RandomName() {
  const theme = useTheme();
  const [gender, setGender] = useState<Gender>('any');
  const [nameType, setNameType] = useState<NameType>('full');
  const [nationality, setNationality] = useState<Nationality>('russian');
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const generateName = useCallback((): string => {
    const isMale = gender === 'any' ? Math.random() > 0.5 : gender === 'male';

    if (nationality === 'russian') {
      const firstName = isMale ? pickRandom(RUSSIAN_MALE_FIRST) : pickRandom(RUSSIAN_FEMALE_FIRST);
      const lastName = isMale ? pickRandom(RUSSIAN_MALE_LAST) : pickRandom(RUSSIAN_FEMALE_LAST);

      if (nameType === 'first') return firstName;
      if (nameType === 'last') return lastName;
      return `${firstName} ${lastName}`;
    } else {
      const firstName = isMale ? pickRandom(ENGLISH_MALE_FIRST) : pickRandom(ENGLISH_FEMALE_FIRST);
      const lastName = pickRandom(ENGLISH_LAST);

      if (nameType === 'first') return firstName;
      if (nameType === 'last') return lastName;
      return `${firstName} ${lastName}`;
    }
  }, [gender, nameType, nationality]);

  const handleGenerate = () => {
    const names: string[] = [];
    const seen = new Set<string>();
    let attempts = 0;
    while (names.length < count && attempts < count * 10) {
      const name = generateName();
      if (!seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
      attempts++;
    }
    setResults(names);
  };

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: isEn ? 'Male' : 'Мужские' },
    { value: 'female', label: isEn ? 'Female' : 'Женские' },
    { value: 'any', label: isEn ? 'Any' : 'Любые' },
  ];

  const typeOptions: { value: NameType; label: string }[] = [
    { value: 'first', label: isEn ? 'First name' : 'Имя' },
    { value: 'last', label: isEn ? 'Last name' : 'Фамилия' },
    { value: 'full', label: isEn ? 'Full name' : 'Полное имя' },
  ];

  const natOptions: { value: Nationality; label: string }[] = [
    { value: 'russian', label: isEn ? 'Russian' : 'Русские' },
    { value: 'english', label: isEn ? 'English' : 'Английские' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {genderOptions.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setGender(opt.value)}
                variant={gender === opt.value ? 'filled' : 'outlined'}
                color={gender === opt.value ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {typeOptions.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setNameType(opt.value)}
                variant={nameType === opt.value ? 'filled' : 'outlined'}
                color={nameType === opt.value ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {natOptions.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setNationality(opt.value)}
                variant={nationality === opt.value ? 'filled' : 'outlined'}
                color={nationality === opt.value ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
              {isEn ? 'Count' : 'Количество'}: {count}
            </Typography>
            <Slider
              value={count}
              onChange={(_, val) => setCount(val as number)}
              min={1}
              max={20}
              step={1}
              marks={[
                { value: 1, label: '1' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 15, label: '15' },
                { value: 20, label: '20' },
              ]}
              sx={{ mx: 1 }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Casino />}
            onClick={handleGenerate}
            sx={{ borderRadius: 18, py: 1.2, textTransform: 'none', fontWeight: 600 }}
          >
            {isEn ? 'Generate' : 'Сгенерировать'}
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {results.length > 0 ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {isEn ? 'Result' : 'Результат'} ({results.length})
                </Typography>
                <CopyButton text={results.join('\n')} />
              </Box>

              {results.map((name, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    px: 2,
                    mb: 1,
                    borderRadius: 18,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Person sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                    <Typography variant="body1" fontWeight={500}>
                      {name}
                    </Typography>
                  </Box>
                  <CopyButton text={name} size="small" />
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 18,
                bgcolor: theme.palette.surfaceContainerLow,
                textAlign: 'center'
              }}
            >
              <Person sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {isEn ? 'Choose parameters and click "Generate"' : 'Выберите параметры и нажмите «Сгенерировать»'}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
