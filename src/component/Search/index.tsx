import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

import { tagsState, pageState, totalState } from '@/store';

import './style.pcss';

export default React.memo(() => {
  const [tags, setTags] = useRecoilState(tagsState);
  const [, setPage] = useRecoilState(pageState);
  const [, setTotal] = useRecoilState(totalState);
  const [value, setValue] = useState('');
  const onKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && value !== tags) {
        setTags(value);
        setPage(1);
        setTotal(0);
      }
    },
    [value, tags]
  );
  const onInput = useCallback((e: React.FormEvent<HTMLInputElement>): void => {
    setValue((e.target as HTMLInputElement).value);
  }, []);

  return (
    <input
      className="bk-search"
      value={value}
      onInput={onInput}
      onKeyPress={onKeyPress}
    />
  );
});
