import { SyntheticEvent, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import Empty from 'src/components/Empty';
import FunctionList from './FunctionList';
import { borderRadius } from '@mui/system';

type ParamsUrl = {
    daoId: string;
}

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
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const params: ParamsUrl = useParams();
    const daoContractsAddresses = {
        daofactory: '0x0000000000000000000000000000000000000000',
        governor: '0x0000000000000000000000000000000000000000',
        timelocks: [
            '0x0000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000'
        ],
        votes: '0x0000000000000000000000000000000000000000',
        standard: 'erc20votes'
    };

    return (
        <Box p={3}>
            <Box mb={3}>
                <RouterLink
                    to={`/${params.daoId}`}
                    style={{
                        textDecoration: 'none'
                    }}
                >
                    <Button variant='contained'>Back</Button>
                </RouterLink>
            </Box>
            <Box mb={3}>
                <Typography component='span' variant='h3' >Contracts</Typography>
            </Box>
            {('daofactory' in daoContractsAddresses) ? 
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
                            case 'daofactory':
                                return <Tab label='DAO Factory' key={`contract-${name}`} />
                            case 'governor':
                                return <Tab label='Governor' key={`contract-${name}`} />
                            case 'timelocks':
                                return daoContractsAddresses.timelocks.map((e, i) => {
                                    return <Tab label={`Timelock ${i}`} key={`contract-${name+i}`} />
                                })
                            case 'votes':
                                return <Tab label={daoContractsAddresses.standard.replace('erc', 'ERC').replace('v', 'V')} key={`contract-${daoContractsAddresses.standard}`} />
                        }    
                    })}
                </Tabs>
                {Object.keys(daoContractsAddresses).map((name: string, index: number) => {
                    switch(name) {
                        case 'daofactory':
                            return (
                                <TabPanel value={value} index={index} name={name} key={`panel-${name}`}>
                                    <FunctionList name={name} address={daoContractsAddresses[name]} />
                                </TabPanel>
                            )
                        case 'governor':
                            return (
                                <TabPanel value={value} index={index} name={name} key={`panel-${name}`}>
                                    <FunctionList name={name} address={daoContractsAddresses[name]} />
                                </TabPanel>
                            )
                        case 'timelocks':
                            return daoContractsAddresses.timelocks.map((e, i) => {
                                return (
                                    <TabPanel value={value} index={index+i} name={name+i} key={`panel-${name+i}`}>
                                        <FunctionList name={name} address={daoContractsAddresses[name][i]} />
                                    </TabPanel>
                                )
                            })
                        case 'votes':
                            return (
                                <TabPanel value={value} index={index + daoContractsAddresses.timelocks.length - 1} name={name} key={`panel-${daoContractsAddresses.standard}`}>
                                    <FunctionList name={daoContractsAddresses.standard} address={daoContractsAddresses[name]} />
                                </TabPanel>
                            )
                    }
                })}
            </Box>) : <Empty py={4} />}
        </Box>
    );
}