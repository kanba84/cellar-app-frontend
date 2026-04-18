import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import BottleListPage from "./features/bottles/pages/BottleListPage";
import WineListPage from "./pages/WineListPage";
import WineDetailPage from "./pages/WineDetailPage";
import CountryListPage from "./pages/CountryListPage";
import RegionListPage from "./pages/RegionListPage";
import ConfigPage from "./pages/ConfigPage";
import DashboardPage from "./pages/DashboardPage";

// Material UIのインポート
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AppellationListPage from "./pages/AppellationListPage";
import DesignationTypeListPage from "./pages/DesignationTypeListPage";
import WineTypeListPage from "./pages/WineTypeListPage";

const menuItems = [
  { label: "ボトル一覧", path: "/" },
  { label: "ワイン一覧", path: "/wines" },
  { label: "ダッシュボード", path: "/dashboard" },
  { label: "設定", path: "/config" },
];

function App() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Cellar App
          </Typography>
          
          {/* PC用ナビゲーションボタン */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* スマートフォン用ハンバーガーメニュー */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<BottleListPage />} />
          <Route path="/wines" element={<WineListPage />} />
          <Route path="/wines/:id" element={<WineDetailPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/config/countries" element={<CountryListPage />} />
          <Route
            path="/config/countries/:countryId/regions"
            element={<RegionListPage />}
          />
          <Route
            path="/config/countries/:countryId/regions/:regionId"
            element={<RegionListPage />}
          />
          <Route
            path="/config/appellations"
            element={<AppellationListPage />}
          />
          <Route
            path="/config/designation_types"
            element={<DesignationTypeListPage />}
          />
          <Route path="/config/wine_types" element={<WineTypeListPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
