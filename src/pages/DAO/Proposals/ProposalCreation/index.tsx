import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Box, Button, Chip, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Reply } from '@mui/icons-material';
import CopyButton from 'src/components/CopyButton';
import { useGovernorContract } from 'src/hooks/useContract';
import { useAppContext } from 'src/contexts/app-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useDAOContext } from 'src/contexts/dao-context';
import { useApi } from 'src/hooks/useApi';
import useNotifier from 'src/hooks/useNotifier';
import { getDescriptionHash } from 'src/utils/ipfs';
import { Action, Author, IPFS } from 'src/contexts/proposals-context/types';
import ActionList from './ActionList';
import ProposalInfoForm from './ProposalInfoForm';

export default function ProposalCreation() {
    const ZERO_ADDRESS = '0x'+'0'.repeat(40);
    const { address, chain } = useWeb3Context();
    const { data } = useDAOContext();
    const governorContract = useGovernorContract(data.dao?.governor ?? ZERO_ADDRESS, true);
    const { ipfsUploadClient } = useApi();
    const { notifyError, notifySuccess } = useNotifier();

    const mockIpfs = {
        daoId: '',
        chainId: '4',
        index: '0',
        name: 'DAO Name 1',
        network: 'Ethereum',
        shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id ex varius, pellentesque ante sagittis, dapibus felis. Fusce vulputate neque a mattis congue. Aenean turpis turpis, faucibus a sagittis pharetra, maximus at libero. Fusce venenatis semper turpis, sed sollicitudin felis condimentum sit amet. Pellentesque ut libero magna. Pellentesque lacinia iaculis ex, et lacinia justo facilisis sed. Ut eros ligula, rutrum eu fermentum eu, tempus ac velit. Proin elit sem, efficitur eu sagittis vitae, varius non elit. Praesent tincidunt consequat nisi vitae auctor. Vivamus sollicitudin eu odio vel hendrerit. Proin in vulputate enim. Pellentesque interdum arcu id neque vestibulum, quis semper est tincidunt.\nMaecenas consequat eros sed nunc dapibus, quis hendrerit arcu pharetra. Duis rhoncus sit amet ex ut molestie. Mauris et risus quis nisl semper pellentesque nec sit amet elit. Vestibulum sagittis eu erat nec tristique. Praesent auctor tincidunt eros, tempor commodo orci porttitor eu. Nam dictum massa vitae venenatis luctus. In sapien eros, dapibus et malesuada at, sagittis eu turpis. Maecenas vel faucibus velit, ut feugiat neque. Etiam lobortis at enim ut auctor. Praesent a eros vitae dui suscipit rhoncus. Donec nec tortor nisl. Vivamus quis ex ut tortor pretium mollis. Fusce nec est quis sem condimentum faucibus sit amet a mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
        logoUrl: 'https://d33wubrfki0l68.cloudfront.net/fcd4ecd90386aeb50a235ddc4f0063cfbb8a7b66/4295e/static/bfc04ac72981166c740b189463e1f74c/40129/eth-diamond-black-white.jpg',
        websiteUrl: 'https://google.com'
    }

    const initialAuthor = {
        name: '',
        handle: ''
    }

    const initialIpfsForm: IPFS = {
        title: '',
        authors: [initialAuthor as Author],
        organization: '',
        discussions: '',
        shortDescription: '',
        description: ''
    }

    const [ipfs, setIpfs] = useState(initialIpfsForm);
    const [ipfsHash, setIpfsHash] = useState('');
    const [uploadedIpfsHash, setUploadedIpfsHash] = useState('');
    const [actions, setActions] = useState([] as Action[]);

    const uploadIpfs = async (data: IPFS) => {
        const form = new FormData();
        form.append('content', JSON.stringify(data, null, 4))
        console.log('form', form)
        const res = await ipfsUploadClient.post(
            '/add',
            form,
            {
                headers: {
                    'Authorization': 'Basic ' + btoa(process.env.REACT_APP_INFURA_IPFS_ID + ':' + process.env.REACT_APP_INFURA_IPFS_SECRET)
                }
            }
        )
        console.log(res.data)
        return res.data;
    }

    const createProposal = async (data: any) => {
        try {
            if (!address || !governorContract) {
                throw new Error('Wallet connection error');
            }
            console.log(governorContract.address)
            await (await governorContract.propose(
                0,
                0,
                data.actions,
                data.descriptionHash
            )).wait();
            notifySuccess('Propose successfully!');
            return true;
        } catch(error) {
            console.error('Failed to create new proposal ', error);
            notifyError('Propose fail! ' + (error as Error).message);
            return false
        }
    }

    const handleActionsChange = (newActions: Action[], isValid: boolean) => {
        setActions(newActions);
        console.log(actions);
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

    const onCreateProposal = async (ev: React.SyntheticEvent) => {
        const newProposal = {
            actions: actions,
            descriptionHash: getDescriptionHash(ipfsHash)
        }
        const res = await createProposal(newProposal);
        console.log(res)
    }

    return (
        <Box p={3}>
            <Grid 
                container 
                spacing={2}
                justifyContent="center"
            >
                <Grid
                    item xs={10} lg={12}
                    mb={3}
                    container
                    justifyContent="space-between"
                >
                    <Grid item xs={3}>
                        <RouterLink to={'../proposals'} style={{ textDecoration: 'none' }}>
                            <Button
                            variant="contained"
                            sx={{ bgcolor: 'secondary.dark', color: 'text.primary', ':hover': { bgcolor: 'primary.light' } }}
                            >
                                <Reply sx={{ mr: 1, width: '21px' }} /> Back
                            </Button>
                        </RouterLink>
                    </Grid>
                    <Grid item xs={9} container justifyContent="end">
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
                            onClick={onCreateProposal}
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    item xs={10} lg={12}
                    mb={3}
                >
                    <Typography color='text.primary' variant='h5'>
                        Proposal&apos;s Actions
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
                        <ActionList value={actions} onChange={handleActionsChange}/>
                    </Box>
                </Grid>
                <Grid
                    item xs={10} lg = {12}
                    // lg={6}
                    mb={3}
                >
                    <Typography
                        component='span'
                        color='text.primary'
                        variant='h5'
                    >
                        Proposal Description
                    </Typography>
                    <TextField 
                        id='uploadedIpfsHash'
                        name='uploadedIpfsHash'
                        disabled
                        value={uploadedIpfsHash}
                        InputProps={{
                            sx: {
                                ml: 2,
                                height: '25px'
                            }
                        }}
                    />
                    <IconButton size='small' href={`https://daas.infura-ipfs.io/ipfs/${uploadedIpfsHash}`} target="_blank">
                        <OpenInNewOutlinedIcon/>
                    </IconButton>
                    <CopyButton text={uploadedIpfsHash}/>
                    <Box
                        minHeight='85px'
                        sx={{ 
                            mt: 2,
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                        }}
                    >
                        <ProposalInfoForm value={ipfs} onChange={handleIpfsFormChange}/>
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
            </Grid>
        </Box>
    );
}