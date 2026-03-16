'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


type LicenseType = 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'ISC' | 'Unlicense';
type PresetType = 'basic' | 'detailed' | 'api' | 'library';

interface ReadmeState {
  projectName: string;
  description: string;
  techStack: string[];
  features: string[];
  installSteps: string[];
  usage: string;
  license: LicenseType;
  showBadges: boolean;
  showToc: boolean;
  showContributing: boolean;
  showContact: boolean;
}

const defaultState: ReadmeState = {
  projectName: '',
  description: '',
  techStack: [],
  features: [],
  installSteps: [],
  usage: '',
  license: 'MIT',
  showBadges: true,
  showToc: true,
  showContributing: false,
  showContact: false
};

function getPresets(isEn: boolean): Record<PresetType, Partial<ReadmeState>> {
  return {
    basic: {
      projectName: 'My Project',
      description: isEn ? 'A brief project description.' : 'Краткое описание проекта.',
      techStack: ['JavaScript', 'Node.js'],
      features: isEn ? ['Fast performance', 'Easy setup'] : ['Быстрая работа', 'Простая настройка'],
      installSteps: ['npm install', 'npm start'],
      usage: isEn ? 'Run the project with `npm start`.' : 'Запустите проект командой `npm start`.',
      license: 'MIT',
      showBadges: true,
      showToc: false,
      showContributing: false,
      showContact: false
    },
    detailed: {
      projectName: 'My Awesome Project',
      description: isEn ? 'Detailed project description with full documentation.' : 'Подробное описание проекта с полной документацией.',
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      features: isEn ? ['User authentication', 'REST API', 'Responsive design', 'Dark theme'] : ['Аутентификация пользователей', 'REST API', 'Адаптивный дизайн', 'Тёмная тема'],
      installSteps: ['git clone https://github.com/user/repo.git', 'cd repo', 'npm install', 'cp .env.example .env', 'npm run dev'],
      usage: isEn ? '```bash\nnpm run dev\n```\nOpen http://localhost:3000 in your browser.' : '```bash\nnpm run dev\n```\nОткройте http://localhost:3000 в браузере.',
      license: 'MIT',
      showBadges: true,
      showToc: true,
      showContributing: true,
      showContact: true
    },
    api: {
      projectName: 'My API',
      description: isEn ? 'RESTful API service.' : 'RESTful API сервис.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      features: isEn ? ['CRUD operations', 'JWT authentication', 'Data validation', 'Swagger documentation'] : ['CRUD операции', 'Аутентификация JWT', 'Валидация данных', 'Swagger документация'],
      installSteps: ['npm install', 'cp .env.example .env', 'npm run migrate', 'npm start'],
      usage: '```\nGET /api/v1/users\nPOST /api/v1/auth/login\n```',
      license: 'Apache-2.0',
      showBadges: true,
      showToc: true,
      showContributing: true,
      showContact: false
    },
    library: {
      projectName: 'my-library',
      description: isEn ? 'A convenient library for solving tasks.' : 'Удобная библиотека для решения задач.',
      techStack: ['TypeScript'],
      features: isEn ? ['Type safety', 'Zero dependencies', 'Tree-shaking', 'ESM & CJS'] : ['Типобезопасность', 'Нулевые зависимости', 'Tree-shaking', 'ESM & CJS'],
      installSteps: ['npm install my-library'],
      usage: '```typescript\nimport { myFunction } from \'my-library\';\n\nconst result = myFunction(data);\n```',
      license: 'MIT',
      showBadges: true,
      showToc: false,
      showContributing: true,
      showContact: false
    }
  };
}

