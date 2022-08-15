import { Wallet, utils, BigNumber, BigNumberish } from 'ethers';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Chip, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { useDAOFactoryContract } from 'src/hooks/useContract';
import { useAppContext } from 'src/contexts/app-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useApi } from 'src/hooks/useApi';
import useNotifier from 'src/hooks/useNotifier';
import { getDescriptionHash } from 'src/utils/ipfs';
import CopyButton from 'src/components/CopyButton';
import AdminList from './AdminList';
import GTokenForm from './GTokenForm';
import BaseConfigForm from './BaseConfigForm';
import ConfigList from './ConfigList';
import TimelockList from './TimelockList';
import DAOInfoForm from './DAOInfoForm';
import DAOItem from '../DAOList/DAOItem';
import { GTokenConfig, BaseConfig, GovernorConfig, TimelockConfig, IPFS, Initialization } from 'src/contexts/daos-context/types';

export default function DAOCreation() {
    const ZERO_ADDRESS = '0x'+'0'.repeat(40);
    const QUORUM_DENOMINATOR = 100000;
    const { address, chain } = useWeb3Context();
    const { daoFactoryAddresses } = useAppContext();
    const daoFactoryContract = useDAOFactoryContract(daoFactoryAddresses[chain?.chainId ?? 31337], true)
    const { ipfsUploadClient } = useApi();
    const history = useHistory();
    const { notifyError, notifySuccess } = useNotifier();

    const mockIpfs: IPFS = {
        name: 'DaaS',
        logoUrl: 'https://lh3.googleusercontent.com/fife/AAbDypDOOhfVENV9OVzMAIjilOjQV2KgmOXYqINJY09rkJOxDGafKSX2vbGp4y8HsTVzlJmvcY1nDvRGzgb2X2HLkOkwYE9cNGHg-CFp3HrPR6knMC6p4MkLHQiZ_t1wrVVPvPT0QdLZCoyHz1Ae7HqUc7A58FtiGMFwlYIF7GhvaoT4nfIxOh_767FPWLwMbsFwIIP_kU8UsQtneZE2OU1pZSz_v9d0bqb92pJmNkQyK8PJqaLN1wouwdewcwqe06CRirLdIZBFiW8hvoQi1fKy-G_jhcyBtO_2sGQ7y7hZgN47BeQqpeib8_9z9wEkyUrVyclrFjQuA0OdX15JhJc0zZCVuFEWirkrHk0PzCXEyodd86fpcAFqc2g1e8WKHwRCJvLTEe5YJj9uf2GEIjA-Lg7iEBYSafz3xbGlLQw_dOPiUoUy2QcnCCGoyys4JIzDOGcM3mqcto32a0hiZQBz5uMEzV--3IfB8BLFejCTan4lLlCkwZSCQKitVSmFkHkyg3MDhaZV72-PC0eWiisXkxcjnwveVb_TVx3V-6cKACkTpeLFZ9XlZL81_X4x_ut1KmHtIKokr5wrQQ_vMazrRv75F861k4S3gvm9_ukBw3qeMawX0gf_PzoNV66KHG_rMTWCrz6tZUZGkFERNIryh_GBWQAWlA_A2ThyDvV14-ovtHQvxb8inCZgelIjudgPHiaB6X9OhdYRs4UwDjnfYeUNqX7z-p_VUUKKSG4t8qm54SkdByaKwCWPmWQgFpPSESXqQZTZM9wqWOiCHZwux4XRnSVj4IgGDyxybr0aFUapWoh1YQ=w1157-h948',
        websiteUrl: 'https://www.facebook.com/nguyen.pham.210/',
        shortDescription: 'Governing the DAO as a Service platform',
        description: 'The DAO as a Service platform provides a solution for anyone to create a DAO as a new project or for their existing organization.'
    }

    const initialGTokenConfig: GTokenConfig = {
        deployedAddress: ZERO_ADDRESS,
        standard: 0,
        name: '',
        symbol: '',
        owner: '',
        decimals: 0,
        initialSupply: 0
    }

    const initialBaseConfig: BaseConfig = {
        minVotingDelay: 1,
        maxVotingDelay: 100000,
        minVotingPeriod: 1,
        maxVotingPeriod: 100000,
        isWhiteListRequired: false,
        defaultExpiration: 1795280400
    }

    const initialGovernorConfig: GovernorConfig = {
        votingDelay: 1,
        votingPeriod: 1,
        quorumAttendance: 0,
        quorumApproval: 0
    }

    const initialTimelockConfig: TimelockConfig = {
        minTimelockDelay: 1,
        maxTimelockDelay: 100000,
        delay: 1,
        gracePeriod: 100000,
    }

    const initialIpfsForm: IPFS = {
        name: '',
        logoUrl: '',
        websiteUrl: '',
        shortDescription: '',
        description: ''
    }

    const [admins, setAdmins] = useState([] as string[]);
    const [gTokenConfig, setGTokenConfig] = useState(initialGTokenConfig);
    const [baseConfig, setBaseConfig] = useState(initialBaseConfig);
    const [governorConfigs, setGovernorConfigs] = useState([initialGovernorConfig]);
    const [timelockConfigs, setTimelockConfigs] = useState([initialTimelockConfig]);
    const [ipfs, setIpfs] = useState(initialIpfsForm);
    const [ipfsHash, setIpfsHash] = useState('');
    const [uploadedIpfsHash, setUploadedIpfsHash] = useState('');

    const [createFormIsValid, setCreateFormIsValid] = useState([true, false, false, false, false]);
    const [createIpfsIsValid, setCreateIpfsIsValid] = useState(false);

    const newFormValid = (index: number, value: boolean) => {
        const newValid = createFormIsValid;
        newValid[index] = value;
        return newValid;
    }

    const uploadIpfs = async (data: IPFS) => {
        const form = new FormData();
        form.append('content', JSON.stringify(data, null, 4))
        const res = await ipfsUploadClient.post(
            '/add',
            form,
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(process.env.REACT_APP_INFURA_IPFS_ID + ':' + process.env.REACT_APP_INFURA_IPFS_SECRET)
                }
            }
        )
        return res.data;
    }

    const createDAO = async (data: any) => {
        try {
            console.log(daoFactoryAddresses[chain?.chainId ?? 31337])
            if (!address || !daoFactoryContract) {
                throw new Error('Wallet connection error');
            }
            console.log(daoFactoryContract.address)
            await (await daoFactoryContract.createDAO(
                data.admins,
                data.baseConfig,
                data.governorConfigs[0],
                data.timelockConfigs[0],
                data.gTokenAddress,
                data.standard,
                data.initialization,
                data.infoHash
            )).wait();
            notifySuccess('Create DAO successfully!');
            return true;
        } catch (error) {
            console.error('Failed to call creatDAO function: ', error);
            notifyError('Create DAO fail! ' + (error as Error).message);
            return false;
        }
    }

    const handleAdminsChange = (newAdmins: string[]) => {
        setAdmins(newAdmins);
        setCreateFormIsValid(newFormValid(0, true))
    }

    const handleGTokenConfigChange = (newConfig: any, isValid: boolean) => {
        setGTokenConfig(newConfig);
        setCreateFormIsValid(newFormValid(1, isValid))
    }

    const handleBaseConfigChange = (newConfig: BaseConfig, isValid: boolean) => {
        setBaseConfig(newConfig);
        setCreateFormIsValid(newFormValid(2, isValid))
    }

    const handleGovernorConfigsChange = (newConfigs: GovernorConfig[], isValid: boolean) => {
        setGovernorConfigs(newConfigs)
        setCreateFormIsValid(newFormValid(3, isValid))
    }

    const handleTimelockConfigsChange = (newConfigs: TimelockConfig[], isValid: boolean) => {
        setTimelockConfigs(newConfigs)
        setCreateFormIsValid(newFormValid(4, isValid))
    }

    const handleIpfsFormChange = (newForm: IPFS, isValid: boolean) => {
        setIpfs(newForm);
    }

    const onUploadIpfs = async (ev: React.SyntheticEvent) => {
        const uploadResult = await uploadIpfs(ipfs);
        setUploadedIpfsHash(uploadResult.Hash);
    }

    const handleIpfsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setIpfsHash(ev.target.value);
    }

    const onCreateDAO = async (ev: React.SyntheticEvent) => {
        const initialization: Initialization = gTokenConfig;
        delete baseConfig.defaultExpiration;
        Object.assign(initialization, {initialSupply: utils.parseUnits(
            initialization.initialSupply.toString(), initialization.decimals
        )})
        Object.assign(initialization, {decimals: Number(initialization.decimals)})

        const newDAO = {
            admins: admins,
            baseConfig: baseConfig,
            governorConfigs: governorConfigs,
            timelockConfigs: timelockConfigs,
            gTokenAddress: ZERO_ADDRESS,
            standard: gTokenConfig.standard,
            initialization: initialization,
            infoHash: getDescriptionHash(ipfsHash)
        }
        const res = await createDAO(newDAO);
        history.push('/');
    }

    return (
        <Box p={3}>
            <Grid 
                container 
                spacing={2}
                justifyContent="center"
            >
                <Grid
                    item
                    container justifyContent="end"
                >
                    <TextField
                        id='ipfsHash'
                        name='ipfsHash'
                        label='IPFS Hash'
                        required
                        size='small'
                        value={ipfsHash}
                        onChange={handleIpfsChange}
                        InputProps={{
                            sx: {
                                mr: 2,
                                bgcolor: 'background.default',
                                color: 'primary'
                            }
                        }}
                    />
                    <Button
                        variant='contained'
                        size='large'
                        onClick={onCreateDAO}
                    >
                        Create
                    </Button>
                </Grid>
                <Grid
                    item
                    container 
                    spacing={2}
                    justifyContent="center"
                    mb={3}
                >
                    <Grid item xs={10} lg={4}>
                        <Typography color='text.primary' variant='h5'>
                            Admins
                        </Typography>
                        <Box
                            height='331px'
                            sx={{ 
                                mt: 2,
                                p: 4,
                                bgcolor: 'background.paper',
                                borderRadius: '12px',
                                // overflowY: 'auto'
                            }}
                        >
                            <AdminList value={admins} onChange={handleAdminsChange}/>
                        </Box>
                    </Grid>
                    <Grid item xs={10} lg={8}>
                        <Typography color='text.primary' variant='h5'>
                            Governance Token
                        </Typography>
                        <Box
                            minHeight='330px'
                            sx={{ 
                                mt: 2,
                                p: 4,
                                bgcolor: 'background.paper',
                                borderRadius: '12px'
                            }}
                        >
                            <GTokenForm value={gTokenConfig} onChange={handleGTokenConfigChange}/>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container 
                    spacing={2}
                    justifyContent="center"
                    mb={3}
                >
                    <Grid
                        item xs={10} lg={4}
                    >
                        <Typography color='text.primary' variant='h5'>
                            Base Configuration
                        </Typography>
                        <Box
                            minHeight='300px'
                            sx={{ 
                                mt: 2,
                                p: 4,
                                bgcolor: 'background.paper',
                                borderRadius: '12px'
                            }}
                        >
                            <BaseConfigForm value={baseConfig} onChange={handleBaseConfigChange}/>
                        </Box>
                    </Grid>
                    <Grid
                        item xs={10} lg={4}
                    >
                        <Typography color='text.primary' variant='h5'>
                            Governor Configurations
                        </Typography>
                        <Box
                            minHeight='300px'
                            sx={{ 
                                mt: 2,
                                p: 4,
                                bgcolor: 'background.paper',
                                borderRadius: '12px'
                            }}
                        >
                            <ConfigList value={governorConfigs} baseValue={baseConfig} onChange={handleGovernorConfigsChange}/>
                        </Box>
                    </Grid>
                    <Grid
                        item xs={10} lg={4}
                    >
                        <Typography color='text.primary' variant='h5'>
                            Timelocks
                        </Typography>
                        <Box
                            minHeight='300px'
                            sx={{ 
                                mt: 2,
                                p: 4,
                                bgcolor: 'background.paper',
                                borderRadius: '12px'
                            }}
                        >
                            <TimelockList value={timelockConfigs} onChange={handleTimelockConfigsChange}/>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container 
                    spacing={2}
                    justifyContent="center"
                    mb={3}
                >
                    <Grid item xs={10} lg={6}>
                        <Typography color='text.primary' variant='h5'>
                            DAO Information
                        </Typography>
                        <Box
                            minHeight='85px'
                            sx={{ 
                                mt: 2,
                                p: 3,
                                bgcolor: 'background.paper',
                                borderRadius: '12px',
                            }}
                        >
                            <DAOInfoForm value={ipfs} onChange={handleIpfsFormChange}/>
                        </Box>
                        <Button 
                            variant='contained' 
                            size='large' 
                            sx={{ bgcolor: 'secodary.main', mt:1 }}
                            onClick={onUploadIpfs}
                        >
                            Upload
                        </Button>

                    </Grid>
                    <Grid item xs={10} lg={6} alignItems='center'>
                        <Typography color='text.primary' component={'span'} variant='h5'>
                            IPFS Upload
                            <TextField 
                                id='uploadedIpfsHash'
                                name='uploadedIpfsHash'
                                disabled
                                value={uploadedIpfsHash}
                                InputProps={{
                                    sx: {
                                        ml: 2,
                                        height: '25px'
                                    },
                                    endAdornment: 
                                    <InputAdornment position='end'>
                                        
                                    </InputAdornment>,
                                }}
                            />
                            <IconButton size='small' href={`https://daas.infura-ipfs.io/ipfs/${uploadedIpfsHash}`} target="_blank">
                                <OpenInNewOutlinedIcon/>
                            </IconButton>
                            <CopyButton text={uploadedIpfsHash}/>
                        </Typography>
                        <Box
                            minHeight='300px'
                            sx={{ 
                                mt: 1,
                                p: 3,
                                bgcolor: 'background.paper',
                                borderRadius: '12px',
                            }}
                        >
                            <DAOItem data={Object.assign(
                                {
                                    _id: '',
                                    chainId: String(chain?.chainId ?? '')
                                },
                                ipfs
                            )}/>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}