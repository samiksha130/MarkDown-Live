// import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Cheatsheet = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Markdown Cheatsheet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>📌 Headers</h5>
        <pre># H1  | ## H2  | ### H3</pre>

        <h5>📌 Styling</h5>
        <pre>_Italic_ | **Bold** | ~~Strikethrough~~ | ==Highlight==</pre>

        <h5>📌 Lists</h5>
        <pre>- Item  | 1. Ordered Item</pre>

        <h5>📌 Definition Lists</h5>
        <pre>
Markdown  
: A lightweight markup language  
</pre>
<pre>
React  
: A JavaScript library for UIs  
        </pre>

        <h5>📌 Abbreviations</h5>
        <pre>
The HTML and CSS are essential for web dev.
<pre> *[HTML]: HyperText Markup Language</pre>
<pre> *[CSS]: Cascading Style Sheets </pre>
 
        </pre>

        <h5>📌 Quoted Text</h5>
        <pre>
"Science Of Happiness."- You
        </pre>

        <h5>📌 Subscript & Superscript</h5>
        <pre>
H~2~O is the chemical formula for water.  
2^10^ equals 1024.
        </pre>

        <h5>📌 Links & Images</h5>
        <pre>[Google](https://google.com) | ![Alt Text](image.jpg)</pre>

        <h5>📌 Code Blocks</h5>
        <pre>Inline: `console.log("Hello")`</pre>
        <pre>Block: ```js
        console.log("Hello World");
        ```</pre>

        <h5>📌 Tables</h5>
        <pre>
{`| Col1  | Col2  |
|-------|-------|
| Val1  | Val2  |`}
        </pre>

        <h5>📌 Math (KaTeX)</h5>
        <pre>$E = mc^2$</pre>

        <h5>📌 Footnotes</h5>
        <pre>Here is a footnote[^1]</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Cheatsheet;
