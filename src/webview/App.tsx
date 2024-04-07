import React, { useEffect, useReducer, useState } from 'react';
import { useVsCode, MessageReceivedHandler } from '../utils/useVsCode';
import API from '../utils/api';
import { setLanguage } from './stores/compiler';
import { useDispatch, useSelector } from 'react-redux';
import CompilerSelector from './components/CompilerSelector';
import { setApi } from './stores/api';
import CompilerArguments from './components/CompilerArguments';
import CodeViewer from './components/CodeViewer';
import { convertor } from '../utils/convertor';
import { setSource } from './stores/source';
import Grid from 'antd/es/card/Grid';
import { Col, Row } from 'antd';
import { setVscodeLineNo } from './stores/asm';
import { isEqual } from 'lodash';


const proxyReduer = (state: any, action: any) => {
  switch (action.type) {
    case 'update':
      if (isEqual(action.payload, state)) {
        return state; 
      }
      return { ...action.payload };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const dispatch = useDispatch();

  const [proxy, dispatchProxy] = useReducer(proxyReduer, undefined);
  useEffect(() => { dispatch(setApi(new API(proxy))); }, [proxy]);

  const messageHandler: MessageReceivedHandler = (incomingMessage) => {
    switch (incomingMessage.type) {
      case 'updateEditorState': {
        const language = incomingMessage.content.languageId as string;
        const source = incomingMessage.content.source as string;
        const proxy = incomingMessage.content.proxy as any;
        const lineNo = incomingMessage.content.lineNo as number;

        try {
          dispatchProxy({ type: 'update', payload: proxy });
          dispatch(setVscodeLineNo(lineNo));
          dispatch(setSource(source));
          dispatch(setLanguage(convertor[language as keyof typeof convertor]));
        } finally {
          return;
        }
      }
    }
  };
  const { sendMessage } = useVsCode(messageHandler);

  const asmSelectedLineNo = useSelector((state: any) => state.asm.selectedLineNo);
  useEffect(() => {
    sendMessage({ type: 'gotoLine', content: {asmSelectedLineNo} });
  }, [asmSelectedLineNo]);

  return (<>
    <Grid >
      <Row>
      {/* <Row gutter={[16, 16]}> */}
        <Col flex={1}><CompilerSelector /></Col>
        <Col flex={2}><CompilerArguments /></Col>
      </Row>
      <Row>
      {/* <Row gutter={[16, 16]}> */}
        <CodeViewer />
      </Row>
    </Grid>
  </>);
};

export default App;
