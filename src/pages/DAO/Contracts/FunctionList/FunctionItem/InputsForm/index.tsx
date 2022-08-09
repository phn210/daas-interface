import { ParamType } from 'ethers/lib/utils';
import {  Grid, TextField, Typography } from '@mui/material';

type Props = {
    inputs: ParamType[];
    isEvent?: boolean;
}

export default function InputsForm(props: Props) {
    const disabled = (() => {
        return props.isEvent ?? false;
    })()
    return (
        <Grid
            container spacing={0} alignItems='center'
        >   
            {props.inputs?.length > 0 && (
                <Grid container spacing={1} mx={0.5} mb={2}>
                    {props.inputs.map((e: ParamType, i: number) => {
                        return (
                            <Grid
                                key={`${e.name}-inputs`}
                                item xs={12}
                                container spacing={1} alignItems='center'
                            >
                                <Grid item xs={5}>
                                    <Typography>{e.name?.replace('_', '')}</Typography>
                                </Grid>
                                <Grid item xs={7}>
                                    <TextField
                                        id={`${e.name}-inputs-${i}`}
                                        name={`${e.name}-inputs-${i}`}
                                        label={e.type}
                                        required
                                        fullWidth
                                        size='small'
                                        disabled={disabled}
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