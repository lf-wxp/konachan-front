import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { prominent } from 'color.js';

import { colorSetState } from '@/store';
import { CSSVariable } from '@/utils/cssVariable';
import { PLATFORM } from '@/env';
import { closeSplashscreen } from '@/utils/action';

import './style.pcss';

export default React.memo(() => {
  const [image, setImage] = useState<string>();
  const [, setColor] = useRecoilState(colorSetState);
  const img = useRef(null as unknown as HTMLImageElement);
  const onLoad = useCallback(async () => {
    const [, mutedColor, vibrantColor] = (await prominent(img.current, {
      format: 'hex',
      amount: 3,
    })) as string[];
    if (vibrantColor && mutedColor) {
      CSSVariable.setValue('--themeBaseColor', vibrantColor);
      CSSVariable.setValue('--themeMutedColor', mutedColor);
      setColor({
        mute: mutedColor,
        vibrant: vibrantColor,
      });
    }
    setTimeout(() => {
      if (PLATFORM === 'tauri') {
        closeSplashscreen();
      }
    }, 50);
  }, [setColor]);

  useEffect(() => {
    const loadImages = async () => {
      const imageModules = import.meta.glob('../../image/bg*.jpg');
      const loadedImages: string[] = [];
      for (const path in imageModules) {
        const module = await imageModules[path]();
        loadedImages.push((module as { default: string }).default);
      }
      setImage(loadedImages[Math.floor(Math.random() * 21)]);
    };
    loadImages();
  }, []);

  return (
    <figure className="bk-bg">
      <img
        ref={img}
        src={image}
        className="bk-bg__image"
        alt="bg"
        onLoad={onLoad}
      />
    </figure>
  );
});
