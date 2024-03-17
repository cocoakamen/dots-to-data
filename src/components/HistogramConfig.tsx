import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const HistogramConfig: React.FC = () => {
  const buttonStyle = { 
    width: 200, height: 200, margin: 1, 
    textAlign: 'center', fontSize: 16, 
    lineHeight: 1.3,
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button variant="contained" sx={buttonStyle}> 
          <Link to="/histogram/">
            ⚪︎⚪︎⚪︎⚫︎⚪︎⚪︎⚪︎<br/>
            ⚪︎⚪︎⚫︎⚫︎⚫︎⚪︎⚪︎<br/>
            ⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
          </Link>
        </Button>
        <Button variant="contained" sx={buttonStyle}> 
          <Link to="/histogram/">
            ⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎<br/>
            ⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
          </Link>
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button variant="contained" sx={buttonStyle}> 
          <Link to="/histogram/">
            ⚫︎⚫︎⚪︎⚪︎⚪︎⚪︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
          </Link>
        </Button>
        <Button variant="contained" sx={buttonStyle}> 
          <Link to="/histogram/">
            ⚪︎⚪︎⚪︎⚪︎⚪︎⚫︎⚫︎<br/>
            ⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
          </Link>
        </Button>
      </Box>
    </Box>
  );
}

export default HistogramConfig;