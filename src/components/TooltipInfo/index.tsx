import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, SvgIconProps, Tooltip, TooltipProps } from '@mui/material';
import { HelpIcon } from 'src/icons';

interface TooltipInfoProps extends Omit<TooltipProps, 'children'> {
  iconProps: SvgIconProps;
  variant: 'outlined' | 'filled';
}

export default function TooltipInfo(props: TooltipInfoProps) {
  const { iconProps, variant, ...other } = props;
  const IconTag = variant === 'outlined' ? HelpOutlineIcon : HelpIcon;

  return (
    <Tooltip {...other}>
      <Box sx={{ display: 'inline' }}>
        <IconTag {...iconProps} />
      </Box>
    </Tooltip>
  );
}

TooltipInfo.defaultProps = {
  iconProps: {
    sx: {
      verticalAlign: 'middle',
    },
  },
  arrow: true,
  variant: 'outlined',
};
