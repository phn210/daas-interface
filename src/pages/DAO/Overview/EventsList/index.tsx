import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Event } from 'src/contexts/dao-context/types';
import Empty from 'src/components/Empty';

type Props = {
    events: Event[];
}

function createData(
    name: string,
    contract: string,
    blockTimestamp: number,
    transactionHash: string
) {
    return { name, contract, blockTimestamp, transactionHash };
}

export default function EventsList(props: Props) {
    const rows = props.events.map(e => {
        return createData(
            e.name, e.contract, e.blockTimestamp, e.transactionHash
        )
    })
    return (
        <TableContainer>
            <Table sx={{minWidth: '600'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Contract</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell align='right'>TxHash</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.reverse().map((row) => (
                        <TableRow
                            key={`${row.name}-${row.transactionHash}`}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        {/* <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell> */}
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.contract}</TableCell>
                        <TableCell>{(new Date(Number(row.blockTimestamp+'000'))).toUTCString()}</TableCell>
                        <TableCell align='right'>{row.transactionHash}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}