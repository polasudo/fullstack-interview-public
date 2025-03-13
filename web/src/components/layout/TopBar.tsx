import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";

import { useMediaQuery, useTheme } from "@mui/material";

interface TopBarProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

export const TopBar = ({ drawerWidth, handleDrawerToggle }: TopBarProps) => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  return !isMd ? (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "block", md: "none" },
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        background: theme.palette.background.sidebar,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Image src="logo.svg" alt="Alveno" width="150" height="37" />
        <IconButton
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{
            display: { md: "none" },
            color: theme.palette.grey[100],
          }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  ) : null;
};
