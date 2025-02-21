import React, { useRef, useEffect } from 'react';
import katex from 'katex';

const MathText = ({ formula, ...props }: { formula: string } & React.SVGProps<SVGForeignObjectElement>) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      katex.render(formula, spanRef.current, {
        throwOnError: false,
        output: 'html'
      });
    }
  }, [formula]);

  return <foreignObject {...props}><span ref={spanRef} /></foreignObject>;
};

export default MathText;
