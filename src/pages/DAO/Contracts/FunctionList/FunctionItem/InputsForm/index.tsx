import { ParamType } from 'ethers/lib/utils';
import {  Grid, TextField, Typography } from '@mui/material';

type Props = {
    inputs: ParamType[];
    isEvent?: boolean;
    value: any[number];
    onInputsChange: (_inputs: any[], _isValid: boolean) => void;
}

export default function InputsForm(props: Props) {
    const disabled = (() => {
        return props.isEvent ?? false;
    })();

    // const inputType = ((type: string) => {

    // })

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        const index = ev.target.id.slice(-1)
        const newInputs = props.value;
        newInputs[index] = val;
        props.onInputsChange(newInputs as any[], true);
    }

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
                                <Grid item xs={4}>
                                    <Typography>{e.name?.replace('_', '')}</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        id={`${e.name}-inputs-${i}`}
                                        name={`${e.name}-inputs-${i}`}
                                        label={e.type}
                                        required
                                        fullWidth
                                        size='small'
                                        disabled={disabled}
                                        onChange={handleInputChange}
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