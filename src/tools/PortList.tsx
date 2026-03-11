'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

type Protocol = 'TCP' | 'UDP' | 'TCP/UDP';
type Category = 'web' | 'email' | 'database' | 'file' | 'remote' | 'messaging' | 'other';

interface PortEntry {
  port: number;
  protocol: Protocol;
  service: string;
  description: string;
  category: Category;
}

const categoryLabels: Record<Category, string> = {
  web: 'Веб',
  email: 'Почта',
  database: 'Базы данных',
  file: 'Передача файлов',
  remote: 'Удалённый доступ',
  messaging: 'Сообщения',
  other: 'Другое',
};

const ports: PortEntry[] = [
  { port: 20, protocol: 'TCP', service: 'FTP-DATA', description: 'Передача данных FTP', category: 'file' },
  { port: 21, protocol: 'TCP', service: 'FTP', description: 'Управление FTP', category: 'file' },
  { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell', category: 'remote' },
  { port: 23, protocol: 'TCP', service: 'Telnet', description: 'Telnet (небезопасный)', category: 'remote' },
  { port: 25, protocol: 'TCP', service: 'SMTP', description: 'Отправка почты', category: 'email' },
  { port: 43, protocol: 'TCP', service: 'WHOIS', description: 'Служба WHOIS', category: 'other' },
  { port: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'Система доменных имён', category: 'web' },
  { port: 67, protocol: 'UDP', service: 'DHCP', description: 'DHCP-сервер', category: 'other' },
  { port: 68, protocol: 'UDP', service: 'DHCP', description: 'DHCP-клиент', category: 'other' },
  { port: 69, protocol: 'UDP', service: 'TFTP', description: 'Простой FTP', category: 'file' },
  { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Веб-сервер', category: 'web' },
  { port: 88, protocol: 'TCP/UDP', service: 'Kerberos', description: 'Аутентификация Kerberos', category: 'other' },
  { port: 110, protocol: 'TCP', service: 'POP3', description: 'Получение почты POP3', category: 'email' },
  { port: 119, protocol: 'TCP', service: 'NNTP', description: 'Новостные группы', category: 'messaging' },
  { port: 123, protocol: 'UDP', service: 'NTP', description: 'Синхронизация времени', category: 'other' },
  { port: 135, protocol: 'TCP', service: 'RPC', description: 'Microsoft RPC', category: 'other' },
  { port: 137, protocol: 'UDP', service: 'NetBIOS', description: 'Служба имён NetBIOS', category: 'other' },
  { port: 138, protocol: 'UDP', service: 'NetBIOS', description: 'Датаграмма NetBIOS', category: 'other' },
  { port: 139, protocol: 'TCP', service: 'NetBIOS', description: 'Сеанс NetBIOS', category: 'other' },
  { port: 143, protocol: 'TCP', service: 'IMAP', description: 'Получение почты IMAP', category: 'email' },
  { port: 161, protocol: 'UDP', service: 'SNMP', description: 'Мониторинг сети', category: 'other' },
  { port: 162, protocol: 'UDP', service: 'SNMP Trap', description: 'Уведомления SNMP', category: 'other' },
  { port: 179, protocol: 'TCP', service: 'BGP', description: 'Протокол BGP', category: 'other' },
  { port: 194, protocol: 'TCP', service: 'IRC', description: 'Интернет-чат IRC', category: 'messaging' },
  { port: 389, protocol: 'TCP/UDP', service: 'LDAP', description: 'Каталог LDAP', category: 'other' },
  { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'Веб-сервер (SSL/TLS)', category: 'web' },
  { port: 445, protocol: 'TCP', service: 'SMB', description: 'Файловый обмен Windows', category: 'file' },
  { port: 465, protocol: 'TCP', service: 'SMTPS', description: 'SMTP через SSL', category: 'email' },
  { port: 514, protocol: 'UDP', service: 'Syslog', description: 'Системные логи', category: 'other' },
  { port: 515, protocol: 'TCP', service: 'LPD', description: 'Печать LPD', category: 'other' },
  { port: 587, protocol: 'TCP', service: 'SMTP', description: 'Отправка почты (STARTTLS)', category: 'email' },
  { port: 636, protocol: 'TCP', service: 'LDAPS', description: 'LDAP через SSL', category: 'other' },
  { port: 993, protocol: 'TCP', service: 'IMAPS', description: 'IMAP через SSL', category: 'email' },
  { port: 995, protocol: 'TCP', service: 'POP3S', description: 'POP3 через SSL', category: 'email' },
  { port: 1080, protocol: 'TCP', service: 'SOCKS', description: 'Прокси SOCKS', category: 'web' },
  { port: 1433, protocol: 'TCP', service: 'MSSQL', description: 'Microsoft SQL Server', category: 'database' },
  { port: 1434, protocol: 'UDP', service: 'MSSQL', description: 'MS SQL Browser', category: 'database' },
  { port: 1521, protocol: 'TCP', service: 'Oracle', description: 'Oracle Database', category: 'database' },
  { port: 1723, protocol: 'TCP', service: 'PPTP', description: 'VPN PPTP', category: 'remote' },
  { port: 1883, protocol: 'TCP', service: 'MQTT', description: 'Протокол IoT MQTT', category: 'messaging' },
  { port: 2049, protocol: 'TCP/UDP', service: 'NFS', description: 'Сетевая файловая система', category: 'file' },
  { port: 2082, protocol: 'TCP', service: 'cPanel', description: 'cPanel HTTP', category: 'web' },
  { port: 2083, protocol: 'TCP', service: 'cPanel', description: 'cPanel HTTPS', category: 'web' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL / MariaDB', category: 'database' },
  { port: 3389, protocol: 'TCP', service: 'RDP', description: 'Удалённый рабочий стол', category: 'remote' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL', category: 'database' },
  { port: 5672, protocol: 'TCP', service: 'AMQP', description: 'RabbitMQ / AMQP', category: 'messaging' },
  { port: 5900, protocol: 'TCP', service: 'VNC', description: 'Удалённый экран VNC', category: 'remote' },
  { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redis', category: 'database' },
  { port: 6667, protocol: 'TCP', service: 'IRC', description: 'IRC (альт.)', category: 'messaging' },
  { port: 8080, protocol: 'TCP', service: 'HTTP-Alt', description: 'Альтернативный HTTP', category: 'web' },
  { port: 8443, protocol: 'TCP', service: 'HTTPS-Alt', description: 'Альтернативный HTTPS', category: 'web' },
  { port: 8883, protocol: 'TCP', service: 'MQTTS', description: 'MQTT через SSL', category: 'messaging' },
  { port: 9090, protocol: 'TCP', service: 'Prometheus', description: 'Prometheus', category: 'other' },
  { port: 9200, protocol: 'TCP', service: 'Elasticsearch', description: 'Elasticsearch HTTP', category: 'database' },
  { port: 9300, protocol: 'TCP', service: 'Elasticsearch', description: 'Elasticsearch Transport', category: 'database' },
  { port: 11211, protocol: 'TCP/UDP', service: 'Memcached', description: 'Memcached', category: 'database' },
  { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB', category: 'database' },
  { port: 5601, protocol: 'TCP', service: 'Kibana', description: 'Kibana', category: 'web' },
  { port: 8888, protocol: 'TCP', service: 'HTTP-Alt', description: 'Jupyter Notebook', category: 'web' },
  { port: 3000, protocol: 'TCP', service: 'Dev Server', description: 'Node.js / React Dev', category: 'web' },
  { port: 4200, protocol: 'TCP', service: 'Angular', description: 'Angular Dev Server', category: 'web' },
  { port: 5000, protocol: 'TCP', service: 'Flask', description: 'Flask / ASP.NET', category: 'web' },
  { port: 8000, protocol: 'TCP', service: 'Django', description: 'Django Dev Server', category: 'web' },
  { port: 1194, protocol: 'UDP', service: 'OpenVPN', description: 'VPN OpenVPN', category: 'remote' },
  { port: 51820, protocol: 'UDP', service: 'WireGuard', description: 'VPN WireGuard', category: 'remote' },
  { port: 873, protocol: 'TCP', service: 'rsync', description: 'Синхронизация файлов', category: 'file' },
  { port: 2222, protocol: 'TCP', service: 'SSH-Alt', description: 'Альтернативный SSH', category: 'remote' },
];

type ProtocolFilter = 'all' | 'TCP' | 'UDP';

export default function PortList() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [protocolFilter, setProtocolFilter] = useState<ProtocolFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const filtered = ports.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.port.toString().includes(search) ||
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesProtocol =
      protocolFilter === 'all' || p.protocol === protocolFilter || p.protocol === 'TCP/UDP';

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesProtocol && matchesCategory;
  });

  const sortedFiltered = [...filtered].sort((a, b) => a.port - b.port);

  const protocolColor = (proto: Protocol) => {
    if (proto === 'TCP') return theme.palette.info.main;
    if (proto === 'UDP') return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Поиск */}
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
        <TextField
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по номеру порта или названию сервиса..."
          label="Поиск"
          slotProps={{ htmlInput: { style: { fontSize: '1rem' } } }}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Протокол
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {(['all', 'TCP', 'UDP'] as ProtocolFilter[]).map((pf) => (
            <Chip
              key={pf}
              label={pf === 'all' ? 'Все' : pf}
              size="small"
              variant={protocolFilter === pf ? 'filled' : 'outlined'}
              color={protocolFilter === pf ? 'primary' : 'default'}
              onClick={() => setProtocolFilter(pf)}
              sx={{ borderRadius: 2, cursor: 'pointer' }}
            />
          ))}
        </Box>

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Категория
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Все"
            size="small"
            variant={categoryFilter === 'all' ? 'filled' : 'outlined'}
            color={categoryFilter === 'all' ? 'primary' : 'default'}
            onClick={() => setCategoryFilter('all')}
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <Chip
              key={cat}
              label={categoryLabels[cat]}
              size="small"
              variant={categoryFilter === cat ? 'filled' : 'outlined'}
              color={categoryFilter === cat ? 'primary' : 'default'}
              onClick={() => setCategoryFilter(cat)}
              sx={{ borderRadius: 2, cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Результаты */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Найдено: {sortedFiltered.length} портов
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                p: 1.5,
                textAlign: 'left',
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: '0.875rem',
              },
              '& th': {
                fontWeight: 600,
                color: 'text.secondary',
                background: alpha(theme.palette.primary.main, 0.04),
              },
              '& tr:hover td': {
                background: alpha(theme.palette.primary.main, 0.03),
              },
            }}
          >
            <thead>
              <tr>
                <th>Порт</th>
                <th>Протокол</th>
                <th>Сервис</th>
                <th>Описание</th>
                <th>Категория</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiltered.map((p) => (
                <tr key={`${p.port}-${p.protocol}-${p.description}`}>
                  <td>
                    <Typography
                      component="span"
                      sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}
                    >
                      {p.port}
                    </Typography>
                  </td>
                  <td>
                    <Chip
                      label={p.protocol}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        backgroundColor: alpha(protocolColor(p.protocol), 0.12),
                        color: protocolColor(p.protocol),
                        border: 'none',
                      }}
                    />
                  </td>
                  <td>
                    <Typography component="span" sx={{ fontWeight: 600 }}>
                      {p.service}
                    </Typography>
                  </td>
                  <td>{p.description}</td>
                  <td>
                    <Chip
                      label={categoryLabels[p.category]}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2, fontSize: '0.75rem' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
        {sortedFiltered.length === 0 && (
          <Typography sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
            Ничего не найдено. Попробуйте изменить фильтры.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
