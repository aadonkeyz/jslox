/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, List, Button } from 'antd';
import { CloseCircleOutlined, CaretRightOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

import Compiler from '../../compiler';
import './style.css';

const PROBLEMS = 'Problems';
const CONSOLE = 'Console';
const TAB_CONFIGS = [
  {
    key: PROBLEMS,
    label: PROBLEMS,
  },
  {
    key: CONSOLE,
    label: CONSOLE,
  },
];

function Playground({ show }: { show: boolean }) {
  const [activeKey, setActiveKey] = useState<string>(TAB_CONFIGS[0].key);
  const [errors, setErrors] = useState<string[]>([]);
  const [output, setOutput] = useState<any[]>([]);

  const compilerRef = useRef<Compiler>();

  const handleCodeChange = useCallback(
    debounce((code: string) => {
      const compiler = new Compiler(code);
      compilerRef.current = compiler;
      compiler.analysis();
      // @ts-ignore
      window.zzz = compiler;
      const newErrors = compiler.scanner.errors
        .concat(compiler.parser.errors, compiler.scopeAnalyst.errors)
        .map((item) => {
          return `${item.message} in line ${item.line} column ${item.column}.`;
        });
      setErrors(newErrors);
    }, 500),
    [],
  );

  const handleRun = () => {
    if (compilerRef.current) {
      try {
        compilerRef.current.run();
      } catch (err) {
        setOutput((pre) => [...pre, (err as Error).message]);
      }
    }
  };

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...data: any[]) => {
      setOutput((pre) => [
        ...pre,
        ...data.map((item) => {
          if (item === null) {
            return 'null';
          }

          if (!(item instanceof Object)) {
            return String(item);
          }

          try {
            return JSON.stringify(item);
          } catch (err) {
            return Object.prototype.toString.apply(item);
          }
        }),
      ]);
      originalLog(...data);
    };
  }, []);

  return (
    <div className="playground" style={{ display: show ? '' : 'none' }}>
      <Editor
        height="65%"
        defaultLanguage="plaintext"
        onChange={(value) => {
          handleCodeChange(value || '');
        }}
      />
      <div className="terminal">
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          tabBarExtraContent={
            <>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                style={{ marginRight: 16 }}
                onClick={() => setOutput([])}
              >
                <span style={{ transform: 'translateY(-1px)' }}>Clear</span>
              </Button>
              <Button
                style={{ background: '#52c41a' }}
                icon={<CaretRightOutlined />}
                disabled={!compilerRef.current || errors.length > 0}
                onClick={handleRun}
              >
                <span style={{ transform: 'translateY(-1px)' }}>Run</span>
              </Button>
            </>
          }
        >
          {TAB_CONFIGS.map((item) => {
            let Content: React.ReactNode = null;
            if (item.key === PROBLEMS) {
              Content = (
                <List
                  header={null}
                  footer={null}
                  bordered
                  dataSource={errors}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              );
            } else if (item.key === CONSOLE) {
              Content = (
                <List
                  header={null}
                  footer={null}
                  bordered
                  dataSource={output}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              );
            }

            let tabName = item.key;
            if (item.key === PROBLEMS && errors.length > 0) {
              tabName += `(${errors.length})`;
            }

            return (
              <Tabs.TabPane tab={tabName} key={item.key}>
                {Content}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

export default Playground;
