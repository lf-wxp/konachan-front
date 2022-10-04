import React from 'react';

import './style.pcss';

export default React.memo(
  ({ percent, error = false }: { percent: number; error?: boolean }) => {
    const width = `${percent * 100}%`;
    return (
      <span className={`bk-progress ${error ? 'bk-progress--error' : ''}`}>
        <span style={{ width }} />
      </span>
    );
  }
);
