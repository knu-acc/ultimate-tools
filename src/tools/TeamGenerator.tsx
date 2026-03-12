'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme, Slider,
  IconButton, Tooltip
} from '@mui/material';
import { Shuffle, Groups, Replay, Delete } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';

const TEAM_COLORS = [
  'primary', 'secondary', 'success', 'warning', 'error', 'info',
] as const;

interface Team {
  name: string;
  members: string[];
}

interface HistoryEntry {
  teams: Team[];
  time: string;
  participantCount: number;
}

export default function TeamGenerator() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [teamCount, setTeamCount] = useState(2);
  const [mode, setMode] = useState<'count' | 'size'>('count');
  const [teamSize, setTeamSize] = useState(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [animating, setAnimating] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getParticipants = useCallback(() => {
    return text.split('\n').map(s => s.trim()).filter(Boolean);
  }, [text]);

  const shuffle = (arr: string[]): string[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const splitIntoTeams = useCallback((participants: string[]): Team[] => {
    const shuffled = shuffle(participants);
    const result: Team[] = [];

    if (mode === 'count') {
      const count = Math.min(teamCount, shuffled.length);
      for (let i = 0; i < count; i++) {
        result.push({ name: `Команда ${i + 1}`, members: [] });
      }
      shuffled.forEach((p, i) => {
        result[i % count].members.push(p);
      });
    } else {
      const size = Math.max(1, teamSize);
      let teamIdx = 0;
      for (let i = 0; i < shuffled.length; i += size) {
        teamIdx++;
        result.push({
          name: `Команда ${teamIdx}`,
          members: shuffled.slice(i, i + size)
        });
      }
    }

    return result;
  }, [mode, teamCount, teamSize]);

  const handleSplit = useCallback(() => {
    const participants = getParticipants();
    if (participants.length < 2 || animating) return;

    setAnimating(true);
    setTeams([]);

    let tick = 0;
    const totalTicks = 15;
    animRef.current = setInterval(() => {
      tick++;
      const tempTeams = splitIntoTeams(participants);
      setTeams(tempTeams);

      if (tick >= totalTicks) {
        if (animRef.current) clearInterval(animRef.current);
        const finalTeams = splitIntoTeams(participants);
        setTeams(finalTeams);
        setAnimating(false);

        const now = new Date();
        const timeStr = now.toLocaleTimeString('ru-RU', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        setHistory(prev => [{
          teams: finalTeams,
          time: timeStr,
          participantCount: participants.length
        }, ...prev].slice(0, 10));
      }
    }, 80);
  }, [getParticipants, animating, splitIntoTeams]);

  const getTeamsText = (teamsData: Team[]) => {
    return teamsData.map(t =>
      `${t.name}:\n${t.members.map(m => `  - ${m}`).join('\n')}`
    ).join('\n\n');
  };

  const participants = getParticipants();

  const getTeamColor = (index: number) => {
    const colorKey = TEAM_COLORS[index % TEAM_COLORS.length];
    return theme.palette[colorKey];
  };

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mb: 2,
      borderRadius: 3,
      bgcolor: theme.palette.surfaceContainerLow,
      p: { xs: 2, sm: 3 },
      transition: 'background 0.2s ease',
      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
    }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Участники (по одному на строку)
          </Typography>
          <TextField
            multiline
            minRows={6}
            maxRows={12}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'Иван\nМария\nАлексей\nОльга'}
            disabled={animating}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Участников: {participants.length}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label="По количеству команд"
              onClick={() => setMode('count')}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                bgcolor: mode === 'count'
                  ? alpha(theme.palette.primary.main, 0.15)
                  : theme.palette.surfaceContainerLow,
                color: mode === 'count' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
            <Chip
              label="По размеру команды"
              onClick={() => setMode('size')}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                bgcolor: mode === 'size'
                  ? alpha(theme.palette.primary.main, 0.15)
                  : theme.palette.surfaceContainerLow,
                color: mode === 'size' ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
          </Box>

          {mode === 'count' ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Команд: {teamCount}
              </Typography>
              <Slider
                value={teamCount}
                onChange={(_, val) => setTeamCount(val as number)}
                min={2}
                max={Math.max(2, Math.min(10, participants.length))}
                step={1}
                disabled={animating || participants.length < 2}
                sx={{ mx: 1 }}
              />
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Размер: {teamSize}
              </Typography>
              <Slider
                value={teamSize}
                onChange={(_, val) => setTeamSize(val as number)}
                min={1}
                max={Math.max(1, Math.ceil(participants.length / 2))}
                step={1}
                disabled={animating || participants.length < 2}
                sx={{ mx: 1 }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Shuffle />}
            onClick={handleSplit}
            disabled={animating || participants.length < 2}
            sx={{ borderRadius: 6, py: 1.2, mb: 1 }}
          >
            {animating ? 'Перемешиваю...' : 'Разделить'}
          </Button>

          {participants.length < 2 && participants.length > 0 && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
              Нужно минимум 2 участника
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {teams.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Результат: {teams.length} {teams.length === 1 ? 'команда' : teams.length < 5 ? 'команды' : 'команд'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CopyButton text={getTeamsText(teams)} />
                  <Tooltip title="Перемешать заново">
                    <IconButton size="small" onClick={handleSplit} disabled={animating}>
                      <Replay fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {teams.map((team, idx) => {
                  const color = getTeamColor(idx);
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: alpha(color.main, 0.05),
                          transition: animating ? 'none' : 'all 0.3s ease'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Groups sx={{ color: color.main, fontSize: 20 }} />
                          <Typography variant="subtitle2" fontWeight={700} sx={{ color: color.main }}>
                            {team.name}
                          </Typography>
                          <Chip
                            label={team.members.length}
                            size="small"
                            sx={{
                              ml: 'auto',
                              fontWeight: 700,
                              bgcolor: alpha(color.main, 0.12),
                              color: color.dark,
                              height: 22,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                        {team.members.map((member, mIdx) => (
                          <Box
                            key={mIdx}
                            sx={{
                              py: 0.5,
                              px: 1,
                              mb: 0.5,
                              borderRadius: 1.5,
                              bgcolor: alpha(color.main, 0.06),
                              fontSize: '0.875rem'
                            }}
                          >
                            {member}
                          </Box>
                        ))}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}

          {teams.length === 0 && !animating && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow,
                textAlign: 'center'
              }}
            >
              <Groups sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Введите имена участников и нажмите «Разделить»
              </Typography>
            </Paper>
          )}

          {history.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  История ({history.length})
                </Typography>
                <Tooltip title="Очистить историю">
                  <IconButton size="small" onClick={() => setHistory([])}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {history.map((h, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: i === 0 ? alpha(theme.palette.success.main, 0.03) : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: theme.palette.surfaceContainerLow }
                  }}
                  onClick={() => { setTeams(h.teams); }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 55 }}>
                      {h.time}
                    </Typography>
                    <Typography variant="body2">
                      {h.participantCount} уч. → {h.teams.length} команд
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                      {h.teams.map((t, ti) => (
                        <Chip
                          key={ti}
                          label={t.members.length}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: alpha(getTeamColor(ti).main, 0.12),
                            color: getTeamColor(ti).dark
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
