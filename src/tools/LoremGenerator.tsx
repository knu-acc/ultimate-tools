'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Slider,
  Switch,
  FormControlLabel,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
  'quas', 'molestias', 'recusandae', 'itaque', 'earum', 'rerum', 'hic', 'tenetur',
  'sapiente', 'delectus', 'aut', 'reiciendis', 'voluptatibus', 'maiores', 'alias',
  'perferendis', 'doloribus', 'asperiores', 'repellat', 'temporibus', 'quibusdam',
  'illum', 'fugit', 'quo', 'voluptas', 'nemo', 'ipsam', 'quia', 'consequuntur',
  'magni', 'numquam', 'eius', 'modi', 'tempora', 'neque', 'porro', 'quisquam',
  'dolorem', 'adipisci', 'quaerat', 'inventore', 'veritatis', 'quasi',
  'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'aspernatur',
  'odit', 'nihil', 'molestiae', 'laudantium', 'totam', 'rem', 'aperiam',
  'eaque', 'ipsa', 'ab', 'illo',
];

const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function getRandomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(minWords: number, maxWords: number): string {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord());
  }
  // Capitalize first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  // Random commas
  if (words.length > 6) {
    const commaPos = 2 + Math.floor(Math.random() * (words.length - 4));
    words[commaPos] = words[commaPos] + ',';
  }
  return words.join(' ') + '.';
}

function generateParagraph(targetWords: number): string {
  const sentences: string[] = [];
  let wordCount = 0;
  while (wordCount < targetWords) {
    const remaining = targetWords - wordCount;
    const sentenceLen = Math.min(remaining, 6 + Math.floor(Math.random() * 10));
    if (sentenceLen < 3) break;
    const sentence = generateSentence(sentenceLen, sentenceLen);
    sentences.push(sentence);
    wordCount += sentence.split(' ').length;
  }
  return sentences.join(' ');
}

export default function LoremGenerator() {
  const theme = useTheme();
  const [paragraphCount, setParagraphCount] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  const stats = useMemo(() => {
    if (!output) return { words: 0, chars: 0, charsNoSpace: 0, paragraphs: 0 };
    const paragraphs = output.split('\n\n').filter(Boolean).length;
    const words = output.split(/\s+/).filter(Boolean).length;
    const chars = output.length;
    const charsNoSpace = output.replace(/\s/g, '').length;
    return { words, chars, charsNoSpace, paragraphs };
  }, [output]);

  const handleGenerate = () => {
    const paragraphs: string[] = [];
    for (let i = 0; i < paragraphCount; i++) {
      if (i === 0 && startWithLorem) {
        // First paragraph starts with classic Lorem ipsum
        const remaining = wordsPerParagraph - LOREM_START.split(' ').length;
        if (remaining > 3) {
          paragraphs.push(LOREM_START + ' ' + generateParagraph(remaining));
        } else {
          paragraphs.push(LOREM_START);
        }
      } else {
        paragraphs.push(generateParagraph(wordsPerParagraph));
      }
    }
    setOutput(paragraphs.join('\n\n'));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3, background: theme.palette.surfaceContainerLow }}>
        <TextField
          fullWidth
          placeholder="Абзацы"
          type="number"
          value={paragraphCount}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) setParagraphCount(Math.max(1, Math.min(20, v)));
          }}
          slotProps={{
            input: { inputProps: { min: 1, max: 20 } }
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Слов в абзаце: <strong>{wordsPerParagraph}</strong>
        </Typography>
        <Slider
          value={wordsPerParagraph}
          onChange={(_, v) => setWordsPerParagraph(v as number)}
          min={10}
          max={200}
          step={5}
          marks={[
            { value: 10, label: '10' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' },
            { value: 200, label: '200' },
          ]}
          sx={{ mb: 2 }}
        />

        {/* Lorem toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
            />
          }
          label={
            <Typography variant="body2">
              Начинать с &quot;Lorem ipsum dolor sit amet...&quot;
            </Typography>
          }
          sx={{ mb: 2, display: 'block' }}
        />

        <Button
          variant="contained"
          onClick={handleGenerate}
          fullWidth
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 3 }}
        >
          Сгенерировать
        </Button>
      </Paper>

      {/* Output */}
      {output && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              background: theme.palette.surfaceContainerLow
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {[
                { label: 'Абзацы', value: stats.paragraphs },
                { label: 'Слова', value: stats.words },
                { label: 'Символы', value: stats.chars },
                { label: 'Без пробелов', value: stats.charsNoSpace },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: 'center', minWidth: 80 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {item.value.toLocaleString('ru-RU')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <CopyButton text={output} />
            </Box>
            <Box
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.text.primary, 0.03)
              }}
            >
              {output.split('\n\n').map((paragraph, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{
                    mb: i < stats.paragraphs - 1 ? 2 : 0,
                    lineHeight: 1.8,
                    color: 'text.primary'
                  }}
                >
                  {paragraph}
                </Typography>
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
