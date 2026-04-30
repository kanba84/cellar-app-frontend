import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#962D3E", // 少し彩度を上げたボルドー（視認性向上）
    },
    secondary: {
      main: "#D4AF37", // メタリック感のあるゴールド
    },
    background: {
      default: "#1A1616", // わずかに温かみのある黒
      paper: "#252121",   // 背景と馴染むカード色
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#BDBDBD",
    },
  },

  shape: {
    borderRadius: 16, // 少し丸みを強めてモダンな印象に
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#252121",
          backgroundImage: "none",
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.08)", // 繊細な境界線
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)", // 深みのある影
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // 丸いボタンでモダンさを強調
          padding: "8px 20px",
        },
      },
    },
    // ボトル一覧の「白いカード」部分への対策
    MuiPaper: {
      styleOverrides: {
        root: {
          // 白系カードを使う場合でも、背景に馴染むアイボリー系を指定
          "&.bottle-card-light": {
            backgroundColor: "#FDFCF0", 
            color: "#1A1616",
          }
        }
      }
    }
  },
});

export default theme;