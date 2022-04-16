import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import axios from 'axios';

import {
  imagesState,
  totalState,
  loadingState,
  tagsState,
  pageState,
  refreshToggleState,
} from '../../store';

const errorNotice = (msg: string) =>
  toast.error(msg, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    pauseOnHover: true,
    progress: undefined,
    theme: 'dark',
  });

export default React.memo(() => {
  const [, setImages] = useRecoilState(imagesState);
  const [, setTotal] = useRecoilState(totalState);
  const [, setLoading] = useRecoilState(loadingState);
  const [tags] = useRecoilState(tagsState);
  const [page] = useRecoilState(pageState);
  const [refresh] = useRecoilState(refreshToggleState);

  useEffect(() => {
    setLoading(true);
    axios
      .request({
        url: '/api/post',
        method: 'GET',
        headers: {
          'x-api-key': 'konachan-api',
        },
        params: {
          tags,
          page,
          refresh,
        },
      })
      .then(({ data }) => {
        const {
          code,
          msg,
          data: { images, count },
        } = data;
        if (code !== 0) {
          errorNotice(msg);
          return;
        }
        setImages(images);
        setTotal(count);
      })
      .catch((err) => {
        errorNotice(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh, tags, page]);

  return null;
});
