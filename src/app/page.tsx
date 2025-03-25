import HomeContent from "@/components/home/HomeContent";
import { Box } from "@mui/material";
import { Metadata } from "next";
import React from "react";

export const metadata = { title: `Landing Page` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box>
      <HomeContent />
    </Box>
  );
}
