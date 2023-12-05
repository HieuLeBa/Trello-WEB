import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useColorScheme } from '@mui/material/styles'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutLinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { Box } from '@mui/material'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = ( event ) => {
    const selectMode = event.target.value
    setMode( selectMode )
  }

  return (
    <FormControl size="small" sx={ { minWidth: 120 } }>
      <InputLabel
        id="label-select-dark-light-mode"
        sx={ {
          color: 'white',
          '&.Mui-focused': 'white'
        } }
      >
        Mode
      </InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={ mode }
        label="Mode"
        onChange={ handleChange }
        sx={ {
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white'
          },
          '.MuiSvgIcon-root': {
            color: 'white'
          }
        } }
      >
        <MenuItem value="light">
          <div style={ { display: 'flex', alignItems: 'center', gap: '8px' } }>
            <LightModeIcon fontSize='small' />
            Light
          </div>

        </MenuItem>
        <MenuItem value="dark">
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
            <DarkModeOutLinedIcon fontSize='small' />
            dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
            <SettingsBrightnessIcon fontSize='small' />
            system
          </Box>
        </MenuItem>
      </Select>
    </FormControl >
  )
}

export default ModeSelect