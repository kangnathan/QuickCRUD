import React, { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton, MenuItem, Menu } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/UserContext';
import styles from '@/app/styles/menubar';

export default function MenuBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { userData } = useUserContext();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);


  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch {
      console.error("Logout request failed");
    }
  };

  return (
    <Box sx={styles.toolbar}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={styles.title}>
          Quick<span style={{ color: '#BB86FC' }}>CRUD</span>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
          {userData?.name && (
            <Typography variant="h5" sx={styles.userName}>
              {userData.name}
            </Typography>
          )}
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={styles.iconButton}
            >
              <AccountCircle sx={{ fontSize: '2rem' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleLogout} sx={styles.menuItem}>
                Log Out
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </Toolbar>
    </Box>
  );
}
