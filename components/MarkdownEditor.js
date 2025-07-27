import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { marked } from "marked";
import Toolbar from "./Toolbar";
import FileMenu from "./FileMenu";
import ViewOptions from "./ViewOptions";
import WordCount from "./WordCount";
import "../styles/editor.css"; // Import styles

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor!");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const updateMarkdown = (newText) => {
    setMarkdown(newText);
  };

  return (
    <div>
      <FileMenu markdown={markdown} setMarkdown={setMarkdown} />
      <Toolbar updateMarkdown={updateMarkdown} markdown={markdown} />
      <ViewOptions isPreviewMode={isPreviewMode} setIsPreviewMode={setIsPreviewMode} />
      
      <Container fluid className="mt-3">
        <Row>
          {/* Markdown Editor */}
          <Col md={6}>
            <textarea
              className="form-control editor-textarea"
              value={markdown}
              onChange={(e) => updateMarkdown(e.target.value)}
            />
          </Col>

          {/* Preview Mode */}
          <Col md={6} className="border p-3 bg-light preview-container">
            <div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
          </Col>
        </Row>
      </Container>

      <WordCount markdown={markdown} />
    </div>
  );
};

export default MarkdownEditor;
