/**
 * ワインタイプごとのカラーパレット
 * 上品で落ち着いた色合いに調整
 *
 * - Red: 深いエンジ色（彩度・明度調整）
 * - White: 柔らかいゴールド（暖かみのある落ち着き色）
 * - Sparkling: 明るいティール（視認性と上品さの両立）
 */
const wineTypeColor = {
  Red: "#7b2d2f", // ワインレッド（少し紫寄り）
  White: "#d6c7a1", // 明るめベージュ（今より少し抜く）
  Sparkling: "#7fa7a3", // 少しグレー寄りのティール
};

/**
 * Chip用の薄い背景色バージョン
 * 白背景に映える淡い色
 */
export const wineTypeColorLight = {
  Red: "#f0e6e1", // 赤系の非常に淡い背景
  White: "#f3ede2", // ゴールド系の非常に淡い背景
  Sparkling: "#e8f4f2", // ティール系の非常に淡い背景
};

export default wineTypeColor;
