export type AssetPackId = 'classic' | 'hd';

const STORAGE_KEY = 'abyss_asset_pack';

export function getSelectedAssetPackId(): AssetPackId {
  if (typeof window === 'undefined') return 'hd';
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === 'classic' || value === 'hd') return value;
  return 'hd';
}

export function setSelectedAssetPackId(id: AssetPackId) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, id);
}
