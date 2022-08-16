import { Box, Tooltip, Typography } from '@mui/material';
import Failed from 'src/components/Failed';
import Loading from 'src/components/Loading';
import { FetchingStatus } from 'src/constants';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { CanCelledCircleIcon, CheckCircleFillIcon } from 'src/icons';
import { getErrorMessage } from 'src/utils';
import { compactNumber } from 'src/utils/format';
import RangeStick from '../../ProposalList/ProposalItem/RangeStick/RangeStick';
import { VotingResultRootStyle } from './VotingResultRootStyle';

const EnumStatus: string[] = [
  'pending',
  'active',
  'canceled',
  'defeated',
  'succeeded',
  'queued',
  'expired',
  'executed',
];
export default function VotingResult() {
  const { data, statusCallContract, error } = useDetailProposalContext();
  const { activating } = useWeb3Context();

  function getQuorumView(proposalStatus: number, forVotes: number, quorumValue: number) {
    if (proposalStatus == 0 || proposalStatus == 2) {
      return <div />;
    }
    if (proposalStatus == 1) {
      if (forVotes < quorumValue) {
        return (
          <div className="process">
            <span className="process_value" style={{ width: (forVotes / quorumValue) * 100 + '%' }} />
          </div>
        );
      } else {
        return (
          <span>
            <CheckCircleFillIcon sx={{ ml: 1 }} />
          </span>
        );
      }
    }
    if (proposalStatus == 3) {
      if (forVotes < quorumValue) {
        return (
          <span>
            <CanCelledCircleIcon sx={{ ml: 1 }} />
          </span>
        );
      } else {
        return (
          <span>
            <CheckCircleFillIcon sx={{ ml: 1 }} />
          </span>
        );
      }
    }
    if (proposalStatus == 4 || proposalStatus == 5 || proposalStatus == 6 || proposalStatus == 7) {
      return (
        <span>
          <CheckCircleFillIcon sx={{ ml: 1 }} />
        </span>
      );
    }
    return <div />;
  }
  return (
    <VotingResultRootStyle sx={{ bgcolor: 'background.paper', p: 2, borderRadius: '12px' }}>
      <Typography variant="h5" color="text.primary">
        Voting Result
      </Typography>
      <br />
      {(statusCallContract === FetchingStatus.IDLE ||
        statusCallContract === FetchingStatus.FETCHING ||
        activating ||
        statusCallContract === FetchingStatus.UPDATING) && (
        <Box textAlign={'center'} py={4}>
          <Loading size={50} />
          <Typography color="text.secondary">Please wait a moment...</Typography>
        </Box>
      )}
      {statusCallContract === FetchingStatus.FAILED && (
        <Failed title="Failed to fetch data" detail={getErrorMessage(error)} />
      )}
      {statusCallContract === FetchingStatus.SUCCESS && (
        <>
          <RangeStick
            type="For"
            valueCount={Number(data.votingResult?.forVotes)}
            valuePercentage={Number(data.votingResult?.forVotesPercentage)}
            style={{ maxWidth: 'unset' }}
          />
          <br />
          <RangeStick
            type="Against"
            valueCount={Number(data.votingResult?.againstVotes)}
            valuePercentage={Number(data.votingResult?.againstVotesPercentage)}
            style={{ maxWidth: 'unset' }}
          />
          <br />
          <RangeStick
            type="Abstain"
            valueCount={Number(data.votingResult?.abstainVotes)}
            valuePercentage={Number(data.votingResult?.abstainVotesPercentage)}
            style={{ maxWidth: 'unset' }}
          />
          <br />
          <div className={'flex_justify_between'}>
            <Typography color="secondary.light">Status</Typography>
            <span className={`status_voting_result ${EnumStatus[Number(data.votingResult?.status)]}`}>
              <span className="status_dot" /> {EnumStatus[Number(data.votingResult?.status)] || 'Unknow'}
            </span>
          </div>
          <Box className={'flex_justify_between'} sx={{ mt: 2 }}>
            <Typography color="secondary.light">Current votes</Typography>
            <Tooltip title={Number(data.votingResult?.totalVote).toFixed(2)} arrow placement="left">
              <span>{compactNumber(Math.round(Number(data.votingResult?.totalVote || 0)), 2)}</span>
            </Tooltip>
          </Box>
          {/* <Box className={'flex_justify_between'} sx={{ mt: 2 }}>
            <Typography color="secondary.light">Quorum</Typography>
            {getQuorumView(
              Number(data.votingResult?.status),
              Number(data.votingResult?.forVotes),
              Number(data.votingResult?.quorum)
            )}
          </Box> */}
          <Box className={'flex_justify_between'} sx={{ mt: 2 }}>
            <Typography color="secondary.light">Total voting power</Typography>
            <Tooltip title={Number(data.votingResult?.totalVotingPower).toFixed(2)} arrow placement="left">
              <span>{compactNumber(Math.round(Number(data.votingResult?.totalVotingPower || 0)), 2)}</span>
            </Tooltip>
          </Box>
        </>
      )}
    </VotingResultRootStyle>
  );
}
