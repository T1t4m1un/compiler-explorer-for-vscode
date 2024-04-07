import React, { forwardRef, useRef } from "react";
import './CodeBlock.scss';
import { useDispatch } from "react-redux";
import { setSelectedLineNo, setVscodeLineNo } from "../stores/asm";
import classNames from "classnames";
import { useSelector } from "react-redux";


interface CodeBlockProp {
  code: string[]
  lineNo?: number
};

const CodeBlockImpl: React.ForwardRefRenderFunction<HTMLDivElement, CodeBlockProp> = (prop, selfRef) => {
  const dispatch = useDispatch();
  const vscodeLineNo = useSelector((state: any) => state.asm.vscodeLineNo);
  const isSelected = vscodeLineNo === prop.lineNo;

  const handleSelected = () => {
    if (prop.lineNo === undefined) {
      return;
    }
    dispatch(setSelectedLineNo(prop.lineNo));
    dispatch(setVscodeLineNo(prop.lineNo));
  };

  return (<>
    <div
      ref={selfRef}
      onClick={handleSelected}
      id={prop.lineNo?.toString() || ''}
      className={classNames('CodeBlock', {'selected': isSelected})}
    >
      <pre>
        {prop.code.map((line, idx) => {
          return <div key={idx}>{line}</div>;
        })}
      </pre>
    </div>
  </>);
};

const CodeBlock = forwardRef(CodeBlockImpl);

export default CodeBlock;
