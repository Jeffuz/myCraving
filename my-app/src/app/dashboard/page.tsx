"use client";

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import KitchenIcon from "@mui/icons-material/Kitchen";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LogoutIcon from "@mui/icons-material/Logout";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import Pantry from "@/components/Pantry";
import Recipe from "@/components/Recipe";
import Analytics from "@/components/Analytics";

const drawerWidth = 240;

export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Page select from navbar
  const [page, setPage] = useState("Pantry");

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // Determine Page selected from Navbar
  const selectPage = (currentPage:string) => {
    setPage(currentPage);
    // Close drawer after selecting page
    handleDrawerClose();
  };

  // Signout Button
  const handleSignOut = () => {
    // Sign out logic
    // Jump back to / route (home page)
  };

  const drawer = (
    <div>
      {/* Navbar */}
      <Toolbar />
      <Divider />
      {/* Nav pages under navbar */}
      <List>
        {["Pantry", "Recipe", "Analytics"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={()=> selectPage(text)}>
              <ListItemIcon>
                {index === 0 && <KitchenIcon />}
                {index === 1 && <RestaurantIcon />}
                {index === 2 && <AutoGraphIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Logout under navbar */}
      <List>
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Sign Out"} />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {/* Toolbar to display hamburger for responsiveness + Logo*/}
        <Toolbar sx={{ backgroundColor: "#5074E7" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <img
            src="./myCravingWhite.png"
            alt="logo of myCravingWhite"
            width="200px"
            height="auto"
            // cursor="pointer"
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Used as margin to avoid appbar */}
        <Toolbar/>
        {/* Conditional run pantry pages*/}
        {page === "Pantry" && <Pantry />}
        {page === "Recipe" && <Recipe />}
        {page === "Analytics" && <Analytics />}
      </Box>
    </Box>
  );
}
