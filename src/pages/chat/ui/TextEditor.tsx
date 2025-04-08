import ReactMarkdown from "react-markdown";
import reactStringReplace from "react-string-replace";
import remarkGfm from "remark-gfm";

import ActionTable from "./ActionTable";
import CodeBlock from "./CodeBlock";

import styled from "styled-components";

function TextEditor({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, children, ...props }) => (
          <S.Text {...props}>{replaceStrong(children)}</S.Text>
        ),
        ul: ({ node, children, ...props }) => (
          <S.List {...props}>{replaceStrong(children)}</S.List>
        ),
        li: ({ node, children, ...props }) => (
          <S.ListItem {...props}>{replaceStrong(children)}</S.ListItem>
        ),
        table: ({ node, ...props }) => (
          <ActionTable>
            <S.Table {...props} />
          </ActionTable>
        ),
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock language={match[1]}>{children}</CodeBlock>
          ) : (
            <S.CodeBlock {...props}>{children}</S.CodeBlock>
          );
        },
        // code: ({ node, ...props }) => <S.CodeBlock {...props} />,
        thead: ({ node, ...props }) => <S.Thead {...props} />,
        tr: ({ node, ...props }) => <S.Tr {...props} />,
        th: ({ node, ...props }) => <S.Th {...props} />,
        td: ({ node, ...props }) => <S.Td {...props} />,
        h1: ({ node, ...props }) => <S.H1 {...props} />,
        h2: ({ node, ...props }) => <S.H2 {...props} />,
        h3: ({ node, ...props }) => <S.H3 {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default TextEditor;

const replaceStrong = (children: React.ReactNode): React.ReactNode => {
  if (Array.isArray(children)) {
    return children.map(replaceStrong);
  } else if (typeof children === "string") {
    return reactStringReplace(children, /\*\*(.+?)\*\*/g, (match, i) => (
      <S.Strong key={i}>{match}</S.Strong>
    ));
  }
  return children;
};

const S = {
  List: styled.ul`
    list-style-type: disc;
  `,

  Strong: styled.strong`
    font-weight: bold;
  `,

  ListItem: styled.li`
    color: #090909;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    // white-space: pre-wrap;
    padding-bottom: 10px;
  `,

  Text: styled.p`
    color: ${({ theme }) => theme.chatBubble?.Assistant?.color ?? "#090909"};
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    word-break: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
  `,

  Icon: styled.svg`
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    max-width: 14px;
    max-height: 14px;
    color: #090909;

    flex-shrink: 0;
  `,

  TableContainer: styled.div``,

  Table: styled.table`
    width: 100%;
    width: max-content;
    table-layout: auto;
    border-collapse: separate;
    border-spacing: 0;
    border: 0.4px solid rgba(118, 118, 128, 0.12);
    border-radius: 8px;
    overflow: auto;
    background-color: #fff;
  `,

  Thead: styled.thead`
    background: rgba(118, 118, 128, 0.02);
  `,

  Tr: styled.tr``,

  Th: styled.th`
    border: 0.4px solid rgba(118, 118, 128, 0.12);
    padding: 10px;
    background-color: #f2f2f2;
    text-align: left;

    font-family: Pretendard;
    color: #090909;
    font-size: 12px;
    font-weight: 500;

    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
  `,

  Td: styled.td`
    border: 0.4px solid rgba(118, 118, 128, 0.12);
    padding: 10px;
    color: #090909;
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 400;
    width: fit-content;
    max-width: 400px;

    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
  `,

  CodeBlock: styled.code`
    background: #f6f8fa;
    overflow-x: auto;
    padding: 0 5px;
    font-family: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono",
      monospace;
    font-size: 13px;
    color: #cc2219;
    line-height: 1.4;
    margin: 10px 0;
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
  `,

  H1: styled.h1`
    font-size: 15px;
    font-weight: 700;
    color: #090909;
  `,

  H2: styled.h2`
    font-size: 14px;
    font-weight: 600;
    color: #090909;
  `,

  H3: styled.h3`
    font-size: 14px;
    font-weight: 500;
    color: #090909;
  `,
};
