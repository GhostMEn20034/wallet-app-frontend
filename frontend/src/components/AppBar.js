import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from "react-router-dom";
import WalletIcon from '@mui/icons-material/Wallet';

const pages = ['Dashboard', 'Accounts', 'Records', 'Profile'];
const links = ['/dashboard', '/accounts', '/records', '/profile'];

function DenseAppBar({location}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleClickOnItem = (destination) => {
    navigate(destination);
  };



  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#5E35B1' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <WalletIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: "35px" }} fontSize='large' />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '0',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Wallet app
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleClickOnItem}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleClickOnItem}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: "21%" }}>
            {pages.map((page, index) => (
              <Button
                key={page}
                onClick={() => handleClickOnItem(links[index])}
                sx={{mx: 1 ,my: 2, color: 'white', display: 'block', backgroundColor: location === page ? "#7b46e8" : "transparent"  ,":hover": {backgroundColor: "#7b46e8"} }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default DenseAppBar;