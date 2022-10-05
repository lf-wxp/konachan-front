// for tauri
import { toast, type ToastOptions } from 'react-toastify';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import axios, { AxiosResponse } from 'axios';

import { PLATFORM } from '@/env';

import type { ImageDetail } from '@/model/image';
import type { DownloadItem } from '@/model/downloadItem';
import type { TFunc1Void } from '@/utils/type';

export enum Action {
  GET_POST = 'get_post',
  DOWNLOAD_ITEM = 'download_image',
  CLOSE_SPLASHSCREEN = 'close_splashscreen',
}

enum Event {
  PROGRESS = 'progress',
}

export enum ProgressAction {
  UPDATE = 'update',
  REMOVE = 'remove',
}

type Data = {
  data: {
    images: ImageDetail[];
    count: number;
  };
  code: number;
};

export type ProgressData = {
  payload: DownloadItem;
  event: string;
  id: number;
};

const TOAST_CONFIG: ToastOptions = {
  position: 'top-center',
  theme: 'colored',
  autoClose: 500,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

export const toastError = (msg: string) => {
  toast.error(msg, TOAST_CONFIG);
};

export const toastNotice = (msg: string) => {
  toast.info(msg, TOAST_CONFIG);
};

// for web
const getPostWeb = async (params: {
  page: number;
  tags: string;
  refresh: boolean;
}) => {
  const { data }: AxiosResponse<Data> = await axios.request({
    url: '/api/post',
    method: 'GET',
    headers: {
      'x-api-key': 'konachan-api',
    },
    params,
  });

  return data;
};

// for tauri
const getPostTauri = (params: {
  page: number;
  tags: string;
  refresh: boolean;
  mode: 'xml' | 'json';
}) => invoke<Data>(Action.GET_POST, params);

export const getPost = async (params: {
  page: number;
  tags: string;
  refresh: boolean;
  mode: 'xml' | 'json';
}) => {
  const requestPost = PLATFORM === 'web' ? getPostWeb : getPostTauri;
  try {
    const data = await retryPromise(
      () => requestPost(params),
      (data) => data.code !== 0,
      3
    );
    if (data.code !== 0) {
      toastError('获取图片失败，请重试');
    }
    return data.data;
  } catch {
    toastError('获取图片失败，请重试');
  }
};

export const downloadItem = (params: { url: string; preview: string }) =>
  invoke<Data>(Action.DOWNLOAD_ITEM, params);

export const closeSplashscreen = () => invoke(Action.CLOSE_SPLASHSCREEN);

export const updateValue = (source: DownloadItem[], value: DownloadItem) => {
  return source.map((item) => {
    if (item.url !== value.url) return item;
    return {
      ...item,
      ...value,
    };
  });
};

export const updateProgress = (
  source: DownloadItem[],
  action: ProgressAction,
  value: DownloadItem
) => {
  if (action === ProgressAction.REMOVE) {
    return source.filter((item) => item.url !== value.url);
  }
  return updateValue(source, value);
};

export const listenProgress = (callback: TFunc1Void<DownloadItem>) => {
  listen(Event.PROGRESS, (data: ProgressData) => {
    callback(data.payload);
  });
};

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(''), time));

export const retryPromise = async <T>(
  promiseFn: () => Promise<T>,
  retryCondition: (data: T) => boolean,
  retryTime: number
) => {
  let time = 0;
  const executor = async (): Promise<T> => {
    try {
      time += 1;
      const data = await promiseFn();
      if (retryCondition(data) && time <= retryTime) {
        toastNotice(`获取图片失败，重试第${time}次`);
        await sleep(500);
        return executor();
      }
      return data;
    } catch (error) {
      if (time <= retryTime) {
        toastNotice(`获取图片失败，重试第${time}次`);
        await sleep(500);
        return executor();
      }
      throw error;
    }
  };
  return executor();
};
