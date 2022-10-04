// for tauri
export enum DownloadStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAIL = 'fail',
}

export interface DownloadItem {
  url: string;
  preview: string;
  percent: number;
  status: DownloadStatus;
}
