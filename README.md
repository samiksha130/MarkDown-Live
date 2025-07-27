
# React Markdown Editor
---

A powerful, real-time Markdown editor built with React. Supports **live preview**, **syntax highlighting**, **KaTeX math rendering**, **Mermaid UML diagrams**, **footnotes**, **custom markdown extensions**, and **file management (save/load/export)**. Designed to help users write documentation, notes, and technical content efficiently.
---

## Features

- **Live Markdown Preview**
- **Supports GitHub-Flavored Markdown**
- **KaTeX Integration for Math Rendering**
- **Mermaid.js Diagrams (UML, Gantt, Flowcharts, etc.)**
- **Footnotes, Superscript, Subscript, Abbreviations**
- **Syntax Highlighted Code Blocks**
- **Task Lists and Tables**
- **Save / Load / Delete Files from LocalStorage**
- **Download in `.md`, `.html`, `.txt`, `.pdf` formats**
- **Searchable File Sidebar (Saved + Unsaved Files)**
- **Sticky Navbar and Toolbar**
- **Responsive UI (Split Editor/Preview Pane)**

---

## Project Structure

your-markdown-editor/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MarkdownEditor.js
│   │   ├── SavedFiles.js
│   │   ├── ConfirmationModal.js
│   │   ├── SavedDropdown.js
│   │   ├── SavedFilesPanel.js
│   │   └── Cheatsheet.js
│   ├── styles/
│   │   └── SavedFilesPanel.css
│   ├── utils/
│   │   ├── codeMirrorConfig.js
│   │   ├── fileOperations.js
│   │   └── markdownUtils.js
|   |
│   ├── App.js
│   ├── App.css
│   ├── App1.js
│   ├── HomePage.js
│   ├── MarkdownRenderer.js
│   ├── styles.css
│   └── index.js
├── .gitignore
├── .babelrc
├── README.md
├── package.json
└── package-lock.json
---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node) 

# Install dependencies
npm install
Run the App- npm start

Now open http://localhost:3000 in your browser to use the editor.

### Usage Guide
- Start typing Markdown on the left pane.
- See real-time preview in the right pane.
- Use the toolbar to insert:
    - Headings
    - Lists (UL/OL)
    - Code blocks
    - LaTeX math using $...$ or $$...$$
    - Mermaid diagrams:
        graph TD
            A[Start] --> B{Decision}
            B -->|Yes| C[Do something]
            B -->|No| D[Do something else]

- Save your file locally with a custom name.
- Download in your preferred format using the Export option.


### Export Formats
- **.md**- Original Markdown content
- **.html**- Parsed + styled HTML (includes Mermaid & KaTeX)
- **.txt**- Plain text
- **.pdf**- Printable format with page breaks and footers

### Technologies Used
- React.js
- CodeMirror for rich text editing
- Markdown-it with plugins
- KaTeX for math formula rendering
- Mermaid.js for diagrams
- html2pdf.js for PDF export
- DOMPurify for XSS protection
- Highlight.js for code syntax

### Available Markdown Extensions
Bold- **bold**
Italic- _italic_
Code Block- ```js\ncode here\n```
Footnotes- Here is a footnote[^1]
Superscript- x^2^ or 2^nd^
Subscript- H~2~O
Task Lists	- [x] Done
Abbreviation- *[HTML]: HyperText Markup Language
Math- $a^2 + b^2 = c^2$ or $$...$$
Diagrams- ```mermaid
                sequenceDiagram
                    participant Alice
                    participant Bob
                    Alice->Bob: Hello Bob, how are you?
                    Bob->Alice: I'm good, thanks!
                    Alice->Bob: Great to hear!
                    ```
