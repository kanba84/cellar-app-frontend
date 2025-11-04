let config = null;

export async function loadConfig() {
  if (!config) {
    try {
      // 本番環境ではビルド時に配置されたconfig.jsonを使用
      const res = await fetch('/config.json');
      if (!res.ok) {
        throw new Error('Failed to load config.json');
      }
      config = await res.json();
    } catch (error) {
      console.error('Failed to load config:', error);
      // デフォルトの設定をフォールバックとして使用
      config = {
        REACT_APP_API_BASE_URL: 'https://cellar-app.local',
      };
    }
  }
  return config;
}
