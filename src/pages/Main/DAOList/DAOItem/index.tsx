import { Avatar, Box, Grid, Link, Typography } from '@mui/material';
import { CHAINS } from 'src/contexts/web3-context/chains';
import { DAO } from 'src/contexts/daos-context/types';

type Props = {
    data: DAO;
}

export default function DAOItem(props: Props) {
    return (
        <Grid 
            container
            direction='column'
            sx={{ 
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: '12px',
                height: props.data.description ? '512px' : '300px',
                // my: 1
            }}
        >
            <Grid 
                item 
                container 
                spacing={2} 
                direction='row'
                sx = {{ mb: 3 }}
            >
                <Grid item xs={3}>
                    <Avatar
                        alt="DAO's Logo"
                        src={props.data.logoUrl}
                        sx={{
                            height: 68,
                            width: 68,
                            border: 1,
                            variant: 'rounded',
                            objectFit: 'cover'
                        }}
                    />
                </Grid>
                <Grid 
                    item xs={9} 
                    container 
                    spacing={1} 
                    direction='column'
                    alignItems='end'
                >
                    <Grid item>
                        <Typography 
                            color='text.primary'
                            className='name'
                            variant='h4'
                        >
                            {props.data.name}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            color='text.secondary'
                            // variant='h5'
                        >
                            {CHAINS[Number(props.data.chainId)]?.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{ height: props.data.description ? '15%' : '52%' }}>
                <Typography align='left'>
                    {props.data.shortDescription}
                </Typography>
            </Grid>
            {props.data.description ? (
                <Grid 
                    item
                    sx={{ height: '50%' }}
                    my={2}
                >
                    <Box
                        component='div'
                        sx={{
                            height: '100%',
                            textOverflow: 'ellipsis',
                            overflow: 'auto',
                            // my: 2                                
                        }}
                    >
                        <Typography align='left' lineHeight={1.8}>
                            {props.data.description}
                        </Typography>
                    </Box>
                </Grid>
            ) : null}
            <Grid item>
                <Typography
                    color='text.secondary'
                    align='center'
                >
                    <Link 
                        rel='noreferrer'
                        target='_blank'
                        href={props.data.websiteUrl}
                        underline='none'
                        color='text.secondary'
                    >
                        {props.data.websiteUrl}
                    </Link>
                </Typography>
            </Grid>
        </Grid>
    );
}