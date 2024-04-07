import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserArguments } from '../stores/compilationOptions';
import { Input } from 'antd';
import { useLocalStorageState } from 'ahooks';


const CompilerArguments = () => {
  const dispatch = useDispatch();

  const language = useSelector((state: any) => state.compiler.currentLanguage);
  const [argument, setArugument] = useLocalStorageState<string>(`${language}-arguments`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArugument(e.target.value);
    dispatch(setUserArguments(e.target.value));
  };

  return (
    <Input
      placeholder='Compiler options...'
      onChange={handleChange}
      value={argument}
    ></Input>
  );
};

export default CompilerArguments;
