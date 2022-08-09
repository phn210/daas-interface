import React from 'react';
import { SxProps, Theme, Tooltip } from '@mui/material';
import { RangeStickRootStyle } from './RangeStickRootStyle';
import { compactNumber } from 'src/utils/format';

type Props = {
  type: 'For' | 'Against';
  valuePercentage: number;
  valueCount: number;
  style?: React.CSSProperties | undefined;
  sx?: SxProps<Theme> | undefined;
};

export default function RangeStick(props: Props) {
  return (
    <RangeStickRootStyle sx={props.sx} style={props.style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span>
          <span style={{ marginRight: '18px', display: 'inline-block', width: '55px' }}>{props.type}</span>
          <Tooltip title={props.valueCount.toFixed(2)} arrow placement="right">
            <span style={{ fontWeight: 'bold' }}>{compactNumber(Math.round(props.valueCount || 0), 2)}</span>
          </Tooltip>
        </span>
        <span>{Math.round(props.valuePercentage * 100) / 100}%</span>
      </div>

      <div className="stick_bg">
        <span
          className="stick_value"
          style={{
            width: `${props.valuePercentage}%`,
            background: props.type == 'For' ? 'rgba(104, 221, 201, 1)' : 'rgba(179, 157, 219, 1)',
          }}
        />
      </div>
    </RangeStickRootStyle>
  );
}
