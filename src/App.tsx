import React from 'react';

import ImageList from '@/component/ImageList';
import Background from '@/component/Background';
import Page from '@/component/Page';
import Setting from '@/component/Setting';
import Service from '@/component/Service';
import Loading from '@/component/Loading';
import DotLine from '@/component/DotLine';
import Download from '@/component/Download';
import Search from '@/component/Search';

import '@/css/_var.pcss';
import '@/css/_base.pcss';
import './app.pcss';

const App: React.MemoExoticComponent<() => React.ReactElement> = React.memo(
  () => {
    return (
      <section className="bk-container">
        <Background />
        <DotLine />
        <Service />
        <aside className="bk-aside">
          <Page />
          <Setting />
          <Search />
          {/* for tauri */}
          <Download />
        </aside>
        <section className="bk-section">
          <ImageList />
          <Loading />
        </section>
      </section>
    );
  }
);

export default App;
