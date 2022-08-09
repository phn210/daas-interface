/* eslint-disable quotes */
import { Box, Button, Typography } from '@mui/material';
import ToggleThemeButton from 'src/components/ToggleThemeButton';

export default function Document() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 2 }}>
      <Box py={1}>
        Theme <ToggleThemeButton />
      </Box>
      <Box mb={3}>
        <Typography gutterBottom variant="h3">
          Breakpoints
        </Typography>
        <Typography>
          xs: <b>0</b>
        </Typography>
        <Typography>
          xsm: <b>600</b>
        </Typography>
        <Typography>
          sm: <b>760</b>
        </Typography>
        <Typography>
          md: <b>960</b>
        </Typography>
        <Typography>
          lg: <b>1280</b>
        </Typography>
        <Typography>
          xl: <b>1440</b>
        </Typography>
        <Typography>
          xxl: <b>1800</b>
        </Typography>
      </Box>
      <Box mb={3}>
        <Typography gutterBottom variant="h3">
          Colors
        </Typography>
        <Box display={'flex'} mb={2} sx={{ bgcolor: 'text.primary', color: 'primary.main' }}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'background.default' }} />
            &nbsp;
            {"'background.default'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'background.paper' }} />
            &nbsp;
            {"'background.paper'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'background.primary' }} />
            &nbsp;
            {"'background.primary'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'background.secondary' }} />
            &nbsp;
            {"'background.secondary'"}
          </Box>
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 30, height: 15, background: (theme) => theme.palette.gradient.main }} />
            &nbsp;
            {"'gradient.main'"}
          </Box>
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'primary.main' }} />
            &nbsp;
            {"'primary.main'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'primary.light' }} />
            &nbsp;
            {"'primary.light'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'primary.dark' }} />
            &nbsp;
            {"'primary.dark'"}
          </Box>
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'secondary.main' }} />
            &nbsp;
            {"'secondary.main'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'secondary.light' }} />
            &nbsp;
            {"'secondary.light'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'secondary.dark' }} />
            &nbsp;
            {"'secondary.dark'"}
          </Box>
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'success.main' }} />
            &nbsp;
            {"'success.main'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'success.light' }} />
            &nbsp;
            {"'success.light'"}
          </Box>
          {/* <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'success.dark' }} />
            &nbsp;
            {"'success.dark'"}
          </Box> */}
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'warning.main' }} />
            &nbsp;
            {"'warning.main'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'warning.light' }} />
            &nbsp;
            {"'warning.light'"}
          </Box>
          {/* <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'warning.dark' }} />
            &nbsp;
            {"'success.dark'"}
          </Box> */}
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'error.main' }} />
            &nbsp;
            {"'error.main'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'error.light' }} />
            &nbsp;
            {"'error.light'"}
          </Box>
          {/* <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'error.dark' }} />
            &nbsp;
            {"'error.dark'"}
          </Box> */}
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'info.main' }} />
            &nbsp;
            {"'info.main'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'info.light' }} />
            &nbsp;
            {"'info.light'"}
          </Box>
        </Box>

        <Box display={'flex'} mb={2}>
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'text.primary' }} />
            &nbsp;
            {"'text.primary'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'text.secondary' }} />
            &nbsp;
            {"'text.secondary'"}
          </Box>
          <Box px={2} />
          <Box display={'flex'} alignItems={'center'} minWidth={150}>
            <Box sx={{ width: 15, height: 15, bgcolor: 'text.disabled' }} />
            &nbsp;
            {"'text.disabled'"}
          </Box>
        </Box>
      </Box>

      <Box mb={3}>
        <Typography variant="h3" gutterBottom>
          Typography variants
        </Typography>
        <Typography gutterBottom variant="h1">
          {"<Typography variant='h1'>h1</Typography>"}
        </Typography>
        <Typography gutterBottom variant="h2">
          {"<Typography variant='h2'>h2</Typography>"}
        </Typography>
        <Typography gutterBottom variant="h3">
          {"<Typography variant='h3'>h3</Typography>"}
        </Typography>
        <Typography gutterBottom variant="h4">
          {"<Typography variant='h4'>h4</Typography>"}
        </Typography>
        <Typography gutterBottom variant="h5">
          {"<Typography variant='h5'>h5</Typography>"}
        </Typography>
        <Typography gutterBottom variant="h6">
          {"<Typography variant='h6'>h6</Typography>"}
        </Typography>
        <Typography gutterBottom variant="body1">
          {"<Typography variant='body1'>body1</Typography>"}
        </Typography>
        <Typography gutterBottom variant="body2">
          {"<Typography variant='body2'>body2</Typography>"}
        </Typography>
        <Typography gutterBottom variant="body3">
          {"<Typography variant='body3'>body3</Typography>"}
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          {"<Typography variant='subtitle1'>subtitle1</Typography>"}
        </Typography>
        <Typography gutterBottom variant="subtitle2">
          {"<Typography variant='subtitle2'>subtitle2</Typography>"}
        </Typography>
        <Typography gutterBottom variant="button">
          {"<Typography variant='button'>button</Typography>"}
        </Typography>
        <Typography gutterBottom>{'<Typography>default</Typography>'}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="h3" gutterBottom>
          Typography colors
        </Typography>
        <Typography color="primary" gutterBottom>
          {"<Typography color='primary'>color primary (primary.main)</Typography>"}
        </Typography>

        <Typography color="secondary" gutterBottom>
          {"<Typography color='secondary'>color secondary</Typography>"}
        </Typography>
        <Typography color="secondary.dark" gutterBottom>
          {"<Typography color='secondary.dark'>color secondary.dark</Typography>"}
        </Typography>
        <Typography color="secondary.light" gutterBottom>
          {"<Typography color='secondary.light'>color secondary.light</Typography>"}
        </Typography>

        <Typography color="text.primary" gutterBottom>
          {"<Typography color='text.primary'>color text.primary (default)</Typography>"}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {"<Typography color='text.secondary'>color text.secondary</Typography>"}
        </Typography>
        <Typography color="text.disabled" gutterBottom>
          {"<Typography color='text.disabled'>color text.disabled</Typography>"}
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography gutterBottom variant="h3">
          Button
        </Typography>
        <Button>default</Button>
        &nbsp;
        <Button variant="contained">variant contained</Button>
        &nbsp;
        <Button variant="outlined">variant outlined</Button>
        &nbsp;
        <Button variant="gradient">variant gradient</Button>
        &nbsp;
        <Button variant="text">variant text</Button>
        &nbsp;
        <Button color="secondary" variant="outlined">
          color secondary
        </Button>
        &nbsp;
        <Button variant="contained" color="secondary">
          color secondary, variant contained
        </Button>
      </Box>
    </Box>
  );
}
