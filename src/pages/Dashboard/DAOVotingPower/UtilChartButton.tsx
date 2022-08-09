import { Box } from '@mui/material';

interface UtilChartButtonProps {
  onClick: (index: number) => void;
  options: Array<string>;
  butOption: number;
}
const UtilChartButton = (props: UtilChartButtonProps) => {
  const { onClick, options, butOption } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.defalt',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          my: 3,
        }}
      >
        {options.map((element, index) => {
          return (
            <Box
              key={index}
              onClick={() => {
                if (onClick) onClick(index);
              }}
              sx={{
                padding: '0.5rem',
                color: index === butOption ? 'white' : 'text.secondary',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                minWidth: '60px',
                textAlign: 'center',
                backgroundColor: index === butOption ? 'primary.main' : 'background.default',
                borderTopLeftRadius: index === 0 || index === butOption ? '6px' : 0,
                borderBottomLeftRadius: index === 0 || index === butOption ? '6px' : 0,
                borderTopRightRadius: index === options.length - 1 || index === butOption ? '6px' : 0,
                borderBottomRightRadius: index === options.length - 1 || index === butOption ? '6px' : 0,
              }}
            >
              {element}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default UtilChartButton;
