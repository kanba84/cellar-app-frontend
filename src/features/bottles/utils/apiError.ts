/**
 * API エラーハンドリングユーティリティ
 */

/**
 * 棚位置が使用済みエラーかどうかを判定
 */
export function isPositionOccupiedError(err: unknown): boolean {
  return (
    (err as any)?.response?.status === 409 &&
    (err as any)?.response?.data?.error === 'POSITION_OCCUPIED'
  );
}
