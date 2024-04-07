import { ShareAltOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import API from "../../utils/api";

const Shortener: React.FC = () => {
  const language = useSelector((state: any) => state.source.language);
  const source = useSelector((state: any) => state.source.source);
  const compiler = useSelector((state: any) => state.api.compiler);
  const userArguments = useSelector((state: any) => state.api.arguments);
  const api = useSelector((state: any) => state.api.api);

  const [messageApi, contextHolder] = message.useMessage();

  const request = {
    sessions: {
      id: 1,
      language,
      source,
      compilers: {
        id: compiler,
        options: userArguments,
      }
    }
  };

  const getShortlink = () => {
    (api as API)
      .getShorten(request)
      .then(response => {
        navigator.clipboard.writeText(response.data.url);
        messageApi.success('Shortlink copied to clipboard');
      });
  };

  return (<>
    {contextHolder}
    <Button
      type="primary"
      style={{ width: '100%' }}
      onClick={getShortlink}
    >
      <ShareAltOutlined />
    </Button>
  </>);
};

export default Shortener;