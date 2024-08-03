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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebase";

export default function SignUpSide() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordAgain, setPasswordAgain] = React.useState("");
  const [error, setError] = React.useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== passwordAgain) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/signin");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
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
          {/* Company Logo */}
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
              <Box
                component="img"
                src="./myCraving.png"
                alt="logo of myCraving"
                width="200px"
                height="auto"
                sx={{ cursor: "pointer" }}
              />
            </Button>
          </Link>

          {/* Description */}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              marginTop: 3,
              fontWeight: "bold",
            }}
          >
            Sign up
          </Typography>
          <Typography component="h1" variant="h6">
            with Google or create an account.
          </Typography>
          {/* Signup via Google */}
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
          {/* Form for sign up */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="passwordAgain"
                  required
                  fullWidth
                  type="password"
                  id="passwordAgain"
                  label="Password Again"
                  autoFocus
                  onChange={(e) => setPasswordAgain(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
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
              // Disable submit button if fields are not filled
              disabled={
                !email ||
                !password ||
                !passwordAgain ||
                password !== passwordAgain
              }
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" passHref>
                  <Typography variant="body2" color="primary">
                    Already have an account? Sign in
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url("./pantryBg.png")`,
          backgroundColor: "gray",
          backgroundSize: "cover",
          backgroundPosition: "right",
        }}
      />
    </Grid>
  );
}