function generateReadme(state: ReadmeState, isEn: boolean): string {
  const lines: string[] = [];

  if (state.showBadges && state.projectName) {
    lines.push(`![License](https://img.shields.io/badge/license-${state.license}-blue.svg)`);
    lines.push(`![Version](https://img.shields.io/badge/version-1.0.0-green.svg)`);
    lines.push(`![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)`);
    lines.push('');
  }

  lines.push(`# ${state.projectName || (isEn ? 'Project Name' : 'Название проекта')}`);
  lines.push('');

  if (state.description) {
    lines.push(state.description);
    lines.push('');
  }

  if (state.showToc) {
    lines.push(isEn ? '## Table of Contents' : '## Содержание');
    lines.push('');
    if (state.techStack.length) lines.push(isEn ? '- [Tech Stack](#tech-stack)' : '- [Технологии](#технологии)');
    if (state.features.length) lines.push(isEn ? '- [Features](#features)' : '- [Возможности](#возможности)');
    if (state.installSteps.length) lines.push(isEn ? '- [Installation](#installation)' : '- [Установка](#установка)');
    if (state.usage) lines.push(isEn ? '- [Usage](#usage)' : '- [Использование](#использование)');
    if (state.showContributing) lines.push(isEn ? '- [Contributing](#contributing)' : '- [Вклад в проект](#вклад-в-проект)');
    lines.push(isEn ? '- [License](#license)' : '- [Лицензия](#лицензия)');
    if (state.showContact) lines.push(isEn ? '- [Contact](#contact)' : '- [Контакты](#контакты)');
    lines.push('');
  }

  if (state.techStack.length) {
    lines.push(isEn ? '## Tech Stack' : '## Технологии');
    lines.push('');
    state.techStack.forEach((tech) => lines.push(`- ${tech}`));
    lines.push('');
  }

  if (state.features.length) {
    lines.push(isEn ? '## Features' : '## Возможности');
    lines.push('');
    state.features.forEach((f) => lines.push(`- ${f}`));
    lines.push('');
  }

  if (state.installSteps.length) {
    lines.push(isEn ? '## Installation' : '## Установка');
    lines.push('');
    lines.push('```bash');
    state.installSteps.forEach((step) => lines.push(step));
    lines.push('```');
    lines.push('');
  }

  if (state.usage) {
    lines.push(isEn ? '## Usage' : '## Использование');
    lines.push('');
    lines.push(state.usage);
    lines.push('');
  }

  if (state.showContributing) {
    lines.push(isEn ? '## Contributing' : '## Вклад в проект');
    lines.push('');
    if (isEn) {
      lines.push('1. Fork the repository');
      lines.push('2. Create a branch (`git checkout -b feature/amazing-feature`)');
      lines.push('3. Commit your changes (`git commit -m \'Add amazing feature\'`)');
      lines.push('4. Push the branch (`git push origin feature/amazing-feature`)');
      lines.push('5. Open a Pull Request');
    } else {
      lines.push('1. Форкните репозиторий');
      lines.push('2. Создайте ветку (`git checkout -b feature/amazing-feature`)');
      lines.push('3. Закоммитьте изменения (`git commit -m \'Add amazing feature\'`)');
      lines.push('4. Запушьте ветку (`git push origin feature/amazing-feature`)');
      lines.push('5. Откройте Pull Request');
    }
    lines.push('');
  }

  lines.push(isEn ? '## License' : '## Лицензия');
  lines.push('');
  lines.push(isEn
    ? `This project is licensed under the ${state.license} License. See the [LICENSE](LICENSE) file for details.`
    : `Этот проект распространяется под лицензией ${state.license}. Подробности в файле [LICENSE](LICENSE).`);
  lines.push('');

  if (state.showContact) {
    lines.push(isEn ? '## Contact' : '## Контакты');
    lines.push('');
    lines.push(isEn ? 'Author - [@username](https://github.com/username)' : 'Автор - [@username](https://github.com/username)');
    lines.push('');
    lines.push((isEn ? 'Project link: [https://github.com/username/' : 'Ссылка на проект: [https://github.com/username/') + (state.projectName || 'project').toLowerCase().replace(/\s+/g, '-') + '](https://github.com/username/' + (state.projectName || 'project').toLowerCase().replace(/\s+/g, '-') + ')');
    lines.push('');
  }

  return lines.join('\n');
}

