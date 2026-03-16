'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  MenuItem,
  alpha,
  useTheme
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


export default function OgPreview() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [ogType, setOgType] = useState('website');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');

  const titleWarning = title.length > 60;
  const descWarning = description.length > 155;

  const displayDomain = (() => {
    try {
      return url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'example.com';
    } catch {
      return 'example.com';
    }
  })();

  const metaTags = [
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta name="twitter:card" content="${twitterCard}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
  ].join('\n');

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input fields */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          bgcolor: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="og:title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {titleWarning && <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />}
                  <span style={{ color: titleWarning ? theme.palette.warning.main : undefined }}>
                    {title.length}/60 {isEn ? 'characters' : 'символов'} {titleWarning ? (isEn ? '- recommended max 60' : '- рекомендуется не более 60') : ''}
                  </span>
                </Box>
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="og:description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              helperText={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {descWarning && <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />}
                  <span style={{ color: descWarning ? theme.palette.warning.main : undefined }}>
                    {description.length}/155 {isEn ? 'characters' : 'символов'} {descWarning ? (isEn ? '- recommended max 155' : '- рекомендуется не более 155') : ''}
                  </span>
                </Box>
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="og:image URL (https://example.com/image.jpg)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="og:url (https://example.com)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="og:type"
              value={ogType}
              onChange={(e) => setOgType(e.target.value)}
            >
              <MenuItem value="website">website</MenuItem>
              <MenuItem value="article">article</MenuItem>
              <MenuItem value="profile">profile</MenuItem>
              <MenuItem value="video.other">video</MenuItem>
              <MenuItem value="music.song">music</MenuItem>
              <MenuItem value="book">book</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="twitter:card"
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
            >
              <MenuItem value="summary">summary</MenuItem>
              <MenuItem value="summary_large_image">summary_large_image</MenuItem>
              <MenuItem value="app">app</MenuItem>
              <MenuItem value="player">player</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Preview cards */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        {/* Facebook preview */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Facebook
          </Typography>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="og:image"
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  display: 'block',
                  bgcolor: alpha(theme.palette.text.primary, 0.05)
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            {!imageUrl && (
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {isEn ? 'No image' : 'Нет изображения'}
                </Typography>
              </Box>
            )}
            <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}
              >
                {displayDomain}
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {title || (isEn ? 'Page title' : 'Заголовок страницы')}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {description || (isEn ? 'Page description' : 'Описание страницы')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Twitter preview */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Twitter / X
          </Typography>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            {twitterCard === 'summary_large_image' ? (
              <>
                {imageUrl ? (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="twitter:image"
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      display: 'block',
                      bgcolor: alpha(theme.palette.text.primary, 0.05)
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      bgcolor: alpha(theme.palette.text.primary, 0.05),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'No image' : 'Нет изображения'}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {title || (isEn ? 'Title' : 'Заголовок')}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {description || (isEn ? 'Description' : 'Описание')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {displayDomain}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', p: 0 }}>
                {imageUrl ? (
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="twitter:image"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      flexShrink: 0,
                      bgcolor: alpha(theme.palette.text.primary, 0.05)
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: alpha(theme.palette.text.primary, 0.05),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {isEn ? 'None' : 'Нет'}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ p: 1.5, overflow: 'hidden' }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {title || (isEn ? 'Title' : 'Заголовок')}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {description || (isEn ? 'Description' : 'Описание')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {displayDomain}
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* LinkedIn preview */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            LinkedIn
          </Typography>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              maxWidth: 550
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt="og:image"
                sx={{
                  width: '100%',
                  height: 280,
                  objectFit: 'cover',
                  display: 'block',
                  bgcolor: alpha(theme.palette.text.primary, 0.05)
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 280,
                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {isEn ? 'No image' : 'Нет изображения'}
                </Typography>
              </Box>
            )}
            <Box sx={{ p: 1.5, bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
              <Typography variant="body2" fontWeight={600}>
                {title || (isEn ? 'Page title' : 'Заголовок страницы')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {displayDomain}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Generated meta tags */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {isEn ? 'HTML Meta Tags' : 'Мета-теги HTML'}
          </Typography>
          <CopyButton text={metaTags} />
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.surfaceContainerLow
          }}
        >
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              m: 0
            }}
          >
            {metaTags}
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
}
