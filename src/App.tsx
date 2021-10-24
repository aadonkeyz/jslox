import React, { useState } from 'react';
import { Menu } from 'antd';

import Playground from './page/Playground';
import './App.css';

const PLAYGROUND = 'Playground';
const GRAMMER = 'Grammer';

function App() {
  const [active, setActive] = useState<string>(PLAYGROUND);

  return (
    <div className="App">
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[active]}
        onClick={(item) => setActive(item.key)}
      >
        <Menu.Item key={PLAYGROUND}>{PLAYGROUND}</Menu.Item>
        <Menu.Item key={GRAMMER}>{GRAMMER}</Menu.Item>
      </Menu>
      <Playground show={active === PLAYGROUND} />
    </div>
  );
}

export default App;
