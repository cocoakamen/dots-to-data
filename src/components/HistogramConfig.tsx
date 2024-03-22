import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { checkHistogramConfig } from '../functions/checkHistogramConfig';

const HistogramConfig: React.FC = () => {
  
  const textFieldStyle = { 
    margin: 1, 
    width: '100px' 
  };
  
  const buttonStyle = { 
    width: 150, height: 150, margin: 1, 
    textAlign: 'center', fontSize: 16, 
    lineHeight: 1.3,
  };

  const modalSyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // 状態の初期化
  const [histogramConfig, setHistogramConfig] = useState({
    lowerLimit: 0,
    upperLimit: 100,
    decimalPlaces: 0,
    dataCount: 50,
    binCount: 10,
    histogramType: 'default'
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

  const handleDecimalPlacesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    histogramConfig.decimalPlaces = Number(event.target.value);
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

  // データチェックモーダルの開閉
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const handleCheckModalOpen = () => setCheckModalOpen(true);
  const handleCheckModalClose = () => setCheckModalOpen(false);



  // 形を選択したときのハンドラー
  const navigate = useNavigate();

  const handleTypeClick = () => {
    if (checkHistogramConfig( histogramConfig)) {
      navigate('/histogram/', { state: { histogramConfig } });
    } else {
      handleCheckModalOpen();
    }
  }

  const handleFujisanTypeClick = () => {
    histogramConfig.histogramType = 'fujisan'; 
    handleTypeClick();
  }

  const handleFlatTypeClick = () => {
    histogramConfig.histogramType = 'flat'; 
    handleTypeClick();
  }

  const handleLeftHighTypeClick = () => {
    histogramConfig.histogramType = 'leftHigh'; 
    handleTypeClick();
  }

  const handleRightHighTypeClick = () => {
    histogramConfig.histogramType = 'rightHigh'; 
    handleTypeClick();
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 , margin:0}}>
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
          label="小数点以下桁数"
          type='number'
          inputProps = {{
            min: 0 ,
            max: 1,
          }}
          helperText="0桁 or 1桁"
          defaultValue={histogramConfig.decimalPlaces}
          InputLabelProps={{
            shrink: true,
          }}
          sx={textFieldStyle} 
          onChange = {handleDecimalPlacesChange} // 適切なハンドラー関数を設定します
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
        <TextField 
          label="データ数"
          type='number'
          inputProps = {{
            min: 0 
          }}
          helperText="1以上の整数"
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

      <Modal
        open={checkModalOpen}
        onClose={handleCheckModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalSyle}>
          <Typography id="modal-modal-title" variant="h6" component="h6">
            Invalid histogram configuration.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please check the configuration again.
            <ul>
              <li>Lower limit must be less than upper limit.</li>
              <li>Digit count must be 0 or 1.</li>
              <li>Data count must be 0 or more.</li>
              <li>Bin count must be 1 or more.</li> 
            </ul>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

export default HistogramConfig;