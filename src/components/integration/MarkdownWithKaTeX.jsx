import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MarkdownWithKaTeX = ({ source, style }) => {
  const [processedSource, setProcessedSource] = useState('');
  
  useEffect(() => {
    // 处理KaTeX公式
    let processedText = source;
    
    // 处理块级公式 $$...$$
    const blockFormulaRegex = /\$\$([\s\S]*?)\$\$/g;
    processedText = processedText.replace(blockFormulaRegex, (match, formula) => {
      try {
        const html = katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: true
        });
        return `<div class="katex-display">${html}</div>`;
      } catch (error) {
        console.error('Error rendering KaTeX block formula:', error);
        return match;
      }
    });
    
    // 处理行内公式 $...$
    const inlineFormulaRegex = /\$([^\$]+)\$/g;
    processedText = processedText.replace(inlineFormulaRegex, (match, formula) => {
      try {
        const html = katex.renderToString(formula.trim(), {
          throwOnError: false,
          displayMode: false
        });
        return `<span class="katex-inline">${html}</span>`;
      } catch (error) {
        console.error('Error rendering KaTeX inline formula:', error);
        return match;
      }
    });
    
    setProcessedSource(processedText);
  }, [source]);
  
  return (
    <div style={style}>
      <MDEditor.Markdown source={processedSource} />
    </div>
  );
};

export default MarkdownWithKaTeX;