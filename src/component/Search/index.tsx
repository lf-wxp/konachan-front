import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

import { tagsState } from '../../store';

import './style.pcss';

export default React.memo(() => {
  const [tags, setTags] = useRecoilState(tagsState);
  const [value, setValue] = useState('');
  const onKeyPress = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' && value !== tags) {
        setTags(value);
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
