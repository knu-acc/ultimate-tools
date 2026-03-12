'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'FULL JOIN', 'CROSS JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS',
  'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'ORDER BY', 'GROUP BY',
  'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'INSERT INTO',
  'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE',
  'DROP TABLE', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'NULL',
  'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'INDEX', 'INTO',
];

const NEWLINE_BEFORE = [
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
  'FULL JOIN', 'CROSS JOIN', 'ON', 'ORDER BY', 'GROUP BY', 'HAVING',
  'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'INSERT INTO', 'UPDATE',
  'SET', 'DELETE FROM', 'VALUES', 'AND', 'OR',
];

function formatSql(sql: string): string {
  if (!sql.trim()) return '';

  let formatted = sql.trim();

  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, ' ');

  // Capitalize SQL keywords (case-insensitive replacement)
  // Sort by length descending so multi-word keywords match first
  const sortedKeywords = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    const regex = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  }

  // Add newlines before major keywords
  const sortedNewline = [...NEWLINE_BEFORE].sort((a, b) => b.length - a.length);
  for (const kw of sortedNewline) {
    const regex = new RegExp(`\\s+${kw.replace(/\s+/g, '\\s+')}\\b`, 'g');
    formatted = formatted.replace(regex, `\n${kw}`);
  }

  // Indent lines after SELECT (columns), ON, SET, VALUES, AND, OR
  const lines = formatted.split('\n');
  const result: string[] = [];
  let indentLevel = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle subquery parentheses
    const opensCount = (line.match(/\(/g) || []).length;
    const closesCount = (line.match(/\)/g) || []).length;

    // Decrease indent for closing keywords at the same level
    if (/^(FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|SET|VALUES)\b/.test(line)) {
      // Keep same level as SELECT/UPDATE/etc
      result.push('  '.repeat(indentLevel) + line);
    } else if (/^(AND|OR)\b/.test(line)) {
      result.push('  '.repeat(indentLevel + 1) + line);
    } else if (/^(ON)\b/.test(line)) {
      result.push('  '.repeat(indentLevel + 1) + line);
    } else if (/^(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN)\b/.test(line)) {
      result.push('  '.repeat(indentLevel) + line);
    } else if (/^(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|UNION|UNION ALL)\b/.test(line)) {
      result.push('  '.repeat(indentLevel) + line);
    } else {
      result.push('  '.repeat(indentLevel + 1) + line);
    }

    // Adjust indent for subqueries
    indentLevel += opensCount - closesCount;
    if (indentLevel < 0) indentLevel = 0;
  }

  return result.join('\n');
}

function minifySql(sql: string): string {
  if (!sql.trim()) return '';
  // Remove comments
  let result = sql.replace(/--.*$/gm, '');
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse whitespace
  result = result.replace(/\s+/g, ' ');
  return result.trim();
}

export default function SqlFormatter() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = () => {
    const result = formatSql(input);
    setOutput(result);
  };

  const handleMinify = () => {
    const result = minifySql(input);
    setOutput(result);
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  const stats = output
    ? {
        lines: output.split('\n').length,
        bytes: new TextEncoder().encode(output).length
      }
    : null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          multiline
          rows={10}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Вставьте SQL запрос сюда..."
          sx={{
            mb: 2.5,
            '& .MuiInputBase-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2.5 }}>
          <Button
            variant="contained"
            onClick={handleFormat}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
          >
            Форматировать
          </Button>
          <Button
            variant="contained"
            onClick={handleMinify}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
          >
            Минифицировать
          </Button>
          <Button
            variant="outlined"
            onClick={clear}
            color="inherit"
            sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Очистить
          </Button>
        </Box>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              size="small"
              label={`${stats.lines} строк`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={`${stats.bytes.toLocaleString()} байт`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}

        {/* Output */}
        {output && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <CopyButton text={output} />
            </Box>
            <TextField
              multiline
              rows={10}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.black, 0.3)
                    : alpha(theme.palette.grey[50], 1)
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        )}
      </Paper>

    </Box>
  );
}
