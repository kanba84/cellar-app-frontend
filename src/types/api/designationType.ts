/**
 * DesignationType API の型定義
 */

/**
 * DesignationType レスポンス型
 */
export interface DesignationType {
  id: number;
  name: string;
  code: string;
  rank: number;
  country_id: number;
}

/**
 * DesignationType リクエスト型（新規作成）
 */
export interface CreateDesignationTypeRequest {
  name: string;
  code: string;
  rank: number;
  country_id: number;
}

/**
 * DesignationType 更新リクエスト型
 */
export interface UpdateDesignationTypeRequest {
  name?: string;
  code?: string;
  rank?: number;
  country_id?: number;
}
