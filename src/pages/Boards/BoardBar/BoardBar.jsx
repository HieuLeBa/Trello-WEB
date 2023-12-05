import { Box, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'


const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar( { board } ) {
  return (
    <Box px={ 2 } sx={ {
      width: '100%',
      height: ( theme ) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: ( theme ) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' )
    } }>
      <Box sx={ {
        display: 'flex',
        alignItems: 'center',
        gap: 2
      } }>
        <Chip
          sx={ MENU_STYLES }
          icon={ <DashboardIcon /> }
          label={ board?.title }
          clickable
        />

        <Chip
          sx={ MENU_STYLES }
          icon={ <VpnLockIcon /> }
          label={ capitalizeFirstLetter( board?.type ) }
          clickable
        />

        <Chip
          sx={ MENU_STYLES }
          icon={ <AddToDriveIcon /> }
          label="Add to Google drive"
          clickable
        />

        <Chip
          sx={ MENU_STYLES }
          icon={ <BoltIcon /> }
          label="Automation"
          clickable
        />

        <Chip
          sx={ MENU_STYLES }
          icon={ <FilterListIcon /> }
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={ {
        display: 'flex',
        alignItems: 'center',
        gap: 2
      } }>
        <Button
          variant='outlined'
          startIcon={ <PersonAddIcon /> }
          sx={ {
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          } }
        >
          Invite
        </Button>
        <AvatarGroup
          max={ 3 }
          sx={ {
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          } }
        >
          <Tooltip title="HieuLb">
            <Avatar
              alt="HieuLB"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/370446247_2069990290009001_203791107349669041_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=109&ccb=1-7&_nc_sid=5740b7&_nc_ohc=SAHeuJnjwI4AX9rgEuD&_nc_ht=scontent.fhan5-9.fna&oh=00_AfCFeRy8eba5FNrygDuXLfYNj4pygphJKzj4QdlLEQKbLg&oe=656FCDEE'
            />
          </Tooltip>
          <Tooltip title="HieuLb">
            <Avatar
              alt="HieuLB"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/370446247_2069990290009001_203791107349669041_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=109&ccb=1-7&_nc_sid=5740b7&_nc_ohc=SAHeuJnjwI4AX9rgEuD&_nc_ht=scontent.fhan5-9.fna&oh=00_AfCFeRy8eba5FNrygDuXLfYNj4pygphJKzj4QdlLEQKbLg&oe=656FCDEE'
            />
          </Tooltip>
          <Tooltip title="HieuLb">
            <Avatar
              alt="HieuLB"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/370446247_2069990290009001_203791107349669041_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=109&ccb=1-7&_nc_sid=5740b7&_nc_ohc=SAHeuJnjwI4AX9rgEuD&_nc_ht=scontent.fhan5-9.fna&oh=00_AfCFeRy8eba5FNrygDuXLfYNj4pygphJKzj4QdlLEQKbLg&oe=656FCDEE'
            />
          </Tooltip>
          <Tooltip title="HieuLb">
            <Avatar
              alt="HieuLB"
              src='https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/370446247_2069990290009001_203791107349669041_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=109&ccb=1-7&_nc_sid=5740b7&_nc_ohc=SAHeuJnjwI4AX9rgEuD&_nc_ht=scontent.fhan5-9.fna&oh=00_AfCFeRy8eba5FNrygDuXLfYNj4pygphJKzj4QdlLEQKbLg&oe=656FCDEE'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box >
  )
}

export default BoardBar