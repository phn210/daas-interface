import { Button, Dialog, DialogActions, DialogContent, DialogProps } from '@mui/material';
import { ReactNode, SyntheticEvent } from 'react';

interface DialogConfirmProps extends Omit<DialogProps, 'onClose'> {
  children?: ReactNode;
  text?: ReactNode;
  onOk?: () => void;
  onClose?: (event: SyntheticEvent) => void;
}

export default function DialogConfirm(props: DialogConfirmProps) {
  const { text, onOk, onClose, children, ...other } = props;

  const handleOk = () => {
    onClose && typeof onClose === 'function' && onClose({} as SyntheticEvent);
    onOk && typeof onOk === 'function' && onOk();
  };

  return (
    <Dialog {...other}>
      <DialogContent sx={{ pb: 2 }}>{children ? children : text}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} size="small">
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleOk} size="small">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogConfirm.defaultProps = {
  maxWidth: 'xs',
};
