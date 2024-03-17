import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const HistogramConfig: React.FC = () => {
  
  const textFieldStyle = { 
    margin: 1, 
    width: '100px' 
  };
  
  const buttonStyle = { 
    width: 200, height: 200, margin: 1, 
    textAlign: 'center', fontSize: 16, 
    lineHeight: 1.3,
  };

  // 状態の初期化
  const [histogramConfig, setHistogramConfig] = useState({
    lowerLimit: 0,
    upperLimit: 100,
    dataCount: 50,
    binCount: 10,
    type: 'default'
  });

  // TextFieldのonChangeハンドラー
  const handleLowerLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    histogramConfig.lowerLimit = Number(event.target.value);
    setHistogramConfig(histogramConfig);
    console.log(JSON.stringify(histogramConfig));
  };

  const handleUpperLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    histogramConfig.upperLimit = Number(event.target.value);
    setHistogramConfig(histogramConfig);
    console.log(JSON.stringify(histogramConfig));
  };

  const handleDataCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    histogramConfig.dataCount = Number(event.target.value);
    setHistogramConfig(histogramConfig);
    console.log(JSON.stringify(histogramConfig));
  };

  const handleBinCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    histogramConfig.binCount = Number(event.target.value);
    setHistogramConfig(histogramConfig);
    console.log(JSON.stringify(histogramConfig));
  };

  // 形を選択したときのハンドラー
  const navigate = useNavigate();
  const handleFujisanTypeClick = () => {
    histogramConfig.type = 'fujisan'; 
    navigate('/histogram/', { state: { histogramConfig } });
  }

  const handleFlatTypeClick = () => {
    histogramConfig.type = 'flat'; 
    navigate('/histogram/', { state: { histogramConfig } });
  }

  const handleLeftHighTypeClick = () => {
    histogramConfig.type = 'leftHigh'; 
    navigate('/histogram/', { state: { histogramConfig } });
  }

  const handleRightHighTypeClick = () => {
    histogramConfig.type = 'rightHigh'; 
    navigate('/histogram/', { state: { histogramConfig } });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
      <TextField 
          label="最小値"
          type='number'
          defaultValue={histogramConfig.lowerLimit}
          InputLabelProps={{
            shrink: true,
          }}
          sx={textFieldStyle} 
          onChange = {handleLowerLimitChange}
        />
        <TextField 
          label="最大値"
          type='number'
          defaultValue={histogramConfig.upperLimit}
          InputLabelProps={{
            shrink: true,
          }}
          sx={textFieldStyle} 
          onChange = {handleUpperLimitChange}
        />
        <TextField 
          label="データ数"
          type='number'
          defaultValue={histogramConfig.dataCount}
          InputLabelProps={{
            shrink: true,
          }}
          sx={textFieldStyle} 
          onChange = {handleDataCountChange}
        />
        <TextField 
          label="階層数"
          type='number'
          defaultValue={histogramConfig.binCount}
          InputLabelProps={{
            shrink: true,
          }}
          sx={textFieldStyle} 
          onChange = {handleBinCountChange}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button variant="contained" sx={buttonStyle} onClick={handleFujisanTypeClick}> 
            ⚪︎⚪︎⚪︎⚫︎⚪︎⚪︎⚪︎<br/>
            ⚪︎⚪︎⚫︎⚫︎⚫︎⚪︎⚪︎<br/>
            ⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
        </Button>
        <Button variant="contained" sx={buttonStyle} onClick={handleFlatTypeClick}> 
            ⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎<br/>
            ⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button variant="contained" sx={buttonStyle} onClick={handleLeftHighTypeClick}> 
            ⚪︎⚫︎⚪︎⚪︎⚪︎⚪︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚪︎⚪︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚪︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
        </Button>
        <Button variant="contained" sx={buttonStyle} onClick={handleRightHighTypeClick}> 
            ⚪︎⚪︎⚪︎⚪︎⚪︎⚫︎⚪︎<br/>
            ⚪︎⚪︎⚪︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚪︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎<br/>
            ⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎⚫︎
        </Button>
      </Box>
    </Box>
  );
}

export default HistogramConfig;