import React from 'react';
import { Home, Calendar, Clock, Filter, List, LogOut, Upload } from 'lucide-react';
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Box, Divider } from '@mui/material';
import { styled } from '@mui/system';
import { Step, StepProgress, User } from '../types';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(to right, #3b82f6, #9333ea)',
});

const StyledButton = styled(Button)({
  color: '#fff',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
});

const UploadButton = styled(Button)({
  color: '#fff',
  backgroundColor: '#2196f3', // Different blue color
  '&:hover': {
    backgroundColor: '#1976d2',
  },
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

interface NavbarProps {
  currentStep: string;
  onNavigate: (step: Step) => void;
  stepProgress: StepProgress;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentStep, 
  onNavigate, 
  stepProgress,
  user,
  onLogout 
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Course Planner
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <UploadButton onClick={() => onNavigate('syllabusUpload')} sx={{ mr: 2 }}>
            <Upload size={20} />
            Syllabus Upload
          </UploadButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#fff' }} />
          <StyledButton onClick={() => onNavigate('home')}>
            <Home size={20} />
            Home
          </StyledButton>
          <StyledButton onClick={() => onNavigate('dateRange')} disabled={!stepProgress.dateRange}>
            <Calendar size={20} />
            Date Range
          </StyledButton>
          <StyledButton onClick={() => onNavigate('weekdays')} disabled={!stepProgress.weekdays}>
            <Clock size={20} />
            Weekdays
          </StyledButton>
          <StyledButton onClick={() => onNavigate('filter')} disabled={!stepProgress.filter}>
            <Filter size={20} />
            Filter
          </StyledButton>
          <StyledButton onClick={() => onNavigate('summary')} disabled={!stepProgress.summary}>
            <List size={20} />
            Summary
          </StyledButton>
        </Box>
        {user && (
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <LogOut size={20} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};