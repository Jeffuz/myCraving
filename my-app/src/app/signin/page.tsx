"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

export default function SignInSide() {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Redirect to dashboard if signin valid
  const handleSignIn = async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url("./pantryBg.png")`,
          backgroundColor: "gray",
          backgroundSize: "cover",
          backgroundPosition: "left",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
          <Typography
            component="h1"
            variant="h4"
            sx={{
              marginTop: 3,
              fontWeight: "bold",
            }}
          >
            Sign in
          </Typography>
          <Typography component="h1" variant="h6">
            with Google or Email and Password.
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1,
              backgroundColor: "#5074E7",
              "&:hover": {
                backgroundColor: "rgba(64, 99, 201, 0.9)",
              },
            }}
          >
            <GoogleIcon />
            <Box sx={{ ml: 1 }}>Continue with Google</Box>
          </Button>
          <Divider sx={{ width: "100%" }} />
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            width={"100%"}
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1,
                color: "#5074E7",
                border: 1.5,
                backgroundColor: "white",
                "&:hover": {
                  color: "white",
                  borderColor: "#5074E7",
                  backgroundColor: "#5074E7",
                },
              }}
              disabled={!email || !password}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
