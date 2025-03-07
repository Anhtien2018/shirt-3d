"use client";

import { Box } from "@mui/material";
import "./globals.css";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Box>{children}</Box>
      </body>
    </html>
  );
}
