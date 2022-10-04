import { CSSProperties } from 'react';

import type { ImageDetail } from '@/model/image';

export interface ImageDom extends ImageDetail {
  styleH?: number;
  styleW?: number;
  style?: CSSProperties;
  full?: boolean;
}
