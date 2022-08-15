import { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Box, Button, Chip, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import CopyButton from 'src/components/CopyButton';
import { useGovernorContract } from 'src/hooks/useContract';
import { useAppContext } from 'src/contexts/app-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useDAOContext } from 'src/contexts/dao-context';
import { useApi } from 'src/hooks/useApi';
import useNotifier from 'src/hooks/useNotifier';
import { getDescriptionHash } from 'src/utils/ipfs';
import ActionList from './ActionList';
import ProposalInfoForm from './ProposalInfoForm';

export default function ProposalCreation() {
    const ZERO_ADDRESS = '0x'+'0'.repeat(40);
    const { address, chain } = useWeb3Context();
    const { data } = useDAOContext();
    const governorContract = useGovernorContract(data.dao.governor ?? ZERO_ADDRESS, true);
    const { ipfsUploadClient } = useApi();

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

    return (
        <Box p={3}>
            <Grid 
                container 
                spacing={2}
                justifyContent="center"
            >   
                <Grid
                    item xs={10} lg={12} mb={3}
                    container justifyContent="space-between"
                >
                    <RouterLink to={'./'.replace('/create', '')}>
                        <Button variant='contained' sx={{mr:2}}>Back</Button>
                    </RouterLink>
                    <Button
                        variant='contained'
                        sx={{ml:2}}
                    >
                        Create
                    </Button>
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
                        <ActionList/>
                    </Box>
                </Grid>
                <Grid
                    item xs={10} lg={6}
                    mb={3}
                >
                    <Typography color='text.primary' variant='h5'>
                        Proposal Description
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
                        <ProposalInfoForm/>
                    </Box>
                </Grid>
                <Grid item xs={10} lg={6} alignItems='center'>
                    <Typography color='text.primary' component={'span'} variant='h5'>
                        IPFS Upload
                        <TextField 
                            id='ipfsHash'
                            name='ipfsHash'
                            disabled 
                            size='small'
                            InputProps={{
                                sx: {
                                    ml: 2,
                                    height: '25px'
                                },
                                endAdornment: <InputAdornment position='end'>
                                                <IconButton>
                                                    <OpenInNewOutlinedIcon/>
                                                </IconButton>
                                            </InputAdornment>,
                            }}
                        />
                    </Typography>
                    <Box
                        minHeight='300px'
                        sx={{ 
                            mt: 2,
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: '12px',
                        }}
                    >
                        
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}