import { atom } from 'recoil';

import type { ImageDetail } from '@/model/image';
import type { DownloadItem } from '@/model/downloadItem';

export const pageState = atom({
  key: 'pageState',
  default: 1,
});

export const securityState = atom({
  key: 'securityState',
  default: true,
});

export const loadingState = atom({
  key: 'loadingState',
  default: true,
});

export const tagsState = atom({
  key: 'tagsState',
  default: '',
});

export const refreshToggleState = atom({
  key: 'refreshToggleState',
  default: false,
});

export const imagesState = atom<ImageDetail[]>({
  key: 'imagesState',
  default: [],
});

export const totalState = atom({
  key: 'totalState',
  default: 0,
});

export const colorSetState = atom({
  key: 'colorSetState',
  default: {
    mute: '',
    vibrant: '',
  },
});

// for tauri
export const downloadItemsState = atom<DownloadItem[]>({
  key: 'downloadItemsState',
  default: [],
});

// for tauri
export const modeState = atom<'json' | 'xml'>({
  key: 'modeState',
  default: 'json',
});
