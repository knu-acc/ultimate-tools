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
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
} from '@mui/material';

function isValidCidrNotation(input: string): boolean {
  const match = input.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) return false;
  const octets = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
  const cidr = parseInt(match[5]);
  if (octets.some((o) => o < 0 || o > 255)) return false;
  if (cidr < 0 || cidr > 32) return false;
  return true;
}

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

interface SubnetResult {
  index: number;
  network: string;
  firstHost: string;
  lastHost: string;
  broadcast: string;
  mask: string;
  cidr: number;
  hosts: number;
}

function divideBySubnets(networkIp: string, baseCidr: number, numSubnets: number): SubnetResult[] {
  const bitsNeeded = Math.ceil(Math.log2(numSubnets));
  const newCidr = baseCidr + bitsNeeded;
  if (newCidr > 30) return [];

  const actualSubnets = Math.pow(2, bitsNeeded);
  const baseNetwork = ipToNumber(networkIp);
  const baseMask = baseCidr === 0 ? 0 : (0xffffffff << (32 - baseCidr)) >>> 0;
  const networkAddr = (baseNetwork & baseMask) >>> 0;

  const subnetSize = Math.pow(2, 32 - newCidr);
  const newMask = (0xffffffff << (32 - newCidr)) >>> 0;
  const hostsPerSubnet = subnetSize - 2;

  const results: SubnetResult[] = [];
  for (let i = 0; i < actualSubnets; i++) {
    const subNetwork = (networkAddr + i * subnetSize) >>> 0;
    const broadcast = (subNetwork + subnetSize - 1) >>> 0;
    results.push({
      index: i + 1,
      network: numberToIp(subNetwork) + '/' + newCidr,
      firstHost: numberToIp((subNetwork + 1) >>> 0),
      lastHost: numberToIp((broadcast - 1) >>> 0),
      broadcast: numberToIp(broadcast),
      mask: numberToIp(newMask),
      cidr: newCidr,
      hosts: hostsPerSubnet,
    });
  }
  return results;
}

function divideByHosts(networkIp: string, baseCidr: number, hostsNeeded: number): SubnetResult[] {
  const bitsForHosts = Math.ceil(Math.log2(hostsNeeded + 2));
  const newCidr = 32 - bitsForHosts;
  if (newCidr <= baseCidr || newCidr > 30) {
    if (newCidr === baseCidr) {
      // Exactly one subnet
    } else if (newCidr < baseCidr) {
      return [];
    }
  }

  const subnetSize = Math.pow(2, bitsForHosts);
  const totalSize = Math.pow(2, 32 - baseCidr);
  const numSubnets = Math.floor(totalSize / subnetSize);
  if (numSubnets <= 0) return [];

  const baseNetwork = ipToNumber(networkIp);
  const baseMask = baseCidr === 0 ? 0 : (0xffffffff << (32 - baseCidr)) >>> 0;
  const networkAddr = (baseNetwork & baseMask) >>> 0;
  const newMask = (0xffffffff << bitsForHosts) >>> 0;
  const hostsPerSubnet = subnetSize - 2;

  const results: SubnetResult[] = [];
  for (let i = 0; i < numSubnets; i++) {
    const subNetwork = (networkAddr + i * subnetSize) >>> 0;
    const broadcast = (subNetwork + subnetSize - 1) >>> 0;
    results.push({
      index: i + 1,
      network: numberToIp(subNetwork) + '/' + newCidr,
      firstHost: numberToIp((subNetwork + 1) >>> 0),
      lastHost: numberToIp((broadcast - 1) >>> 0),
      broadcast: numberToIp(broadcast),
      mask: numberToIp(newMask),
      cidr: newCidr,
      hosts: hostsPerSubnet,
    });
  }
  return results;
}

interface VlsmRequest {
  hosts: number;
  name: string;
}

function vlsmDivide(networkIp: string, baseCidr: number, requests: VlsmRequest[]): SubnetResult[] {
  const sorted = [...requests].sort((a, b) => b.hosts - a.hosts);
  const baseNetwork = ipToNumber(networkIp);
  const baseMask = baseCidr === 0 ? 0 : (0xffffffff << (32 - baseCidr)) >>> 0;
  let currentAddr = (baseNetwork & baseMask) >>> 0;
  const maxAddr = (currentAddr + Math.pow(2, 32 - baseCidr)) >>> 0;

  const results: SubnetResult[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const bitsForHosts = Math.ceil(Math.log2(sorted[i].hosts + 2));
    const newCidr = 32 - bitsForHosts;
    if (newCidr < baseCidr || newCidr > 30) continue;

    const subnetSize = Math.pow(2, bitsForHosts);
    // Align to subnet boundary
    const aligned = (Math.ceil(currentAddr / subnetSize) * subnetSize) >>> 0;
    if (aligned + subnetSize > maxAddr) continue;

    const broadcast = (aligned + subnetSize - 1) >>> 0;
    const newMask = (0xffffffff << bitsForHosts) >>> 0;
    results.push({
      index: i + 1,
      network: numberToIp(aligned) + '/' + newCidr,
      firstHost: numberToIp((aligned + 1) >>> 0),
      lastHost: numberToIp((broadcast - 1) >>> 0),
      broadcast: numberToIp(broadcast),
      mask: numberToIp(newMask),
      cidr: newCidr,
      hosts: subnetSize - 2,
    });
    currentAddr = (broadcast + 1) >>> 0;
  }
  return results;
}

