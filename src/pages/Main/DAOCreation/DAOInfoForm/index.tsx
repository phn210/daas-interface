import { Box, Button, Grid, TextField, Typography } from '@mui/material';

export default function DAOInfoForm() {
    return (
        <>
            <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={4} mt={1}>
                    <Typography>Name</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='name'
                        name='name'
                        fullWidth
                        size='small'
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent='center' mt={1}>
                <Grid item xs={4} mt={1}>
                    <Typography>Logo URL</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='logoUrl'
                        name='logoUrl'
                        fullWidth
                        size='small'
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent='center' mt={1}>
                <Grid item xs={4} mt={1}>
                    <Typography>Website URL</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='websiteUrl'
                        name='websiteUrl'
                        fullWidth
                        size='small'
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent='center' mt={1}>
                <Grid item xs={4} mt={1}>
                    <Typography>Short Description</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='shortDescription'
                        name='shortDescription'
                        fullWidth
                        size='small'
                        multiline
                        rows={3}
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent='center' mt={1}>
                <Grid item xs={4} mt={1}>
                    <Typography>Description</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='description'
                        name='description'
                        fullWidth
                        size='small'
                        multiline
                        rows={6}
                        InputProps={{
                            sx: {
                                bgcolor: 'background.default',
                            }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container justifyContent='flex-end' mt={2}>
                <Button variant='contained' size='large' sx={{ bgcolor: 'secodary.main' }}>Upload</Button>
            </Grid>
        </>
    );
}