'use client';

import { Container, Typography, Button, Box } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 80, sm: 120 }, fontWeight: 700, color: 'text.disabled', lineHeight: 1 }}>
        500
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
        Что-то пошло не так
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Произошла непредвиденная ошибка. Попробуйте обновить страницу.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button onClick={reset} variant="contained" size="large">
          Попробовать снова
        </Button>
        <Button href="/" variant="outlined" size="large">
          На главную
        </Button>
      </Box>
    </Container>
  );
}