type Mode = 'subnets' | 'hosts' | 'vlsm';

export default function SubnetCalc() {
  const theme = useTheme();
  const [network, setNetwork] = useState('192.168.1.0/24');
  const [mode, setMode] = useState<Mode>('subnets');
  const [numSubnets, setNumSubnets] = useState('4');
  const [numHosts, setNumHosts] = useState('50');
  const [vlsmInput, setVlsmInput] = useState('100, 50, 25, 10');
  const [results, setResults] = useState<SubnetResult[]>([]);
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    if (!isValidCidrNotation(network)) return;
    const [ip, cidrStr] = network.split('/');
    const cidr = parseInt(cidrStr);

    let res: SubnetResult[] = [];
    if (mode === 'subnets') {
      const n = parseInt(numSubnets);
      if (isNaN(n) || n < 1) return;
      res = divideBySubnets(ip, cidr, n);
    } else if (mode === 'hosts') {
      const n = parseInt(numHosts);
      if (isNaN(n) || n < 1) return;
      res = divideByHosts(ip, cidr, n);
    } else {
      const hostsList = vlsmInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)
        .map((s, i) => ({ hosts: parseInt(s), name: `Подсеть ${i + 1}` }))
        .filter((r) => !isNaN(r.hosts) && r.hosts > 0);
      if (hostsList.length === 0) return;
      res = vlsmDivide(ip, cidr, hostsList);
    }
    setResults(res);
    setCalculated(true);
  };

  const validNetwork = network === '' || isValidCidrNotation(network);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Режим деления
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, val) => {
            if (val !== null) {
              setMode(val);
              setCalculated(false);
            }
          }}
          size="small"
          sx={{
            mb: 2.5,
            '& .MuiToggleButton-root': {
              borderRadius: 3,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                background: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.18),
                },
              },
            },
          }}
        >
          <ToggleButton value="subnets">По количеству подсетей</ToggleButton>
          <ToggleButton value="hosts">По количеству хостов</ToggleButton>
          <ToggleButton value="vlsm">VLSM</ToggleButton>
        </ToggleButtonGroup>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              size="small"
              fullWidth
              value={network}
              onChange={(e) => {
                setNetwork(e.target.value);
                setCalculated(false);
              }}
              label="Адрес сети с CIDR"
              placeholder="192.168.1.0/24"
              error={!validNetwork}
              helperText={!validNetwork ? 'Формат: IP/CIDR (например, 192.168.1.0/24)' : ''}
              slotProps={{ htmlInput: { style: { fontFamily: 'monospace' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {mode === 'subnets' && (
              <TextField
                size="small"
                fullWidth
                type="number"
                value={numSubnets}
                onChange={(e) => {
                  setNumSubnets(e.target.value);
                  setCalculated(false);
                }}
                label="Количество подсетей"
                slotProps={{ htmlInput: { min: 1, max: 256 } }}
              />
            )}
            {mode === 'hosts' && (
              <TextField
                size="small"
                fullWidth
                type="number"
                value={numHosts}
                onChange={(e) => {
                  setNumHosts(e.target.value);
                  setCalculated(false);
                }}
                label="Хостов на подсеть"
                slotProps={{ htmlInput: { min: 1 } }}
              />
            )}
            {mode === 'vlsm' && (
              <TextField
                size="small"
                fullWidth
                value={vlsmInput}
                onChange={(e) => {
                  setVlsmInput(e.target.value);
                  setCalculated(false);
                }}
                label="Количество хостов (через запятую)"
                placeholder="100, 50, 25, 10"
              />
            )}
          </Grid>
        </Grid>
        <Button
          variant="contained"
          onClick={handleCalculate}
          disabled={!validNetwork || network === ''}
          sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
        >
          Рассчитать
        </Button>
      </Paper>

      {calculated && results.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Результат: {results.length} подсетей
            </Typography>
            {mode === 'vlsm' && (
              <Chip label="VLSM" size="small" color="primary" variant="outlined" sx={{ borderRadius: 2 }} />
            )}
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                '& th, & td': {
                  p: 1.5,
                  textAlign: 'center',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                },
                '& th': {
                  fontWeight: 600,
                  color: 'text.secondary',
                  background: alpha(theme.palette.primary.main, 0.04),
                },
                '& td': {
                  fontFamily: 'monospace',
                },
                '& tr:hover td': {
                  background: alpha(theme.palette.primary.main, 0.03),
                },
              }}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Подсеть</th>
                  <th>Диапазон хостов</th>
                  <th>Широковещательный</th>
                  <th>Маска</th>
                  <th>Хостов</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.index}>
                    <td>{r.index}</td>
                    <td>{r.network}</td>
                    <td>
                      {r.firstHost} — {r.lastHost}
                    </td>
                    <td>{r.broadcast}</td>
                    <td>{r.mask}</td>
                    <td>{r.hosts.toLocaleString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </Paper>
      )}

      {calculated && results.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography color="text.secondary">
            Невозможно разделить сеть с заданными параметрами. Проверьте входные данные.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
