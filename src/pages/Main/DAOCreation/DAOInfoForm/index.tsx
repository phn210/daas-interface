import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { IPFS } from 'src/contexts/daos-context/types';

type Props = {
    value: IPFS;
    onChange: (_form: IPFS, _isValid: boolean) => void;
}

export default function DAOInfoForm(props: Props) {
    const handleInputsChange = (key: string, value: any) => {
        const currentValue = props.value;
        switch (key) {
            case 'name':
                currentValue.name = value;
                break;
            case 'logoUrl':
                currentValue.logoUrl = value;
                break;
            case 'websiteUrl':
                currentValue.websiteUrl = value;
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
                    <Typography>Logo URL</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='logoUrl'
                        name='logoUrl'
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
                    <Typography>Website URL</Typography>
                </Grid>
                <Grid item xs={8}>
                    <TextField
                        required
                        id='websiteUrl'
                        name='websiteUrl'
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