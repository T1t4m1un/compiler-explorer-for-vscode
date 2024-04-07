import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompilerId, setCompilers } from "../stores/compiler";
import API from "../../utils/api";
import { Select } from "antd";
import { useLocalStorageState } from "ahooks";

const CompilerSelector: React.FC = () => {
  const dispatch = useDispatch();
  const compilers = useSelector((state: any) => state.compiler.compilers);
  const api = useSelector((state: any) => state.api.api);
  const language = useSelector((state: any) => state.compiler.currentLanguage);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompiler, setSelectedCompiler] = useLocalStorageState<string>(`${language}-compiler`);

  useEffect(() => {
    if (typeof api === 'undefined' || language === '') {
      return;
    }
    setIsLoading(true);
    (api as API)
      .getCompilersList(language)
      .then(compilers => dispatch(setCompilers(compilers.data)))
      .then(() => setIsLoading(false));
  }, [api, language]);

  const handleChange = (compilerId: string) => {
    console.log('Selected compiler', compilerId);
    setSelectedCompiler(compilerId);
    dispatch(setCompilerId(compilerId));
  };

  return (<>
    <Select
      onChange={handleChange}
      defaultActiveFirstOption
      placeholder={isLoading ? 'Loading...' : 'Select a compiler'}
      loading={isLoading}
      showSearch
      style={{ width: '100%' }}
      popupMatchSelectWidth={false}
    >
      {(compilers as any[]).map((compiler, idx) =>
        <Select.Option
          key={idx}
          value={compiler.id}
          selected={compiler.id === selectedCompiler}
        >
          {compiler.id}
        </Select.Option>
      )}
    </Select>
  </>);
};

export default CompilerSelector;
