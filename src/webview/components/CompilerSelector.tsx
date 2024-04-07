import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompilerId, setCompilers } from "../stores/compiler";
import API from "../../utils/api";
import { Select } from "antd";
import { useLocalStorageState } from "ahooks";
import { isEmpty, set } from "lodash";

const CompilerSelector: React.FC = () => {
  const dispatch = useDispatch();
  const api = useSelector((state: any) => state.api.api);
  const compilers = useSelector((state: any) => state.compiler.compilers);
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
      .then(compilers => {
        setIsLoading(false);
        dispatch(setCompilers(compilers.data));
      });
  }, [api, language]);
  
  const handleChange = (compilerId: string) => {
    setSelectedCompiler(compilerId);
    // to avoid closet trap, we need to dispatch the action after the state is updated
  };
  
  useEffect(() => {
    if (!isEmpty(selectedCompiler)) {
      dispatch(setCompilerId(selectedCompiler));
    }
  }, [selectedCompiler]);

  return (<>
    <Select
      onChange={handleChange}
      defaultActiveFirstOption
      placeholder={isLoading ? 'Loading...' : 'Select a compiler'}
      loading={isLoading}
      showSearch
      style={{ width: '100%' }}
      popupMatchSelectWidth={false}
      value={selectedCompiler}
      options={compilers.map((compiler: any) => ({ value: compiler.id, label: compiler.id }))}
    />
  </>);
};

export default CompilerSelector;
