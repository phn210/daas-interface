import { SvgIconComponent } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, BoxProps, SvgIconProps, Typography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

interface FailedProps extends BoxProps {
  title: string;
  titleProps?: TypographyProps;
  detail?: string | ReactNode;
  ErrorIcon: SvgIconComponent;
  errorIconProps?: SvgIconProps;
  children?: ReactNode;
}

export default function Failed(props: FailedProps) {
  const { title, titleProps, detail, ErrorIcon, errorIconProps, children, ...other } = props;

  return (
    <Box textAlign="center" {...other}>
      <ErrorIcon color="error" fontSize="large" {...errorIconProps} />
      <Typography color="error" variant="subtitle2" gutterBottom {...titleProps}>
        {title}
      </Typography>
      {detail && (
        <Typography variant="body3" color="text.secondary">
          {detail}
        </Typography>
      )}
      {children && <Box mt={1}>{children}</Box>}
    </Box>
  );
}

Failed.defaultProps = {
  ErrorIcon: ClearIcon,
  title: 'Failed!',
};
