import { CheckCircleFillIcon, CanCelledCircleIcon } from 'src/icons/index';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BN } from 'src/utils';

type Props = {
  quorumValue: string;
  forVotes: string;
  proposalStatus: number;
};

export const QuorumRootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '& .process': {
    maxWidth: '150px',
    height: '6px',
    background: theme.palette.info.light,
    flexGrow: '1',
    marginLeft: '8px',
    position: 'relative',
    borderRadius: '10px',
    '& .process_value': {
      position: 'relative',
      top: 0,
      left: 0,
      display: 'block',
      height: '100%',
      //   width: '50%',
      background: theme.palette.primary.main,
      borderRadius: '10px',
    },
  },
}));

export default function Quorum(props: Props) {
  if (props.proposalStatus == 0 || props.proposalStatus == 2) {
    return <div />;
  }
  if (props.proposalStatus == 1) {
    if (Number(props.forVotes) < Number(props.quorumValue)) {
      return (
        <QuorumRootStyle>
          <Typography>Quorum</Typography>
          {/* Quorum{' '} */}
          <div className="process">
            <span
              className="process_value"
              style={{ width: BN(props.forVotes).div(BN(props.quorumValue)).times(100).toString() + '%' }}
            />
          </div>
        </QuorumRootStyle>
      );
    } else {
      return (
        <QuorumRootStyle>
          Quorum <CheckCircleFillIcon sx={{ ml: 1 }} />
        </QuorumRootStyle>
      );
    }
  }
  if (props.proposalStatus == 3) {
    if (Number(props.forVotes) < Number(props.quorumValue)) {
      return (
        <QuorumRootStyle>
          Quorum <CanCelledCircleIcon sx={{ ml: 1 }} />
        </QuorumRootStyle>
      );
    } else {
      return (
        <QuorumRootStyle>
          Quorum <CheckCircleFillIcon sx={{ ml: 1 }} />
        </QuorumRootStyle>
      );
    }
  }
  if (
    props.proposalStatus == 4 ||
    props.proposalStatus == 5 ||
    props.proposalStatus == 6 ||
    props.proposalStatus == 7
  ) {
    return (
      <QuorumRootStyle>
        Quorum <CheckCircleFillIcon sx={{ ml: 1 }} />
      </QuorumRootStyle>
    );
  }
  return <div />;
}
