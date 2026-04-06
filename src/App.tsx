import { Routes, Route, Link } from "react-router-dom";
import BottleListPage from "./features/bottles/pages/BottleListPage";
import WineListPage from "./pages/WineListPage";
import WineDetailPage from "./pages/WineDetailPage";
import CountryListPage from "./pages/CountryListPage";
import RegionListPage from "./pages/RegionListPage";
import ConfigPage from "./pages/ConfigPage";

// Material UIのインポート
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AppellationListPage from "./pages/AppellationListPage";
import DesignationTypeListPage from "./pages/DesignationTypeListPage";
import WineTypeListPage from "./pages/WineTypeListPage";

function App() {
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
          <Button color="inherit" component={Link} to="/">
            ボトル一覧
          </Button>
          <Button color="inherit" component={Link} to="/wines">
            ワイン一覧
          </Button>
          <Button color="inherit" component={Link} to="/config">
            設定
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
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
