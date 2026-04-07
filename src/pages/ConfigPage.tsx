
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const resourceLinks = [
  { name: "生産国/地域一覧", path: "/config/countries" },
  { name: "ワインタイプ一覧", path: "/config/wine_types" },
  { name: "アペラシオン一覧", path: "/config/appellations" },
  { name: "原産地統制呼称タイプ一覧", path: "/config/designation_types" },
];

const ConfigPage = () => {
  const navigate = useNavigate();

  return (
    <Box maxWidth="sm" mx="auto" p={4}>
      <Typography variant="h4" gutterBottom>
        設定ページ
      </Typography>
      <Stack spacing={2}>
        {resourceLinks.map((link) => (
          <Card key={link.path} variant="outlined">
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">{link.name}</Typography>
              <Button variant="contained" onClick={() => navigate(link.path)}>
                開く
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ConfigPage;
