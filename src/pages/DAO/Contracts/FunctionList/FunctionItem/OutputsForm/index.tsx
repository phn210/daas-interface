import { ParamType } from 'ethers/lib/utils';
import {  Grid, TextField, Typography } from '@mui/material';

type Props = {
    outputs: ParamType[];
}

export default function OutputsForm(props: Props) {
    return (
        <Grid
            container spacing={0} alignItems='center'
        >   
            {props.outputs.length > 0 && (
                <Grid container spacing={1} mx={0.5} mb={2}>
                {props.outputs.map((e: ParamType, i: number) => {
                    return (
                        <Grid
                            key={`${e.name}-outputs`}
                            item xs={12}
                            container spacing={1} alignItems='center'
                        >
                            <Grid item xs={5}>
                                <Typography>{e.name?.replace('_', '')}</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    id={`${e.name}-outputs-${i}`}
                                    name={`${e.name}-outputs-${i}`}
                                    label={e.type}
                                    required
                                    fullWidth
                                    size='small'
                                    disabled
                                    InputProps={{
                                        sx: {
                                            bgcolor: 'background.default',
                                        }
                                    }}
                                />    
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>    
            )}
        </Grid>
    );
}