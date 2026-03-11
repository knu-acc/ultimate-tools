'use client';

import { Box, useTheme } from '@mui/material';

interface ToolShellProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export default function ToolShell({ children, maxWidth = 900 }: ToolShellProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      maxWidth,
      mx: 'auto',
      // No extra Paper/border wrapper - the tool content renders directly
      // Tools use theme elevation and surfaces internally
    }}>
      {children}
    </Box>
  );
}
