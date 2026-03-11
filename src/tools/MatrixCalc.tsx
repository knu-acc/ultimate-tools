'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme } from '@mui/material';

type MatrixSize = 2 | 3 | 4;
type Matrix = number[][];

function createEmpty(size: MatrixSize): string[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
}

function parseMatrix(raw: string[][]): Matrix {
  return raw.map((row) => row.map((v) => (v === '' ? 0 : parseFloat(v))));
}

function determinant(m: Matrix): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor: Matrix = [];
    for (let i = 1; i < n; i++) {
      minor.push(m[i].filter((_, idx) => idx !== j));
    }
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinant(minor);
  }
  return det;
}

function multiply(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  const result: Matrix = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

function transpose(m: Matrix): Matrix {
  const n = m.length;
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => m[j][i]));
}

export default function MatrixCalc() {
  const theme = useTheme();
  const [size, setSize] = useState<MatrixSize>(2);
  const [matA, setMatA] = useState<string[][]>(createEmpty(2));
  const [matB, setMatB] = useState<string[][]>(createEmpty(2));
  const [operation, setOperation] = useState<string | null>(null);

  const handleSizeChange = (_: unknown, val: MatrixSize | null) => {
    if (val) {
      setSize(val);
      setMatA(createEmpty(val));
      setMatB(createEmpty(val));
      setOperation(null);
    }
  };

  const updateCell = (
    setter: React.Dispatch<React.SetStateAction<string[][]>>,
    row: number,
    col: number,
    value: string,
  ) => {
    setter((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  };

  const result = useMemo<{ matrix?: Matrix; scalar?: number; label: string } | null>(() => {
    if (!operation) return null;
    const a = parseMatrix(matA);
    const b = parseMatrix(matB);

    switch (operation) {
      case 'add': {
        const r = a.map((row, i) => row.map((v, j) => v + b[i][j]));
        return { matrix: r, label: 'A + B' };
      }
      case 'sub': {
        const r = a.map((row, i) => row.map((v, j) => v - b[i][j]));
        return { matrix: r, label: 'A - B' };
      }
      case 'mul': {
        return { matrix: multiply(a, b), label: 'A \u00d7 B' };
      }
      case 'transposeA': {
        return { matrix: transpose(a), label: 'A\u1d40' };
      }
      case 'transposeB': {
        return { matrix: transpose(b), label: 'B\u1d40' };
      }
      case 'detA': {
        return { scalar: determinant(a), label: 'det(A)' };
      }
      case 'detB': {
        return { scalar: determinant(b), label: 'det(B)' };
      }
      default:
        return null;
    }
  }, [operation, matA, matB]);

  const formatNum = (n: number) => {
    if (Number.isInteger(n)) return n.toString();
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 4 });
  };

  const MatrixInput = ({
    label,
    matrix,
    setter
  }: {
    label: string;
    matrix: string[][];
    setter: React.Dispatch<React.SetStateAction<string[][]>>;
  }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 1fr)`, gap: 1 }}>
        {Array.from({ length: size }, (_, i) =>
          Array.from({ length: size }, (_, j) => (
            <TextField
              key={`${i}-${j}`}
              size="small"
              type="number"
              value={matrix[i]?.[j] ?? ''}
              onChange={(e) => updateCell(setter, i, j, e.target.value)}
              slotProps={{
                input: {
                  sx: {
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }
                }
              }}
              sx={{ '& input': { textAlign: 'center', p: 1 } }}
            />
          )),
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Size selector */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          \u0420\u0430\u0437\u043c\u0435\u0440 \u043c\u0430\u0442\u0440\u0438\u0446\u044b
        </Typography>
        <ToggleButtonGroup
          value={size}
          exclusive
          onChange={handleSizeChange}
          size="small"
          sx={{ mb: 0 }}
        >
          <ToggleButton value={2} sx={{ textTransform: 'none', fontWeight: 600 }}>
            2\u00d72
          </ToggleButton>
          <ToggleButton value={3} sx={{ textTransform: 'none', fontWeight: 600 }}>
            3\u00d73
          </ToggleButton>
          <ToggleButton value={4} sx={{ textTransform: 'none', fontWeight: 600 }}>
            4\u00d74
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Matrix inputs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MatrixInput label="\u041c\u0430\u0442\u0440\u0438\u0446\u0430 A" matrix={matA} setter={setMatA} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MatrixInput label="\u041c\u0430\u0442\u0440\u0438\u0446\u0430 B" matrix={matB} setter={setMatB} />
        </Grid>
      </Grid>

      {/* Operations */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant={operation === 'add' ? 'contained' : 'outlined'}
            onClick={() => setOperation('add')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            A + B
          </Button>
          <Button
            variant={operation === 'sub' ? 'contained' : 'outlined'}
            onClick={() => setOperation('sub')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            A - B
          </Button>
          <Button
            variant={operation === 'mul' ? 'contained' : 'outlined'}
            onClick={() => setOperation('mul')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            A \u00d7 B
          </Button>
          <Button
            variant={operation === 'transposeA' ? 'contained' : 'outlined'}
            onClick={() => setOperation('transposeA')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            A\u1d40
          </Button>
          <Button
            variant={operation === 'transposeB' ? 'contained' : 'outlined'}
            onClick={() => setOperation('transposeB')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            B\u1d40
          </Button>
          <Button
            variant={operation === 'detA' ? 'contained' : 'outlined'}
            onClick={() => setOperation('detA')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            det(A)
          </Button>
          <Button
            variant={operation === 'detB' ? 'contained' : 'outlined'}
            onClick={() => setOperation('detB')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            det(B)
          </Button>
        </Box>
      </Paper>

      {/* Result */}
      {result && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: theme.palette.surfaceContainerLow
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              \u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442
            </Typography>
            <Chip
              label={result.label}
              size="small"
              color="primary"
              sx={{ fontFamily: 'monospace', fontWeight: 700 }}
            />
          </Box>

          {result.scalar !== undefined && (
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, fontFamily: 'monospace', textAlign: 'center', color: 'primary.main' }}
            >
              {formatNum(result.scalar)}
            </Typography>
          )}

          {result.matrix && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                gap: 1,
                maxWidth: size <= 3 ? 300 : 400,
                mx: 'auto'
              }}
            >
              {result.matrix.map((row, i) =>
                row.map((val, j) => (
                  <Paper
                    key={`${i}-${j}`}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      textAlign: 'center',
                      borderRadius: 2,
                      background: theme.palette.surfaceContainerLow
                    }}
                  >
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {formatNum(val)}
                    </Typography>
                  </Paper>
                )),
              )}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
