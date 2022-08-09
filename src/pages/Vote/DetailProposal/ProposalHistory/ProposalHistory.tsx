import { IconButton, Typography } from '@mui/material';
import { CheckCircleFillIcon, ExploreIcon } from 'src/icons';
import { ProposalHistoryRootStyle } from './ProposalHistoryRootStyle';
import { useWeb3Context } from 'src/contexts/web3-context/index';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { StatusProposal } from 'src/contexts/detail-proposal-context/types';
import Moment from 'react-moment';

export default function ProposalHistory() {
  const { getTransactionExplorerLink } = useWeb3Context();
  const { data } = useDetailProposalContext();

  function openInNewTab(url: string) {
    window?.open(url, '_blank')?.focus();
  }
  return (
    <ProposalHistoryRootStyle sx={{ bgcolor: 'background.paper', p: 2, borderRadius: '12px' }}>
      <Typography variant="h5" color="text.primary">
        Proposal History
      </Typography>
      <div className="timeline">
        {data.statusHistory?.map((status: StatusProposal, index: number) => {
          return (
            <div className="timeline_item" key={'timeline' + index}>
              <div className="timline_item_icon">
                <CheckCircleFillIcon style={{ fontSize: '32px' }} />
              </div>
              <div className="timline_item_content">
                <div>
                  <Typography color="text.primary" style={{ textTransform: 'capitalize' }}>
                    {status.status}
                  </Typography>
                  <Typography color="text.secondary">
                    <Moment date={new Date(Number(status.timestamp))} format="MMMM Do yyyy, hh:mm A" />
                  </Typography>
                </div>
                {status.tx ? (
                  <IconButton onClick={() => openInNewTab(getTransactionExplorerLink(status.tx))}>
                    <ExploreIcon />
                  </IconButton>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}

        {/* <ThreeDotCircleicon style={{ fontSize: '32px' }} /> */}
      </div>
    </ProposalHistoryRootStyle>
  );
}
