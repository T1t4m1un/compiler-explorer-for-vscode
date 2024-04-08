import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "./api";

export default function useApi() {
  const apiConfig = useSelector((state: any) => state.api);
  const [api, setApi] = useState<API>();

  useEffect(() => {
    if (!apiConfig) {
      return;
    }
    const newApi = new API(apiConfig.proxy, apiConfig.backendUrl);
    setApi(newApi);
  }, [apiConfig.backendUrl, apiConfig.proxy?.host, apiConfig.proxy?.port, apiConfig.proxy?.protocol]);

  return api;
}
