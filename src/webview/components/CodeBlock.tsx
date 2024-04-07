import React from "react";
import './CodeBlock.scss';


interface CodeBlockProp {
  code: string[]
  lineNo?: number
};

const CodeBlock: React.FC<CodeBlockProp> = (prop) => {

  return (<>
    <div className="CodeBlock">
      <pre>
        {prop.code.map((line, idx) => {
          return <div key={idx}>{line}</div>;
        })}
      </pre>
    </div>
  </>);
};

export default CodeBlock;
