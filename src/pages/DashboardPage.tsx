import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchStats } from "../api/statsApi";
import type { StatsData } from "@/types/api/stats";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// 色定義
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#82d982",
  "#ffa07a",
  "#20b2aa",
  "#daa520",
];

function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setError("統計情報の取得に失敗しました");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="warning">統計情報が取得できません</Alert>;
  }

  // ヴィンテージデータを最小値から最大値まで埋める
  const getCompleteVintageData = () => {
    if (!stats.vintages || stats.vintages.length === 0) {
      return [];
    }

    const vintages = stats.vintages.map(v => v.vintage);
    const minVintage = Math.min(...vintages);
    const maxVintage = Math.max(...vintages);

    // 最小値から最大値までのMapを作成
    const vintageMap = new Map(stats.vintages.map(v => [v.vintage, v.count]));

    // 完全なデータを生成
    const completeData: Array<{ vintage: number; count: number }> = [];
    for (let year = minVintage; year <= maxVintage; year++) {
      completeData.push({
        vintage: year,
        count: vintageMap.get(year) ?? 0,
      });
    }

    return completeData;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        ダッシュボード
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {/* ワイン種別ごとの構成比 */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ワイン種別の構成比
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.wineTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.wineTypes.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* 生産国の構成比 */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            生産国の構成比
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.countries}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#82ca9d"
                dataKey="count"
              >
                {stats.countries.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* ボトル数の推移 */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ボトル数の推移
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={stats.inventoryTrend}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                name="ボトル数"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* ヴィンテージ別の統計 */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            ヴィンテージ別のボトル数
          </Typography>
          {stats.vintages && stats.vintages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={getCompleteVintageData()}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vintage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="ボトル数" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="textSecondary">
              ヴィンテージデータがありません
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardPage;
