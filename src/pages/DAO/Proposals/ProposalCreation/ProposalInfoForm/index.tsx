import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { IPFS } from 'src/contexts/proposals-context/types';

type Props = {
    value: IPFS;
    onChange: (_form: IPFS, _isValid: boolean) => void;
}

export default function ProposalInfoForm(props: Props) {
    const handleInputsChange = (key: string, value: any) => {
        const currentValue = props.value;
        switch (key) {
            case 'title':
                currentValue.title = value;
                break;
            case 'authorName':
                currentValue.authors[0].name = value;
                break;
            case 'authorHandle':
                currentValue.authors[0].handle = value;
                break;
            case 'organization':
                currentValue.organization = value;
                break;
            case 'discussions':
                currentValue.discussions = value;
                break;
            case 'shortDescription':
                currentValue.shortDescription = value;
                break;
            case 'description':
                currentValue.description = value;
                break;
            default: break;
        }
        props.onChange(currentValue, true);
    }

    const onInputsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        handleInputsChange(ev.target.name, ev.target.value)
    }

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
                        onChange={onInputsChange}
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
                        id='organization'
                        name='organization'
                        fullWidth
                        size='small'
                        onChange={onInputsChange}
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
                            onChange={onInputsChange}
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
                            onChange={onInputsChange}
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
                        id='discussions'
                        name='discussions'
                        fullWidth
                        size='small'
                        onChange={onInputsChange}
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
                        onChange={onInputsChange}
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
                        onChange={onInputsChange}
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
        </>
    );
}