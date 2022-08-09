import { EventFragment, FunctionFragment, ParamType } from 'ethers/lib/utils';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputsForm from './InputsForm';
import OutputsForm from './OutputsForm';

type Props = {
    id: string;
    fragment: EventFragment | FunctionFragment;
}

export default function FunctionItem(props: Props) {
    const readonlyColor = '#9ccc65';
    const mutativeColor = '#ef5350';
    const eventColor = '#42a5f5';
    const color: string = (() => {
        if (props.fragment instanceof FunctionFragment) {
            switch (props.fragment.stateMutability) {
                case 'pure':
                    return readonlyColor;
                case 'view':
                    return readonlyColor;
                case 'nonpayable':
                    return mutativeColor;
                case 'payable':
                    return mutativeColor;
                default:
                    return eventColor;
            }
        } else if (props.fragment instanceof EventFragment) {
            return eventColor;
        } else return 'transparent';
    })();

    return (
        <Accordion
            disableGutters
            sx={{
                mb:1,
                border: 1,
                borderColor: color
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={props.id+'-content'}
                id={props.id+'-header'}
                sx={{backgroundColor: 'background.paper'}}
            >
                <Typography variant='body1'>{props.fragment?.name}</Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{bgcolor: 'background.paper'}}
            >
                <InputsForm inputs={props.fragment?.inputs} isEvent={props.fragment instanceof EventFragment}/>
                <Button variant='contained' fullWidth={true} sx={{display: `${props.fragment instanceof FunctionFragment === true ? 'block' : 'none'}`, mb:2}}>
                    <Typography variant='body3'>Execute</Typography>
                </Button>

                {props.fragment instanceof FunctionFragment && props.fragment.outputs !== undefined &&
                <OutputsForm outputs={(color == readonlyColor) ? props.fragment.outputs : []} />}
            </AccordionDetails>
        </Accordion>
    );
}