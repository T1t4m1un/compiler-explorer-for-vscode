import React, { useEffect } from 'react';
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
    // to avoid closet trap, we need to dispatch the action after the state is updated
  };
  
  useEffect(() => {
    dispatch(setUserArguments(argument));
  }, [argument]);

  return (
    <Input
      placeholder='Compiler options...'
      onChange={handleChange}
      value={argument}
    ></Input>
  );
};

export default CompilerArguments;
