import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { Fragment, useMemo, useState } from 'react';
import Moment from 'react-moment';
import { calcUnlockTime } from 'src/contracts/utils';
import { CalendarIcon } from 'src/icons';
import { isNumeric } from 'src/utils';
import { timeLockOptions } from '../../config';

export type OptionType = {
  /**
   * Duration time in seconds
   */
  key: string | number;
  value: string | number;
};

interface TimeLockInputProps extends Omit<SelectProps<OptionType['key']>, 'onChange'> {
  options: OptionType[];
  textFieldProps?: Omit<TextFieldProps, 'onChange' | 'InputProps'>;
  valueDisplay?: (_value: string, _format: string) => string;
  onChange: (_value: OptionType['key'], _isValid: boolean) => void;
  disableTimeRange: boolean;
  format: string;
  timeRangeFormat: string;
  minTime?: number; // in seconds
}

interface TimeRangeProps {
  duration?: OptionType['key'];
  format: string;
}

const TimeRange: React.FC<TimeRangeProps> = ({ duration, format }: TimeRangeProps) => {
  if (!isNumeric(duration)) {
    console.error('Invalid `duration` property pass to TimeRange component, expect a number.');
    return null;
  }

  const unlockTime = useMemo<number>(() => {
    let _duration = Number(duration);
    if (_duration === timeLockOptions[0].key) {
      _duration += _duration;
    }
    return calcUnlockTime(Math.floor(new Date().getTime() / 1000), _duration) * 1000;
  }, [duration]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 1.5,
      }}
    >
      <Box
        sx={{
          px: { xs: 1.5, xsm: 3 },
          py: 1,
          bgcolor: 'background.default',
          borderRadius: 2.5,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'secondary.dark',
        }}
      >
        <Typography>
          <Moment format={format} />
        </Typography>
      </Box>
      <ArrowForwardIcon />
      <Box
        sx={{
          px: { xs: 1.5, xsm: 3 },
          py: 1,
          bgcolor: 'background.default',
          borderRadius: 2.5,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'secondary.dark',
        }}
      >
        <Typography>
          <Moment format={format}>{unlockTime}</Moment>
        </Typography>
      </Box>
    </Box>
  );
};

export default function TimeLockInput(props: TimeLockInputProps) {
  const {
    value,
    valueDisplay,
    textFieldProps,
    options,
    onChange,
    disableTimeRange,
    format,
    timeRangeFormat,
    minTime,
    ...other
  } = props;

  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string | undefined>();

  const formatValue = (val: unknown): unknown => {
    if (val === undefined) val = '';
    if (valueDisplay !== undefined && typeof valueDisplay === 'function') {
      return valueDisplay(val as string, format);
    }
    return moment()
      .add(val as string, 's')
      .format(format);
  };

  const handleSelect = (ev: SelectChangeEvent<OptionType['key']>) => {
    if (onChange && typeof onChange === 'function') {
      onChange(ev.target.value, validateTime(calcUnlockTime(new Date().getTime() / 1000, Number(ev.target.value))));
    }
  };

  const validateTime = (val: number): boolean => {
    if (typeof minTime === 'number') {
      if (isNaN(val)) {
        setHelperText('Invalid time');
        return false;
      } else if (val < minTime) {
        setHelperText(`Time to unlock must be after ${moment(minTime * 1000).format('MM/DD/YYYY')}`);
        return false;
      }
    }
    setHelperText(undefined);
    return true;
  };

  return (
    <Fragment>
      <TextField
        variant="outlined"
        margin="dense"
        fullWidth
        type="text"
        {...textFieldProps}
        value={formatValue(value)}
        onClick={() => setIsOpenSelect(!isOpenSelect)}
        helperText={helperText}
        error={helperText !== undefined}
        InputProps={{
          sx: {
            bgcolor: 'background.default',
            width: 'auto',
          },
          startAdornment: (
            <InputAdornment position="start">
              <CalendarIcon color="secondary" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{ justifyContent: 'flex-end' }}>
              <Select
                open={isOpenSelect}
                variant="standard"
                disableUnderline
                {...other}
                value={value}
                onChange={handleSelect}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  '& .MuiSelect-select': {
                    color: 'secondary.main',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& .MuiInput-input:focus': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option.key} value={option.key}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </InputAdornment>
          ),
        }}
      />
      {!disableTimeRange && <TimeRange duration={value} format={timeRangeFormat} />}
    </Fragment>
  );
}

TimeLockInput.defaultProps = {
  disableTimeRange: true,
  format: 'MM/DD/YYYY hh:mm A',
  timeRangeFormat: 'MM/DD/YYYY',
};
