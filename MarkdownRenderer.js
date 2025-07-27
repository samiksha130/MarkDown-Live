import React from "react";
import MarkdownIt from "markdown-it";
import attrs from "markdown-it-attrs"; //Plugin to enable {: start="1"}
import abbr from "markdown-it-abbr";
import deflist from "markdown-it-deflist";
import footnote from "markdown-it-footnote";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import taskLists from "markdown-it-task-lists";
import texmath from "markdown-it-texmath";
import mark from "markdown-it-mark";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import "highlight.js/styles/github.css"; // Adjust theme if needed
import katex from "katex";
import "katex/dist/katex.min.css"; // Required for LaTeX math
import renderMathInElement from "katex/contrib/auto-render";
import { useEffect } from "react";  //Import React Hook
import { markdown } from "@codemirror/lang-markdown";
import mermaid from "mermaid";
import markdownItMermaid from "markdown-it-mermaid";


const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang }).value + "</code></pre>";
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>";
  }
})
  .use(attrs)
  .use(abbr)
  .use(deflist)
  .use(footnote)
  .use(sub)
  .use(sup)
  .use(taskLists)
  .use(texmath, { engine: require("katex"), delimiters: "dollars" })
  .use(mark)
  .use(markdownItMermaid);  //Add Mermaid Plugin

// Abbreviations (Hover pe full form dikhane ke liye)
md.renderer.rules.abbr_open = (tokens, idx) => {
  const titleAttr = tokens[idx].attrs ? tokens[idx].attrs[0][1] : "Missing Title";
  return `<abbr title="${titleAttr}">`;
};
md.renderer.rules.abbr_close = () => "</abbr>";


// Footnotes (Click on reference moves to correct footnote)
md.renderer.rules.footnote_ref = (tokens, idx) => {
  let id = tokens[idx].meta.id + 1; // footnote numbering starts from 1
  return `<sup class="footnote-ref"><a href="#fn${id}" id="fnref${id}">[${id}]</a></sup>`;
};

md.renderer.rules.footnote_block_open = () => '<div class="footnotes"><hr><ol>';
md.renderer.rules.footnote_block_close = () => "</ol></div>";

md.renderer.rules.footnote_anchor = (tokens, idx) => {
  let id = tokens[idx].meta.id + 1; // correct footnote ID
  return ` <a href="#fnref${id}" class="footnote-backref">↩</a>`; //Clicking brings user back
};


// blockquotes render properly
md.renderer.rules.blockquote_open = () => '<blockquote class="md-blockquote">';
md.renderer.rules.blockquote_close = () => "</blockquote>";




//Subscript Rendering
md.inline.ruler.after("emphasis", "subscript", function (state, silent) {
  let match = state.src.slice(state.pos).match(/^([^\s~]+)~([^~]+)~/);
  if (!match) return false;
  if (!silent) {
    state.push({ type: "text", content: `${match[1]}<sub>${match[2]}</sub>` });
  }
  state.pos += match[0].length;
  return true;
});

  
//Custom rule to apply Bootstrap styles to tables
const defaultRender = md.renderer.rules.table_open || function(tokens, idx, options, env, self) {
    return "<table class='table table-bordered table-striped table-hover'>\n";
  };
  md.renderer.rules.table_open = defaultRender;

export const MarkdownRenderer = ({ content }) => {

  useEffect(() => {
    console.log("Rendering Math & Mermaid");
    console.log("This is correct");
    // renderMathInElement(document.body, {
      const el = document.getElementById("rendered-output");
      if (el) {
        renderMathInElement(el, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
        ],
        throwOnError: false
    });
  }
     //Initialize Mermaid.js
  mermaid.initialize({ startOnLoad: false });
  setTimeout(() => {
    mermaid.run({nodes: document.querySelectorAll(".mermaid")});
  }, 100);
}, [content]);

  console.log("Raw Markdown Before Parsing:", content);
    let htmlOutput = md.render(content);
    console.log("Parsed HTML Output:", htmlOutput);
    //Mermaid Diagrams Are Wrapped in a <div>
htmlOutput = htmlOutput.replace(
  /<pre class="mermaid">([\s\S]*?)<\/pre>/g,
  (match, code) => `<div class="mermaid">${code}</div>`
);
    const sanitizedHtml = DOMPurify.sanitize(htmlOutput);
    console.log("Sanitized HTML Output:", sanitizedHtml);

    return (
      <div
        className="table-responsive" id="rendered-output"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  };
  
  export default MarkdownRenderer;