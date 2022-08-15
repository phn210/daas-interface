import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import { DownloadCircleIcon, ExplorCircleIcon, TwitterCircleIcon } from 'src/icons';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { CustomContentStyle } from './CustomContentStyle';
import { TwitterShareButton } from 'react-share';

export default function ProposalInfor() {
  const { data } = useDetailProposalContext();
  const matches = useMediaQuery('(max-width:1440px)');
  function getNameAuthors() {
    if (data.proposalContent?.authors?.length) {
      let result = '';
      const numberAuthor: number = data.proposalContent.authors.length;
      for (let i = 0; i < numberAuthor; i++) {
        result = result + data.proposalContent.authors[i] + ', ';
      }
      return result.slice(0, -2);
    }
  }
  function discussOnForum() {
    window.open(data.proposalContent?.discussions || '', '_blank');
  }
  function download() {
    window.open('https://ipfs.infura-ipfs.io/ipfs/' + data.proposalContent?.ipfsCid || '', '_blank');
  }
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: '12px' }}>
      <Grid container sx={{ mt: -1, mb: 1, flexDirection: matches ? 'column-reverse' : 'row' }} rowSpacing={2}>
        <Grid item xs={12} xl={7} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3" color="text.primary">
            {data.proposalContent?.title || 'No title'}
          </Typography>
        </Grid>
        <Grid item xs={12} xl={5} sx={{ display: 'flex', justifyContent: 'end' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <span>
              <Button
                color="secondary"
                style={{ padding: '5px 0px', fontWeight: 'normal', whiteSpace: 'nowrap' }}
                onClick={discussOnForum}
              >
                <ExplorCircleIcon style={{ marginRight: '5px' }} />
                Discuss on Forum
              </Button>
            </span>
            <span>
              <Button
                color="secondary"
                style={{ padding: '5px 0px', fontWeight: 'normal', whiteSpace: 'nowrap' }}
                onClick={download}
              >
                <DownloadCircleIcon style={{ marginRight: '5px' }} />
                Download
              </Button>
            </span>
            {/* <span>
              <TwitterShareButton
                title={data.proposalContent?.title || 'No title'}
                url={window.location.href}
                hashtags={['Trava', 'TravaGovernance']}
              >
                <Button color="secondary" style={{ padding: '5px 0px', fontWeight: 'normal', whiteSpace: 'nowrap' }}>
                  <TwitterCircleIcon style={{ marginRight: '5px' }} />
                  Share on twitter
                </Button>
              </TwitterShareButton>
            </span> */}
          </div>
        </Grid>
      </Grid>

      <Typography sx={{ mb: 3 }} color="text.disabled">
        <i>Author - {getNameAuthors()}</i>
      </Typography>

      <CustomContentStyle
        className="detail-news__content"
        dangerouslySetInnerHTML={{ __html: data.proposalContent?.description || '' }}
      />
    </Box>
  );
}
