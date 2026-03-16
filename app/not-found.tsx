import { Container, Typography, Button, Box } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Ultimate Tools',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 80, sm: 120 }, fontWeight: 700, color: 'text.disabled', lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        Страница не найдена
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Такой страницы не существует или она была перемещена.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button href="/" variant="contained" size="large">
          На главную
        </Button>
        <Button href="/ru/blog" variant="outlined" size="large">
          Блог
        </Button>
      </Box>
    </Container>
  );
}
