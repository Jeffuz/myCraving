"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const isLoggedIn = false;

function Navbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen:any) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              maxHeight: 40,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <Link href="/" passHref>
                <Button
                  sx={{
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&:focus": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <img
                    src="./myCraving.png"
                    alt="logo of myCraving"
                    width="200px"
                    height="auto"
                    cursor="pointer"
                  />
                </Button>
              </Link>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {/* Your menu items can go here */}
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {!isLoggedIn ? (
                <>
                  <Link href="/signin" passHref>
                    <Button
                      color="primary"
                      variant="text"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        color: "#5074E7",
                        textDecoration: "none",
                        px: 2,
                        py: 1,
                        mr: 1,
                      }}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/signup" passHref>
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: "20px",
                        backgroundColor: "#5074E7",
                        "&:hover": {
                          backgroundColor: "rgba(64, 99, 201, 0.9)",
                        },
                        textDecoration: "none",
                        px: 2,
                        py: 1,
                      }}
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  color="primary"
                  sx={{
                    width: "100%",
                    borderRadius: "20px",
                    color: "#5074E7",
                    textDecoration: "none",
                    px: 2,
                  }}
                >
                  Sign Out
                </Button>
              )}
            </Box>

            {/* Mobile View Responsiveness */}
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "end",
                      flexGrow: 1,
                    }}
                  ></Box>
                  {!isLoggedIn ? (
                    <>
                      <MenuItem>
                        <Link href="/signup" passHref>
                          <Button
                            color="primary"
                            variant="contained"
                            sx={{
                              borderRadius: "20px",
                              backgroundColor: "#5074E7",
                              "&:hover": {
                                backgroundColor: "rgba(64, 99, 201, 0.9)",
                              },
                              width: "100%",
                              textDecoration: "none",
                            }}
                          >
                            Sign up
                          </Button>
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link href="/signin" passHref>
                          <Button
                            color="primary"
                            variant="outlined"
                            sx={{
                              width: "100%",
                              borderRadius: "20px",
                              color: "#5074E7",
                              textDecoration: "none",
                            }}
                          >
                            Sign in
                          </Button>
                        </Link>
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          borderRadius: "20px",
                          color: "#5074E7",
                          textDecoration: "none",
                        }}
                      >
                        Sign Out
                      </Button>
                    </MenuItem>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default Navbar;
