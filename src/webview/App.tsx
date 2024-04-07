import React, { useEffect, useState } from 'react';
import { useVsCode, MessageReceivedHandler } from '../utils/useVsCode';
import API from '../utils/api';
import { setLanguage } from './stores/compiler';
import { useDispatch } from 'react-redux';
import CompilerSelector from './components/CompilerSelector';
import { setApi } from './stores/api';
import CompilerArguments from './components/CompilerArguments';
import CodeViewer from './components/CodeViewer';
import { convertor } from '../utils/convertor';
import { setSource } from './stores/source';
import Grid from 'antd/es/card/Grid';
import { Col, Divider, Row } from 'antd';


const App: React.FC = () => {
  const dispatch = useDispatch();

  const [proxy, setProxy] = useState();
  useEffect(() => { dispatch(setApi(new API(proxy))); }, [proxy]);

  const messageHandler: MessageReceivedHandler = (incomingMessage) => {
    console.log('Incoming message', incomingMessage);
    switch (incomingMessage.type) {
      case 'updateEditorState': {
        const language = incomingMessage.content.languageId as string;
        const source = incomingMessage.content.source as string;
        const proxy = incomingMessage.content.proxy as any;
        try {
          setProxy(proxy);
          dispatch(setSource(source));
          dispatch(setLanguage(convertor[language as keyof typeof convertor]));
        } finally {
          return;
        }
      }
    }
  };
  const { sendMessage } = useVsCode(messageHandler);

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
