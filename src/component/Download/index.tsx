import React, { useCallback, useEffect, useRef } from 'react';
import {
  IoIosCheckmarkCircle,
  IoMdInformationCircleOutline,
  IoIosRefresh,
} from 'react-icons/io';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useRecoilState } from 'recoil';

import { downloadItemsState } from '@/store';
import Progress from '@/component/Progress';
import { downloadItem, updateValue } from '@/utils/action';

import { type DownloadItem, DownloadStatus } from '@/model/downloadItem';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.pcss';

export default React.memo(() => {
  const [downloadItems, setDownloadItems] = useRecoilState(downloadItemsState);
  const downloadItemsRef = useRef(downloadItems);

  const downloadRetry = useCallback((url: string, preview: string): void => {
    const items = downloadItemsRef.current;
    const hasItem = !!items.find(
      (item) => item.url === url && item.status !== DownloadStatus.FAIL
    );
    if (hasItem) return;
    downloadItem({ url, preview });
    setDownloadItems((prev) => {
      return updateValue(prev, {
        url,
        preview,
        status: DownloadStatus.PENDING,
        percent: 0,
      });
    });
  }, []);

  useEffect(() => {
    downloadItemsRef.current = downloadItems;
  }, [downloadItems]);

  return (
    <section className="bk-download">
      <PerfectScrollbar>
        <div className="bk-download__box">
          {downloadItems.map((item: DownloadItem, key: number) => (
            <div className="bk-download__item" key={key}>
              {item.status === DownloadStatus.SUCCESS && (
                <span className="bk-download__icon">
                  <IoIosCheckmarkCircle />
                </span>
              )}
              {item.status === DownloadStatus.FAIL && (
                <div className="bk-download__catch">
                  <span className="bk-download__error">
                    <IoMdInformationCircleOutline />
                  </span>
                  <span
                    className="bk-download__retry"
                    onClick={(): void => downloadRetry(item.url, item.preview)}
                  >
                    <IoIosRefresh />
                  </span>
                </div>
              )}
              <img src={item.preview} alt="preview" />
              <Progress
                percent={item.percent}
                error={item.status === DownloadStatus.FAIL}
              />
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </section>
  );
});
