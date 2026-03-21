'use client';

import React, { ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the entire app
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to external error reporting service (Sentry, etc.)
    console.error('Error caught by Error Boundary:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />
            </Box>
            <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid error.main',
                  borderRadius: 1,
                  textAlign: 'left',
                }}
              >
                <Typography variant="caption" component="code" sx={{ wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </Box>
          </Container>
        )
      );
    }

    return this.props.children;
  }
}
