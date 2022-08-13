import { Contract } from 'ethers';
import { EventFragment, FunctionFragment, ParamType } from 'ethers/lib/utils';
import { Fragment, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useWeb3Context } from 'src/contexts/web3-context';
import useNotifier from 'src/hooks/useNotifier';
import { handleError } from 'src/utils';
import { resolveDAOId } from 'src/utils/resolve';
import InputsForm from './InputsForm';
import OutputsForm from './OutputsForm';

type Props = {
    ct: Contract | null;
    id: string;
    fragment: EventFragment | FunctionFragment;
}

type ParamsUrl = {
    daoId: string;
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

    const { activating, address, chain } = useWeb3Context();
    const params: ParamsUrl = useParams();
    const { chainId } = resolveDAOId(params.daoId);

    const initialInputs: any[] = Array.from(Array(props.fragment.inputs.length).keys()).map(e => '')
    const initialOutputs: any[] = (props.fragment instanceof EventFragment) ? [null] : Array.from(Array(props.fragment.outputs?.length).keys()).map(e => '')

    const [inputs, setInputs] = useState(initialInputs);
    const [formIsValid, setFormIsValid] = useState(false);
    const [outputs, setOutputs] = useState(initialOutputs);

    const { notifyError, notifySuccess } = useNotifier();

    const handleInputsChange = (inputs: any[], isValid: boolean) => {
        setInputs(inputs);
        setFormIsValid(isValid);
    }

    const handleExecute = async (ev: SyntheticEvent) => {
        ev.preventDefault();
        const args = inputs.length > 1 ? inputs : (inputs[0] ?? '')
        console.log(args)
        try {
            if (chainId != chain?.chainId) throw new Error('Wrong network');
            if (!props.ct) throw new Error('Connection error');
            if (!formIsValid) throw new Error('Invalid input');
            if (color == readonlyColor) {
                const results = {}
                if (props.fragment.inputs.length > 0) {
                    Object.assign(results, await props.ct[props.fragment.name](args));
                } else {
                    Object.assign(results, await props.ct[props.fragment.name]());
                }
                console.log(results)
                // !FIXME
                Object.entries(results).map(([key, value]) => Object.assign(results, {[key]: value}))
                console.log(results)
                setOutputs(results as any[]);
                console.log(outputs)
            } else if (color == mutativeColor) {
                const tx = await props.ct[props.fragment.name](inputs);
                await tx.wait();
            }
        } catch(error) {
            handleError(error, notifyError)
        }
    }

    return (
        <Accordion
            disableGutters
            sx={{
                mb:1,
                border: 1,
                borderColor: color
            }}
        >
            {/* <>{console.log(chain)}</> */}
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
                <InputsForm 
                    inputs={props.fragment?.inputs}
                    isEvent={props.fragment instanceof EventFragment}
                    onInputsChange={handleInputsChange}
                    value={inputs}
                />
                <Button 
                    variant='contained'
                    fullWidth={true}
                    onClick={handleExecute}
                    sx={{display: `${props.fragment instanceof FunctionFragment === true ? 'block' : 'none'}`, mb:2}}
                >
                    <Typography variant='body3'>Execute</Typography>
                </Button>

                {props.fragment instanceof FunctionFragment && props.fragment.outputs !== undefined &&
                <OutputsForm 
                    outputs={(color == readonlyColor) ? props.fragment.outputs : []}
                    value={outputs} 
                />}
            </AccordionDetails>
        </Accordion>
    );
}