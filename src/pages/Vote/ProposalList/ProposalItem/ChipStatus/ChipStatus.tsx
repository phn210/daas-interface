import { EnumStatus } from 'src/pages/Vote/EnumStatus';
import { ChipStatusRootStyles } from './ChipStatusRootStyle';

type Props = {
  status: number;
};

export default function ChipStatus(props: Props) {
  return (
    <ChipStatusRootStyles className={`chip_${EnumStatus[props.status]}`}>
      <span className="status_dot" />
      <span className="status_text">{EnumStatus[props.status]}</span>
    </ChipStatusRootStyles>
  );
}
