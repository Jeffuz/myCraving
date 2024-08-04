"use client";
import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Hero() {
  return (
    <Box id="hero" sx={{ minHeight: "100vh" }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Save your&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: "#5074E7",
                fontWeight: "bold",
              }}
            >
              ingredients
            </Typography>
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: "1.25rem" }}
          >
            Explore our pantry management app to track and update your
            ingredients, featuring data analytics and AI-driven recipe
            generation.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 4, width: "100%", justifyContent: "center" }}
          >
            <Link href="/dashboard" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#5074E7",
                  "&:hover": {
                    backgroundColor: "rgba(64, 99, 201, 0.9)",
                  },
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
              >
                Start now
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
