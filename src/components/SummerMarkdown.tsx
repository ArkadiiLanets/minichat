import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MarkdownStyles.css';

const markdownText = `
В летние месяцы **92 дня**. Вот как это получается:

- ❄️ **Июнь:** 30 дней
- ❄️ **Июль:** 31 день
- ❄️ **Август:** 31 день

30 + 31 + 31 = **92 дня**
`;

const SummerMarkdown = () => {
  return (
    <div className="markdown-container">
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  );
};

export default SummerMarkdown;
