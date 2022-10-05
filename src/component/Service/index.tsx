import React, { useEffect } from 'react';
import { useAsync } from 'react-use';
import { useRecoilState } from 'recoil';

import { PAGE_SIZE, PLATFORM } from '@/env';
import {
  imagesState,
  totalState,
  loadingState,
  tagsState,
  pageState,
  refreshToggleState,
  downloadItemsState,
  modeState,
} from '@/store';
import {
  getPost,
  listenProgress,
  ProgressAction,
  updateProgress,
} from '@/utils/action';

import type { DownloadItem } from '@/model/downloadItem';

export default React.memo(() => {
  const [, setImages] = useRecoilState(imagesState);
  const [, setTotal] = useRecoilState(totalState);
  const [, setLoading] = useRecoilState(loadingState);
  const [, setDownloadItems] = useRecoilState(downloadItemsState);
  const [tags] = useRecoilState(tagsState);
  const [page] = useRecoilState(pageState);
  const [refresh] = useRecoilState(refreshToggleState);
  const [mode] = useRecoilState(modeState);

  useAsync(async () => {
    setLoading(true);
    const data = await getPost({ page, tags, refresh, mode });
    setLoading(false);
    if (!data) return;
    setImages(data.images);
    setTotal(Math.ceil(data.count / PAGE_SIZE));
  }, [refresh, tags, page, mode]);

  useEffect(() => {
    // for tauri
    if (PLATFORM !== 'tauri') return;
    listenProgress((data: DownloadItem) => {
      setDownloadItems((prev) =>
        updateProgress(prev, ProgressAction.UPDATE, data)
      );
    });
  }, []);
  return null;
});
