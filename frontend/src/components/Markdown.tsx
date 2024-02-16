import { Table } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const Markdown = (props: { src: string }) => <ReactMarkdown
remarkPlugins={[remarkMath, remarkGfm]}
rehypePlugins={[rehypeKatex]}
components={{
  // Seems like the best way to do this
  // eslint-disable-next-line no-unused-vars
  table: ({ node, ...props }) => (
    <Table className="w-75" bordered {...props}></Table>
  ),
}}
>{props.src}</ReactMarkdown>;