export default function GithubReadme() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [state, setState] = useState<ReadmeState>(defaultState);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [stepInput, setStepInput] = useState('');
  const updateField = <K extends keyof ReadmeState>(key: K, value: ReadmeState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const addTech = () => {
    if (techInput.trim()) {
      updateField('techStack', [...state.techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (index: number) => {
    updateField('techStack', state.techStack.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      updateField('features', [...state.features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    updateField('features', state.features.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (stepInput.trim()) {
      updateField('installSteps', [...state.installSteps, stepInput.trim()]);
      setStepInput('');
    }
  };

  const removeStep = (index: number) => {
    updateField('installSteps', state.installSteps.filter((_, i) => i !== index));
  };

  const applyPreset = (preset: PresetType) => {
    setState({ ...defaultState, ...getPresets(isEn)[preset] });
  };

  const markdown = generateReadme(state, isEn);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Presets */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          {isEn ? 'Templates' : 'Шаблоны'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={() => applyPreset('basic')} sx={{ borderRadius: 2 }}>
            {isEn ? 'Basic' : 'Базовый'}
          </Button>
          <Button size="small" variant="outlined" onClick={() => applyPreset('detailed')} sx={{ borderRadius: 2 }}>
            {isEn ? 'Detailed' : 'Подробный'}
          </Button>
          <Button size="small" variant="outlined" onClick={() => applyPreset('api')} sx={{ borderRadius: 2 }}>
            API
          </Button>
          <Button size="small" variant="outlined" onClick={() => applyPreset('library')} sx={{ borderRadius: 2 }}>
            {isEn ? 'Library' : 'Библиотека'}
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {/* Editor */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              background: theme.palette.surfaceContainerLow
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={isEn ? "Project name" : "Название проекта"}
              value={state.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              placeholder={isEn ? "Project description" : "Описание проекта"}
              multiline
              rows={2}
              value={state.description}
              onChange={(e) => updateField('description', e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Tech stack */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Tech Stack' : 'Технологии'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="React, Node.js..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <IconButton onClick={addTech} color="primary" size="small">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
              {state.techStack.map((tech, i) => (
                <Chip key={i} label={tech} size="small" onDelete={() => removeTech(i)} />
              ))}
            </Box>

            {/* Features */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Features' : 'Возможности'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={isEn ? "Feature description..." : "Описание функции..."}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <IconButton onClick={addFeature} color="primary" size="small">
                <AddIcon />
              </IconButton>
            </Box>
            {state.features.map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {f}
                </Typography>
                <IconButton size="small" onClick={() => removeFeature(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {/* Install steps */}
            <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Installation steps' : 'Шаги установки'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="npm install..."
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
              />
              <IconButton onClick={addStep} color="primary" size="small">
                <AddIcon />
              </IconButton>
            </Box>
            {state.installSteps.map((step, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {step}
                </Typography>
                <IconButton size="small" onClick={() => removeStep(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            {/* Usage */}
            <TextField
              fullWidth
              size="small"
              placeholder={isEn ? "Usage" : "Использование"}
              multiline
              rows={3}
              value={state.usage}
              onChange={(e) => updateField('usage', e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />

            {/* License */}
            <TextField
              select
              fullWidth
              size="small"
              label={isEn ? "License" : "Лицензия"}
              value={state.license}
              onChange={(e) => updateField('license', e.target.value as LicenseType)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="MIT">MIT</MenuItem>
              <MenuItem value="Apache-2.0">Apache 2.0</MenuItem>
              <MenuItem value="GPL-3.0">GPL 3.0</MenuItem>
              <MenuItem value="BSD-3-Clause">BSD 3-Clause</MenuItem>
              <MenuItem value="ISC">ISC</MenuItem>
              <MenuItem value="Unlicense">Unlicense</MenuItem>
            </TextField>

            {/* Toggles */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
              <FormControlLabel
                control={<Switch size="small" checked={state.showBadges} onChange={(e) => updateField('showBadges', e.target.checked)} />}
                label={<Typography variant="body2">{isEn ? 'Badges' : 'Бейджи'}</Typography>}
              />
              <FormControlLabel
                control={<Switch size="small" checked={state.showToc} onChange={(e) => updateField('showToc', e.target.checked)} />}
                label={<Typography variant="body2">{isEn ? 'Table of Contents' : 'Содержание'}</Typography>}
              />
              <FormControlLabel
                control={<Switch size="small" checked={state.showContributing} onChange={(e) => updateField('showContributing', e.target.checked)} />}
                label={<Typography variant="body2">{isEn ? 'Contributing' : 'Вклад'}</Typography>}
              />
              <FormControlLabel
                control={<Switch size="small" checked={state.showContact} onChange={(e) => updateField('showContact', e.target.checked)} />}
                label={<Typography variant="body2">{isEn ? 'Contact' : 'Контакты'}</Typography>}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              background: theme.palette.surfaceContainerLow
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {isEn ? 'Preview' : 'Предпросмотр'}
              </Typography>
              <CopyButton text={markdown} />
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                maxHeight: 600,
                overflow: 'auto'
              }}
            >
              <pre
                style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                  color: theme.palette.text.primary
                }}
              >
                {markdown}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
