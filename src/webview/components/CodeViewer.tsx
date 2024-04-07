import React, { ReactElement, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../../utils/api";
// eslint-disable-next-line @typescript-eslint/naming-convention
import { last, throttle } from 'lodash';
import CodeBlock from "./CodeBlock";


const CodeViewer: React.FC = () => {
  const dispatch = useDispatch();
  const compiler = useSelector((state: any) => state.compiler.selectedCompilerId);
  const language = useSelector((state: any) => state.compiler.currentLanguage);
  const userArguments = useSelector((state: any) => state.compilationOptions.userArguments);
  const api = useSelector((state: any) => state.api.api);
  const source = useSelector((state: any) => state.source.source);

  const [res, setRes] = useState<any>(null);

  useEffect(throttle(() => {
    if (typeof api === 'undefined' || compiler === '' || language === '') {
      return;
    }
    (api as API)
      // @ts-ignore
      .getCompileResult(compiler, { source, lang: language, options: { userArguments }})
      .then(res => {
        setRes(res.data);
        console.log(res.data);
      });
  }, 500), [compiler, language, userArguments, api, source]);
  
  return <>
    {res?.asm && (() => {
      const asm = res.asm as any[];
      const elem = [] as ReactElement[];

      let l = 0;
      let lastLineNo = -1;

      // Group asm by lineNo
      for (const [i, line] of asm.entries()) {
        if (line.source === null) {
          if (lastLineNo !== -1) {
            elem.push(<CodeBlock key={elem.length} lineNo={lastLineNo} code={asm.slice(l, i).map(x => x.text)} />);
          }
          elem.push(<CodeBlock key={elem.length} code={asm.slice(i, i + 1).map(x => x.text)} />);
          lastLineNo = -1;
          l = i + 1;
        } else if (line.source.line !== lastLineNo) {
          if (lastLineNo !== -1) {
            elem.push(<CodeBlock key={elem.length} lineNo={lastLineNo} code={asm.slice(l, i).map(x => x.text)} />);
            lastLineNo = line.source.line;
            l = i;
          } else {
            lastLineNo = line.source.line;
          }
        }
      }
      console.log(asm.length, l, lastLineNo);
      if (lastLineNo !== -1) {
        elem.push(<CodeBlock key={elem.length} lineNo={lastLineNo} code={asm.slice(l).map(x => x.text)} />);
      }

      return elem;
    }) ()}
  </>;
};

export default CodeViewer;