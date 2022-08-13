import { Contract } from 'ethers';
import { Box, Grid, Typography } from '@mui/material';
import { useContract, useDAOFactoryContract, useGovernorContract, useTimelockContract, useERC20VotesContract, useERC721VotesContract } from 'src/hooks/useContract';
import FunctionItem from './FunctionItem';

interface ContractProps {
    name: string;
    address: string;
}

export default function FunctionList(props: ContractProps) {
    const zeroAddress = '0x'+'0'.repeat(40);
    let ct: Contract | null;
    // let ct;
    switch (props.name) {
        case 'daoFactory':
            ct = useDAOFactoryContract(props.address);
            break;
        case 'governor':
            ct = useGovernorContract(props.address);
            break;
        case 'timelocks':
            ct = useTimelockContract(props.address);
            break;
        case 'ERC20Votes':
            ct = useERC20VotesContract(props.address);
            break;
        case 'ERC721votes':
            ct = useERC721VotesContract(props.address);
            break;
        default:
            ct = null;
            break;
    }

    const daoFactoryFilter = [
        'initialize'
    ];

    const governorFilter = [
        'initialize',
        'name',
        'version'
    ]

    const votesFilter = [
        'DELEGATION_TYPEHASH',
        'delegates',
        'delegate',
        'increaseAllowance',
        'decreaseAllowance'
    ]

    return (
        <>
            <Grid
                container spacing={2} justifyContent='center'
            >
                <Grid item xs={12} md={6} xl={4}>
                    <Typography variant='h4' sx={{mb:2}}>Readonly Functions</Typography>
                    {ct !== null && ct!== undefined && Object.entries(ct.interface.functions).filter(([k,v]) => ['pure', 'view'].includes(v.stateMutability)).map((e, i: number) => {
                        return (
                            <FunctionItem 
                                key={`readonly-${i}`}
                                id={`readonly-${i}`}
                                ct={ct}
                                fragment={e[1]}
                            />
                        )
                    })}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <Typography variant='h4' sx={{mb:2}}>Mutative Functions</Typography>
                    {ct !== null && ct!== undefined && Object.entries(ct.interface.functions).filter(([k,v]) => ['nonpayable', 'payable'].includes(v.stateMutability)).map((e, i: number) => {
                        return (
                            <FunctionItem
                                key={`mutative-${i}`}
                                id={`mutative-${i}`}
                                ct={ct}
                                fragment={e[1]}
                            />)
                    })}
                </Grid>
                <Grid item xs={12} md={6} xl={4}>
                    <Typography variant='h4' sx={{mb:2}}>Events</Typography>
                    {ct !== null && ct!== undefined && Object.entries(ct.interface.events).map((e, i: number) => {
                        return (
                            <FunctionItem
                                key={`event-${i}`}
                                id={`event-${i}`}
                                ct={ct}
                                fragment={e[1]}
                            />)
                    })}
                </Grid>
            </Grid>
        </>
    );
}