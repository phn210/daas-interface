import { SyntheticEvent, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAppContext } from 'src/contexts/app-context';
import { useDAOContext } from 'src/contexts/dao-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { FetchingStatus } from 'src/constants';
import { formatAddress } from 'src/utils/format';
import { resolveDAOId } from 'src/utils/resolve';
import Empty from 'src/components/Empty';
import FunctionList from './FunctionList';

type ParamsUrl = {
    daoId: string;
}

type ContractAddress = {[name: string]: string[] | string};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    name: string;
}
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, name, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`contract-${name}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box px={1} py={3}>{children}</Box>
            )}
        </div>
    );
}

export default function Contracts() {
    const { activating, address, chain } = useWeb3Context();
    const params: ParamsUrl = useParams();
    const { status, data, error, fetch } = useDAOContext();
    const [value, setValue] = useState(0);
    const { daoFactoryAddresses } = useAppContext();

    useEffect(() => {
        fetch(params.daoId);
    }, [address, chain])
    

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const resolvedId = resolveDAOId(params.daoId);

    const daoContractsAddresses: ContractAddress = {};

    Object.assign(daoContractsAddresses, {['daoFactory']: daoFactoryAddresses[Number(resolvedId.chainId)]})
    Object.assign(daoContractsAddresses, data.contracts)

    return (
        <>
        <Box p={3}>
            <Box mb={3}>
                <Typography component='span' variant='h3' >Contracts</Typography>
            </Box>
            {('daoFactory' in daoContractsAddresses 
            && address !== undefined
            && [
                '0x1ad841ea7a95c2fd3bba0812e538e9061a9f743b'.toLowerCase(),
            ].includes(address.toLowerCase())) ? 
            (<Box 
                mb={3}
                px={2}
                py={1}
                sx={{
                    bgcolor:'background.paper',
                    borderRadius: '12px'
                }}
            >
                <Tabs
                    // orientation='vertical'
                    value={value}
                    onChange={handleChange}
                    variant='scrollable'
                    // scrollButtons={true}
                    allowScrollButtonsMobile
                    sx={{
                        // maxWidth: '600px',
                        display: 'flex',
                        flexDirection: {
                            xs: 'row',
                            md: 'column'
                        }
                    }}
                >
                    
                    {Object.keys(daoContractsAddresses).map((name: string, index: number) => {
                        switch(name) {
                            case 'daoFactory':
                                return <Tab label='DAO Factory' key={`contract-${name}`} />
                            case 'governor':
                                return <Tab label='Governor' key={`contract-${name}`} />
                            case 'timelocks':
                                return Array(daoContractsAddresses['timelocks']).map((e, i) => {
                                    return <Tab label={`Timelock ${i}`} key={`contract-${name+i}`} />
                                })
                            case 'votes':
                                return <Tab label={String(daoContractsAddresses.standard).replace('erc', 'ERC').replace('v', 'V')} key={`contract-${String(daoContractsAddresses.standard)}`} />
                        }    
                    })}
                </Tabs>
                <Box px={1} mt={2}>
                    <Typography component='span' variant='h5' >Address: {formatAddress(Object.values(daoContractsAddresses).flat()[value])}</Typography> <LaunchIcon/>
                </Box>
                {Object.keys(daoContractsAddresses).map((name: string, index: number) => {
                    switch(name) {
                        case 'daoFactory':
                            return (
                                <TabPanel value={value} index={index} name={name} key={`panel-${name}`}>
                                    <FunctionList name={name} address={String(daoContractsAddresses[name])} />
                                </TabPanel>
                            )
                        case 'governor':
                            return (
                                <TabPanel value={value} index={index} name={name} key={`panel-${name}`}>
                                    <FunctionList name={name} address={String(daoContractsAddresses[name])} />
                                </TabPanel>
                            )
                        case 'timelocks':
                            return Array(daoContractsAddresses.timelocks).map((e, i) => {
                                return (
                                    <TabPanel value={value} index={index+i} name={name+i} key={`panel-${name+i}`}>
                                        <FunctionList name={name} address={String(daoContractsAddresses[name][i])} />
                                    </TabPanel>
                                )
                            })
                        case 'votes':
                            return (
                                <TabPanel value={value} index={index + daoContractsAddresses.timelocks.length - 1} name={name} key={`panel-${daoContractsAddresses.standard}`}>
                                    <FunctionList name={String(daoContractsAddresses.standard)} address={String(daoContractsAddresses[name])} />
                                </TabPanel>
                            )
                    }
                })}
            </Box>) : <Empty py={4} />}
        </Box>
        </>
        
    );
}