'use client';

import { Box, useTheme } from '@mui/material';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const minHeight = `calc(100vh - ${theme.spacing(25)})`;
  return (
    <Box id="main-content" component="main" sx={{ minHeight }}>
      {children}
    </Box>
  );
}
