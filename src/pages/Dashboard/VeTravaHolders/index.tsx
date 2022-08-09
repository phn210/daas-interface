import { Box, Pagination, Typography, useMediaQuery } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import CopyButton from 'src/components/CopyButton';
import { useAppContext } from 'src/contexts/app-context';
import { useDashboardContext } from 'src/contexts/dashboard-context';
import { formatAddress, formatNumber } from 'src/utils/format';
import { getAvgTime } from 'src/utils/lockTime';

export default function VeTravaHolders() {
  const { data } = useDashboardContext();

  const rows = React.useMemo<
    Array<{ address: string | undefined; votingPower: string | undefined; avgTimeLock: string | undefined }>
  >(() => {
    const topWallets = data?.topWallets;
    if (!topWallets) return [];
    return topWallets.map(
      (wallet: { address: string; voting_power: number; avg_time_lock: number; amount?: number } | undefined) => ({
        address: wallet?.address,
        votingPower: formatNumber(wallet?.voting_power, { fractionDigits: 2 }),
        avgTimeLock: getAvgTime(wallet?.avg_time_lock),
      })
    );
  }, [data]);

  const rowPerPage = 10;
  const pageCount = React.useMemo<number>(() => Math.floor((rows.length ?? 0) / rowPerPage), [rows]);
  const [page, setPage] = React.useState<number>(1);
  const customMd = useMediaQuery('(min-width:980px)');
  const customXs = useMediaQuery('(min-width:500px)');
  const { mode } = useAppContext();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" whiteSpace="nowrap" gutterBottom>
        veTrava Holders
      </Typography>

      <Paper sx={{ px: { md: 3, xs: 1 }, py: 2, flexGrow: 1 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: '500px',
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  '& th, & td': {
                    border: 0,
                  },
                }}
              >
                <TableCell>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 'small',
                    }}
                  >
                    No.
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 'small',
                    }}
                  >
                    Wallet Address
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 'small',
                    }}
                  >
                    Voting Power
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: 'small',
                    }}
                  >
                    Avg. Lock Time
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(rowPerPage * (page - 1), rowPerPage * page).map((row, index, arr) => (
                <TableRow
                  key={index}
                  sx={{
                    '& th, & td': {
                      border: 0,
                    },
                    borderBottom: index < arr.length - 1 ? '1px solid #3E526C' : 0,
                  }}
                >
                  <TableCell>
                    <Typography>{rowPerPage * (page - 1) + index + 1}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography
                        sx={{
                          color: mode === 'dark' ? '#A6BBD4' : '#566474',
                        }}
                      >
                        {customMd
                          ? formatAddress(row.address ?? '', 10, 4)
                          : customXs
                          ? formatAddress(row.address ?? '')
                          : formatAddress(row.address ?? '', 2, 4)}
                      </Typography>
                      &nbsp;
                      <CopyButton
                        text={row.address ?? ''}
                        IconButtonProps={{
                          style: {
                            color: mode === 'dark' ? '#1958C6' : '#566474',
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.votingPower}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography>{row.avgTimeLock}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box
        sx={{
          mt: 3,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Pagination count={pageCount} page={page} onChange={handleChange} siblingCount={1} boundaryCount={0} />
      </Box>
    </Box>
  );
}
