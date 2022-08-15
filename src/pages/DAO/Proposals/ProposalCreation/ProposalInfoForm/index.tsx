import { Box, Button, Grid, TextField, Typography } from '@mui/material';

export default function ProposalInfoForm() {
    return(
        <>
            <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={4} mt={1}>
                    <Typography>Title</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='title'
                        name='title'
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
                    <Typography>Organization</Typography>
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
                    <Typography>Authors</Typography>
                </Grid>
                <Grid
                    item xs={8}
                    container
                    justifyContent='space-between'
                    spacing = {1}
                    alignItems='center'
                >
                    <Grid item xs={6}>
                        <TextField
                            id='authorName'
                            name='authorName'
                            label='Name'
                            fullWidth
                            size='small'
                            InputProps={{
                                sx: {
                                    bgcolor: 'background.default',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id='authorHandle'
                            name='authorHandle'
                            label='Handle'
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
            </Grid>
            <Grid container spacing={2} justifyContent='center' mt={1}>
                <Grid item xs={4} mt={1}>
                    <Typography>Discussion URL</Typography>
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