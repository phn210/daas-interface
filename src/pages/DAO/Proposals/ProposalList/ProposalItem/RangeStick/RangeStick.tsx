import React from 'react';
import { SxProps, Theme, Tooltip } from '@mui/material';
import { RangeStickRootStyle } from './RangeStickRootStyle';
import { compactNumber } from 'src/utils/format';

type Props = {
  type: 'For' | 'Against' | 'Abstain';
  valuePercentage: number;
  valueCount: number;
  style?: React.CSSProperties | undefined;
  sx?: SxProps<Theme> | undefined;
};

export default function RangeStick(props: Props) {
  const color = (type: string) => {
    switch (type) {
      case 'For':
        return 'rgba(104, 221, 201, 1)';
      case 'Against':
        return 'rgba(179, 157, 219, 1)';
      case 'Abstain':
        return 'rgba(150, 150, 150, 1)';
    }
  }

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
            background: color(props.type),
          }}
        />
      </div>
    </RangeStickRootStyle>
  );
}
