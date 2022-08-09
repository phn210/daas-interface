import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import ProposalItem from './ProposalItem';
import Empty from 'src/components/Empty';

type ParamsUrl = {
    daoId: string;
}

export default function Proposals() {
    const list = [
        {
            title: 'Proposal 1',
            status: 1,
            againstVotes: '10000',
            againstVotesPercentage: '20',
            forVotes: '40000',
            forVotesPercentage: '80',
            cancelled: false,
            executed: false,
            duration: 1000,
            eta: 1658218931,
            proposer: '0x',
            startBlock: 1658217951,
            quorumAttendance: '20',
            quorumApproval: '50',
            id: '1',
            stateText: 'Active',
            stateTimestamp: 1658217931
        },
        {
            title: 'Proposal 2',
            status: 2,
            againstVotes: '10000',
            againstVotesPercentage: '20',
            forVotes: '40000',
            forVotesPercentage: '80',
            cancelled: false,
            executed: false,
            duration: 1000,
            eta: 1658218931,
            proposer: '0x',
            startBlock: 1658217951,
            quorumAttendance: '20',
            quorumApproval: '50',
            id: '2',
            stateText: 'Active',
            stateTimestamp: 1658217931
        },
        {
            title: 'Proposal 3',
            status: 3,
            againstVotes: '10000',
            againstVotesPercentage: '20',
            forVotes: '40000',
            forVotesPercentage: '80',
            cancelled: false,
            executed: false,
            duration: 1000,
            eta: 1658218931,
            proposer: '0x',
            startBlock: 1658217951,
            quorumAttendance: '20',
            quorumApproval: '50',
            id: '3',
            stateText: 'Active',
            stateTimestamp: 1658217931
        },
        {
            title: 'Proposal 4',
            status: 4,
            againstVotes: '10000',
            againstVotesPercentage: '20',
            forVotes: '40000',
            forVotesPercentage: '80',
            cancelled: false,
            executed: false,
            duration: 1000,
            eta: 1658218931,
            proposer: '0x',
            startBlock: 1658217951,
            quorumAttendance: '20',
            quorumApproval: '50',
            id: '4',
            stateText: 'Active',
            stateTimestamp: 1658217931
        },
        {
            title: 'Proposal 5',
            status: 5,
            againstVotes: '10000',
            againstVotesPercentage: '20',
            forVotes: '40000',
            forVotesPercentage: '80',
            cancelled: false,
            executed: false,
            duration: 1000,
            eta: 1658218931,
            proposer: '0x',
            startBlock: 1658217951,
            quorumAttendance: '20',
            quorumApproval: '50',
            id: '5',
            stateText: 'Active',
            stateTimestamp: 1658217931
        },
    ];
    const params: ParamsUrl = useParams();
    return (
        <Box p={3}>
            <Grid className="title_and_search" container rowSpacing={{ xs: 2 }}>
                <Grid 
                    item xs={12} sm={6}
                    container columnSpacing={3}
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: '500'
                    }}
                >
                    <Grid item>
                        <Typography variant='h4'>Proposals</Typography>
                    </Grid>
                    <Grid item>
                        <RouterLink
                            to={`/${params.daoId}/proposals/create`}
                            style={{
                                textDecoration: 'none'
                            }}
                        >
                            <Button variant='contained'>Create</Button>
                        </RouterLink>
                    </Grid>                    
                </Grid>
                <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'right' }}>
                    <TextField
                    label="Search"
                    size="small"
                    style={{ width: '-webkit-fill-available', maxWidth: '348px' }}
                    // onChange={(e) => {
                    //     setSearchName(e.target.value);
                    // }}
                    />
                    {/* <FilterButton filterState={filterState} setFilterState={(list) => setFilterState(list)} /> */}
                </Grid>
            </Grid>
            {(
                <>
                    {list.length === 0 ? (
                    <Empty py={4} />
                    ) : (
                    <>
                        {list.map((item, index: number) => {
                            return (
                                <RouterLink
                                    to={`/${params.daoId}/proposals/${item.id}`}
                                    key={'proposal'+item.id+index}
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <ProposalItem data={item}/>
                                </RouterLink>
                            );
                        })}
                    </>
                    )}
                </>
            )}
        </Box>
    );
}