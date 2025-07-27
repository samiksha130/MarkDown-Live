import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import App from "./App"; // Import editor component

function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/App" element={<App />} /> {/* Link to the editor */}
        
      </Routes>
    </Router>
  );
}

export default App1;


































// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Navbar, Nav, Dropdown, Button, ButtonGroup, Modal } from "react-bootstrap";
// import { FaUndo, FaRedo } from "react-icons/fa";
// //FaBold, FaItalic, FaHeading, FaListUl, FaListOl, FaLink, FaImage, FaTable,
// import "bootstrap/dist/css/bootstrap.min.css";
// import { marked } from "marked";
// import hljs from "highlight.js";
// import "highlight.js/styles/github.css";

// const MarkdownEditor = () => {
//   const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor!");
//   const [history, setHistory] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);
//   const [showFileModal, setShowFileModal] = useState(false);

//   useEffect(() => {
//     document.querySelectorAll("pre code").forEach((block) => {
//       hljs.highlightElement(block);
//     });
//   }, [markdown]);

//   // Save file as chosen format
//   const saveFile = (format) => {
//     let blob;
//     if (format === "txt") {
//       blob = new Blob([markdown], { type: "text/plain" });
//     } else if (format === "html") {
//       blob = new Blob([marked(markdown)], { type: "text/html" });
//     } else {
//       blob = new Blob([markdown], { type: "application/octet-stream" });
//     }
    
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `document.${format}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   // Open file from user system
//   const openFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = (event) => setMarkdown(event.target.result);
//     reader.readAsText(file);
//   };

//   // File new modal options
//   const handleNewFile = (action) => {
//     if (action === "save") saveFile("txt");
//     if (action !== "dontsave") setMarkdown("");
//     setShowFileModal(false);
//   };

//   // Undo / Redo functionality
//   const handleUndo = () => {
//     if (history.length > 0) {
//       setRedoStack([markdown, ...redoStack]);
//       setMarkdown(history[history.length - 1]);
//       setHistory(history.slice(0, -1));
//     }
//   };

//   const handleRedo = () => {
//     if (redoStack.length > 0) {
//       setHistory([...history, markdown]);
//       setMarkdown(redoStack[0]);
//       setRedoStack(redoStack.slice(1));
//     }
//   };

//   // Word count function
//   const getWordCount = () => markdown.trim().split(/\s+/).length;

//   return (
//     <div>
//       <Navbar bg="dark" variant="dark" expand="lg">
//         <Container>
//           <Navbar.Brand href="#">📄 Markdown Live</Navbar.Brand>
//           <Nav className="ms-auto">
//             <Nav.Link href="#">Login</Nav.Link>
//           </Nav>
//         </Container>
//       </Navbar>

//       <Navbar bg="light" className="px-3">
//         <Nav className="me-auto">
//           <Dropdown as={ButtonGroup}>
//             <Button variant="light" onClick={() => setShowFileModal(true)}>File</Button>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => setShowFileModal(true)}>New</Dropdown.Item>
//               <Dropdown.Item>
//                 <input type="file" accept=".txt,.md,.html,.docx,.pdf" onChange={openFile} style={{ display: "none" }} id="fileInput" />
//                 <label htmlFor="fileInput" style={{ cursor: "pointer" }}>Open</label>
//               </Dropdown.Item>
//               <Dropdown.Item onClick={() => saveFile("txt")}>Save as TXT</Dropdown.Item>
//               <Dropdown.Item onClick={() => saveFile("html")}>Save as HTML</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>

//           <Dropdown as={ButtonGroup}>
//             <Button variant="light">Edit</Button>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={handleUndo}>Undo</Dropdown.Item>
//               <Dropdown.Item onClick={handleRedo}>Redo</Dropdown.Item>
//               <Dropdown.Item onClick={() => navigator.clipboard.writeText(markdown)}>Copy</Dropdown.Item>
//               <Dropdown.Item onClick={() => setMarkdown(markdown + "\n" + markdown)}>Paste</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Nav>

//         <Button variant="outline-dark" onClick={handleUndo}><FaUndo /></Button>
//         <Button variant="outline-dark" onClick={handleRedo}><FaRedo /></Button>
//       </Navbar>

//       <Container fluid className="mt-3">
//         <Row>
//           <Col md={6}>
//             <textarea
//               className="form-control"
//               style={{ height: "85vh", fontSize: "1.1rem" }}
//               value={markdown}
//               onChange={(e) => {
//                 setHistory([...history, markdown]);
//                 setRedoStack([]);
//                 setMarkdown(e.target.value);
//               }}
//             />
//           </Col>
//           <Col md={6} className="border p-3 bg-light" style={{ height: "85vh", overflowY: "scroll" }}>
//             <div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
//           </Col>
//         </Row>
//       </Container>
      
//       <Modal show={showFileModal} onHide={() => setShowFileModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>New File</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Do you want to save the current document before opening a new one?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => handleNewFile("dontsave")}>Don't Save</Button>
//           <Button variant="primary" onClick={() => handleNewFile("save")}>Save</Button>
//           <Button variant="danger" onClick={() => handleNewFile("discard")}>Discard</Button>
//         </Modal.Footer>
//       </Modal>
      
//       <footer className="text-center bg-dark text-light py-3"> <p className="mb-0">&copy; MarkdownLive 2025</p> </footer>
//     </div>
//   );
// };

// export default MarkdownEditor;
