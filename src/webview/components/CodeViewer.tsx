import React, { ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../utils/api";
// eslint-disable-next-line @typescript-eslint/naming-convention
import { difference, throttle } from 'lodash';
import CodeBlock from "./CodeBlock";
import { assert } from "console";


const CodeViewer: React.FC = () => {
  const compiler = useSelector((state: any) => state.compiler.selectedCompilerId);
  const language = useSelector((state: any) => state.compiler.currentLanguage);
  const userArguments = useSelector((state: any) => state.compilationOptions.userArguments);
  const api = useSelector((state: any) => state.api.api);
  const source = useSelector((state: any) => state.source.source);

  const [elem, setElem] = useState<ReactElement[]>([]);
  const lineNo2ref = useRef<{[lineNo: number]: HTMLDivElement | null}>([]);

  const diff = useRef<any>({});

  useEffect(throttle(() => {
    if (typeof api === 'undefined' || compiler === '' || language === '') {
      return;
    }
    (api as API)
      // @ts-ignore
      .getCompileResult(compiler, { source, lang: language, options: { userArguments }})
      .then(res => renderCode(res.data));
  }, 500), [compiler, userArguments, source]);

  const renderCode = (res: any) => {
    const elem: ReactElement[] = [];
    if (res?.asm) {
      const asm = res.asm as any[];
    
      let l = 0;
      let lastLineNo = -1;

      const genUpdate = (currLineNo: number) => ((el: any) => lineNo2ref.current[currLineNo] = el);

      // Group asm by lineNo
      for (const [i, line] of asm.entries()) {
        if (line.source === null) {
          if (lastLineNo !== -1) {
            // If last code block map to a lineNo, create a CodeBlock and a ref
            elem.push(<CodeBlock
                        lineNo={lastLineNo}
                        code={asm.slice(l, i).map(x => x.text)}
                        ref={genUpdate(lastLineNo)}
                      />);
          }
          elem.push(<CodeBlock
                      code={asm.slice(i, i + 1).map(x => x.text)}
                    />);
          lastLineNo = -1;
          l = i + 1;
        } else if (line.source.line !== lastLineNo) {
          if (lastLineNo !== -1) {
            // If last code block map to a lineNo, create a CodeBlock and a ref
            elem.push(<CodeBlock
                        lineNo={lastLineNo}
                        code={asm.slice(l, i).map(x => x.text)}
                        ref={genUpdate(lastLineNo)}
                      />);
    
            lastLineNo = line.source.line;
            l = i;
          } else {
            lastLineNo = line.source.line;
          }
        }
      }
      if (lastLineNo !== -1) {
        elem.push(<CodeBlock
                    lineNo={lastLineNo}
                    code={asm.slice(l).map(x => x.text)}
                    ref={genUpdate(lastLineNo)}
                  />);
      }
    }
    setElem(elem);
  };

  const vscodeLineNo = useSelector((state: any) => state.asm.vscodeLineNo);
  useEffect(() => {
    if (vscodeLineNo !== -1) {
      lineNo2ref.current[vscodeLineNo + 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [vscodeLineNo]);

  return <>
    {elem}
  </>;
};

export default CodeViewer;