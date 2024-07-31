"use client";
import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Hero() {
  return (
    <Box id="hero">
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "left",
              textAlign: "center",
              fontSize: "clamp(3.5rem, 10vw, 4rem)",
            }}
          >
            Save your&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: "clamp(3rem, 10vw, 4rem)",
                color: "#5074E7",
              }}
            >
              ingredients
            </Typography>
          </Typography>
          <Typography
            textAlign="left"
            color="text.secondary"
            sx={{ alignSelf: "left", width: { sm: "100%", md: "80%" } }}
          >
            Explore our pantry management app to track and update your
            ingredients, featuring data analytics and AI-driven recipe
            generation.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignSelf="left"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
          >
            <Link href="/dashboard" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#5074E7",
                  "&:hover": {
                    backgroundColor: "rgba(64, 99, 201, 0.9)",
                  },
                  textDecoration: "none",
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
