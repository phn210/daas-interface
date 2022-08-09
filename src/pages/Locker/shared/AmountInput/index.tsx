import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BigNumberish } from 'src/global';
import useTokenLockOptions from 'src/hooks/useTokenLockOptions';
import { BN, isNumeric } from 'src/utils';
import { formatNumber } from 'src/utils/format';

export type InputToken = string;

type AmountInputProps = Omit<TextFieldProps, 'onChange'> & {
  max?: number | string;
  min?: number | string;
  onAmountChange: (_amount: string, _isValid: boolean) => void;
  token: InputToken;
  fixedToken?: boolean;
  onTokenChange?: (_token: InputToken) => void;
  enableMaxAmount?: boolean;
};

export default function AmountInput(props: AmountInputProps) {
  const {
    max,
    min = 0,
    value,
    onAmountChange,
    token,
    fixedToken,
    onTokenChange,
    inputProps,
    InputProps,
    enableMaxAmount,
    ...other
  } = props;
  const tokenLockOptions = useTokenLockOptions();
  const [amountHelperText, setAmountHelperText] = useState<string | undefined>();

  useEffect(() => {
    onAmountChange(value as string, validateAmount(value as string));
  }, []);

  const handleAmountChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    const isValid = validateAmount(val);
    onAmountChange && typeof onAmountChange === 'function' && onAmountChange(val, isValid);
  };

  const handleMaxAmount = () => {
    onAmountChange && typeof onAmountChange === 'function' && onAmountChange(max as string, true);
  };

  const validateAmount = (amount: string): boolean => {
    if (!isNumeric(amount)) {
      setAmountHelperText('Invalid value');
      return false;
    }
    const _amountBN = BN(amount);
    if (_amountBN.lt(min)) {
      setAmountHelperText(`Amount exceeds minimum of ${formatNumber(min)}`);
      return false;
    } else if (isNumeric(max) && _amountBN.gt(max as BigNumberish)) {
      setAmountHelperText(`Amount exceeds maximum of ${formatNumber(max)}`);
      return false;
    }
    setAmountHelperText(undefined);
    return true;
  };

  const handleTokenChange = (ev: SelectChangeEvent<InputToken>) => {
    onTokenChange && typeof onTokenChange === 'function' && onTokenChange(ev.target.value as InputToken);
  };

  useEffect(() => {
    onAmountChange(value as string, validateAmount(value as string));
  }, [min, max]);

  return (
    <TextField
      variant="outlined"
      margin="dense"
      fullWidth
      placeholder="Enter amount"
      type="number"
      {...other}
      error={amountHelperText !== undefined}
      helperText={amountHelperText}
      onChange={handleAmountChange}
      value={value}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {enableMaxAmount && isNumeric(max) && (
              <Button variant="text" color="primary" size="small" onClick={handleMaxAmount} sx={{ minWidth: 50 }}>
                Max
              </Button>
            )}
            {fixedToken && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img width={30} src={tokenLockOptions[token]?.img} alt={`${tokenLockOptions[token]?.symbol} icon`} />
                <Box ml={1}>
                  <Typography variant="button" color="secondary.main">
                    {tokenLockOptions[token]?.symbol}
                  </Typography>
                  {/* <Typography variant="body3" color="secondary.main">
                    {tokenLockOptions[token]?.name}
                  </Typography> */}
                </Box>
              </Box>
            )}
            {!fixedToken && (
              <Select
                variant="standard"
                value={token}
                onChange={handleTokenChange}
                disableUnderline
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
                {Object.entries(tokenLockOptions).map(([address, option]) => (
                  <MenuItem key={address} value={address} sx={{ display: 'flex', alignItems: 'center' }}>
                    <img width={30} src={option.img} alt={`${option.symbol} icon`} />
                    <Box ml={1}>
                      <Typography variant="button">{option.symbol}</Typography>
                      {/* <Typography variant="body3">{option.name}</Typography> */}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            )}
          </InputAdornment>
        ),
        sx: {
          bgcolor: 'background.default',
        },
        ...InputProps,
      }}
      inputProps={{
        max: max,
        min: min,
        ...inputProps,
      }}
    />
  );
}
