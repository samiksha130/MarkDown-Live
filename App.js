import React, { useState, useRef } from "react";
import { Container, Row, Col, Navbar, Nav, Dropdown, Button, ButtonGroup } from "react-bootstrap";
import { FaBold, FaItalic, FaHeading, FaListUl, FaListOl, FaLink, FaImage, FaTable, FaUndo, FaRedo, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUnderline, FaStrikethrough } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { marked } from "marked";
import { useEffect } from 'react';
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import ConfirmationModal from "./components/ConfirmationModal";
import { saveFile } from "./utils/fileOperations";
import CodeMirror from "@uiw/react-codemirror";
import { markdownLanguage } from "@codemirror/lang-markdown";
import { LanguageSupport } from "@codemirror/language";
import "./App.css";
import { EditorView, keymap } from "@codemirror/view";
import MarkdownRenderer from "./MarkdownRenderer";
import Cheatsheet from "./components/Cheatsheet";
import SavedFilesPanel from "./components/SavedFilesPanel";
import { loadFile as loadMarkdownFile } from "./utils/fileOperations"; 
import DOMPurify from "dompurify";
import { EditorState } from "@codemirror/state";
import SavedFilesDropdown from "./components/SavedFiles";
import { markdown } from "@codemirror/lang-markdown";
import { trackFileInLocalStorage } from "./utils/fileOperations";



// const mdParser = new MarkdownIt();

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor!");
  const [isPrintLayout, setIsPrintLayout] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  // const [zoomLevel, setZoomLevel] = useState(1);
  const [history, setHistory] = useState([" "]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false); 
  const [showFormatModal, setShowFormatModal] = useState(false); // New state for format selection
  const [selectedFormat, setSelectedFormat] = useState(""); // Track selected format

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); //Tracks pending action
  const [format, setFormat] = useState(""); //Tracks format for saving
  // const textareaRef = useRef(null);
  const editorRef = useRef(null);
  const [content, setContent] = useState(""); //Current text state
  // const [redoStack, setRedoStack] = useState([]); //Redo stack
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [savedFiles, setSavedFiles] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null); //Define missing state
  const [unsavedFiles, setUnsavedFiles] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  // const [showRefreshModal, setShowRefreshModal] = useState(false);


  
  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [markdown]);

  

  useEffect(() => {
    // Define handleBeforeUnload outside useEffect
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // Required for browser confirmation
    // setShowRefreshModal(true); // Custom modal show karne ke liye
  };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  



  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
};


  const loadFile = (filename) => {
    if (!filename) {
      console.error("No file selected!");
      return;
    }
    // ✅ Agar HTML hai toh Markdown extract karo
    if (filename.endsWith(".html")) {
      loadMarkdownFile(filename, setMarkdown);
    } else {
      // Agar normal Markdown file hai toh localStorage se load karo
      const content = localStorage.getItem(filename);
      if (content) {
        setMarkdown(content);
        console.log(`File "${filename}" loaded from local storage.`);
      } else {
        console.warn(`File "${filename}" not found in local storage.`);
      }
    }

  };


  const updateSavedFiles = () => {
    const files = JSON.parse(localStorage.getItem("savedFiles")) || [];
    setSavedFiles(files);
    console.log("Updated saved files:", files);
  };

  // Save to history
  const updateMarkdown = (newMarkdown) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newMarkdown];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    // console.log("Updated Markdown:", newMarkdown); // ✅ Yeh log dekho
    setMarkdown(newMarkdown);
  };


  marked.setOptions({
    breaks: true,          // Line breaks ko enable karo
    gfm: true              // GitHub style lists, tables
  });




  const applyMarkdown = (syntax) => {
    if (!editorRef.current) return;

    const view = editorRef.current;
    const { state } = view;
    const selection = state.selection.main;

    let startText = "";
    let endText = "";
    let regexPattern = null; //Regex for detecting existing formatting
    let selectedText = state.doc.sliceString(selection.from, selection.to).trim() || "your text";
    
    // If no text is selected, set default "your text"
    let isPlaceholder = false;
    if (!selectedText) {
      selectedText = "your text";
      isPlaceholder = true;
    }

    //Syntax ke hisaab se wrap text
    switch (syntax) {
      case "bold":
        startText = "**";
        endText = "**";
        regexPattern = new RegExp(`^\\*\\*(.*?)\\*\\*$`); // Detect **bold text**
        break;
      case "italic":
        startText = "_";
        endText = "_";
        regexPattern = new RegExp(`^_(.*?)_$`); // Detect _italic text
        break;
      case "underline":
        startText = "<u>";
        endText = "</u>";
        regexPattern = new RegExp(`^<u>(.*?)<\/u>$`); //Detect <u>underline</u>
        break;

      case "heading":
        startText = "# ";
        regexPattern = new RegExp(`^#\\s(.*)$`); //Detect # Heading
        break;
      case "strikethrough":
        startText = "~~";
        endText = "~~";
        regexPattern = new RegExp(`^~~(.*?)~~$`); //Detect ~~strikethrough~~
        break;
      case "link":
        startText = "[";
        endText = "](https://example.com)";
        regexPattern = new RegExp(`^\\[(.*?)\\]\\(.*?\\)$`); // Detect [link](url)
        break;

      case "image":
        startText = "![";
        endText = "](image.jpg)";
        regexPattern = new RegExp(`^!\\[(.*?)\\]\\(.*?\\)$`); //Detect ![image](url)
        break;
      case "table":
        if (!editorRef.current) return; //Ensure the editor instance exists

        const editor = editorRef.current;
        const cursorPos = editor.state.selection.main.head; // Get cursor position
        const doc = editor.state.doc;

        // Ensure table starts on a new line
        const beforeText = doc.sliceString(0, cursorPos);
        const afterText = doc.sliceString(cursorPos);
        //Use only ONE `\n` if already at a new line
        const needsNewLineBefore = beforeText.length > 0 && !beforeText.endsWith("\n") ? "\n" : "";

        //Always insert TWO newlines (`\n\n`) after the table so user is out of the table
        const needsNewLineAfter = "\n\n";
        // Markdown table format
        const tableText = "| Col1 | Col2 |\n|------|------|\n| Val1 | Val2 |";

        // Updated text
        const updatedText = beforeText + needsNewLineBefore + tableText + needsNewLineAfter + afterText;

        // Calculate the new cursor position (move it to after the table)
        const newCursorPos = beforeText.length + needsNewLineBefore.length + tableText.length + needsNewLineAfter.length;

        // Replace text in editor
        editor.dispatch({
          changes: { from: 0, to: doc.length, insert: updatedText },
          selection: { anchor: newCursorPos } // Moves cursor out of table
        });

        return;


      case "list-ul":
      case "list-ol":
        if (!editorRef.current) return;
        const view = editorRef.current;
        const { state } = view;
        const selection = state.selection.main;

        const isOrdered = syntax === "list-ol";
        const listStyles = {
          arabic: "1.",
          roman: "I.",
          lowercaseRoman: "i.",
          alphabet: "A.",
          lowercaseAlphabet: "a."
        };
        const selectedListStyle = listStyles["arabic"]; // Default Arabic numbering

        const bulletStyles = ["- ","• ", "○ ", "▪ "]; // Different bullet points for nested UL
        let selectedText = state.doc.sliceString(selection.from, selection.to).trim();

        //If no text is selected, use a placeholder
        let isPlaceholder = false;
        if (!selectedText) {
          selectedText = "your text";
          isPlaceholder = true;
        }

        const selectedLines = selectedText.split("\n");

        // 🔍 Detect if the selection already contains a list
        const hasOrderedList = selectedLines.every(line => /^\s*\d+\.\s/.test(line.trim()));
        const hasUnorderedList = selectedLines.every(line => /^\s*[-•○▪]\s/.test(line.trim()));



        //Handle Nested Lists (Allow OL inside UL & UL inside OL)
        if (syntax === "list-ul" && hasUnorderedList) {
          //Remove existing UL formatting
          selectedText = selectedLines.map(line => line.replace(/^\s*[-•○▪]\s/, "")).filter(line => line.trim() !== "your text").join("\n");
        } else if (syntax === "list-ol" && hasOrderedList) {
          // Remove existing OL formatting
          selectedText = selectedLines.map(line => line.replace(/^\s*\d+\.\s/, "")).filter(line => line.trim() !== "your text").join("\n"); // Remove placeholder when toggling
        } else if (syntax === "list-ul" && hasOrderedList) {
          //Convert OL to UL or UL to OL

          // Remove OL formatting and apply UL
          selectedText = selectedLines
            .map(line => line.replace(/^\s*\d+\.\s/, "- "))
            .join("\n");
        } else if (syntax === "list-ol" && hasUnorderedList) {
          // Remove UL formatting and apply OL
          selectedText = selectedLines
            .map((line, index) => line.replace(/^\s*[-•○▪]\s/, `${index + 1}. `))
            .join("\n");
        } else {
          //Apply Nested Formatting with Proper Indentation (Single Tab)
          const indentation = "  "; // 2 spaces for proper nesting

          selectedText = selectedLines.map((line, index) => {
            let trimmed = line.trim();
    if (!trimmed) return ""; // agar line blank hai toh skip karo
            let indentLevel = line.match(/^\s*/)[0].length / 2; // Count existing indent levels
            let newIndent = indentation.repeat(indentLevel + 1); // Add 1 level deeper indentation

            return isOrdered
              ? `${newIndent}${selectedListStyle.replace(/\d+/, index + 1)} ${line.trim()}` // OL Formatting with style
              : `${newIndent}${bulletStyles[indentLevel % bulletStyles.length]}${line.trim()}`; // UL Formatting with different bullets
          }).join("\n");
        }

        //Replace text with formatted text
        view.dispatch({
          changes: { from: selection.from, to: selection.to, insert: selectedText },
          selection: { anchor: selection.from, head: selection.from + selectedText.length }
        });

        view.focus();

        //Feature 2: Auto-Start OL & UL when typing "1." or "-"
        document.addEventListener("keydown", (event) => {
          if (!editorRef.current) return;
          const view = editorRef.current;
          const { state } = view;
          const { from } = state.selection.main;

          const docText = state.doc.toString();
          const lines = docText.split("\n");
          const lastLine = lines[lines.length - 1].trim();

          //Auto-Start Ordered List (Detects "1.")
          if (event.key === " " && /^\d+\.$/.test(lastLine)) {
            event.preventDefault();
            view.dispatch({
              changes: { from, insert: "\n1. " },
              selection: { anchor: from + 4 }
            });
          }

          //Auto-Start Unordered List (Detects "-")
          if (event.key === " " && /^[-•○▪]$/.test(lastLine)) {
            event.preventDefault();
            view.dispatch({
              changes: { from, insert: "\n- " },
              selection: { anchor: from + 3 }
            });
          }
          view.focus();

        });
        return;


      default:
        break;
    }

    //Fix: Escape special characters in regex
    const escapedStart = startText.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    const escapedEnd = endText.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    const regex = new RegExp(`^${escapedStart}(.*?)${escapedEnd}$`);

    const isAlreadyFormatted = regex.test(selectedText);


    // Multi-line Support: Check & Apply Formatting Line-by-Line
    let formattedText;
    const lines = selectedText.split("\n");

    if (regexPattern && lines.every(line => regexPattern.test(line))) {
      // Remove Formatting from all lines
      formattedText = lines.map(line => line.replace(regexPattern, "$1").trim()).join("\n");

      // Agar sirf "your text" bacha hai, toh usko blank `""` kar do
      if (formattedText === "" || formattedText === "your text") {
        formattedText = "";
      }

    } else {
      // Apply Formatting to all lines
      formattedText = lines.map(line => `${startText}${line}${endText}`).join("\n");
    }

    // Replace text in CodeMirror
    view.dispatch(state.update({
      changes: { from: selection.from, to: selection.to, insert: formattedText },
      selection: { anchor: selection.from, head: selection.from + formattedText.length }
    }));

    view.focus();


  };

  const applyAlignment = (alignment) => {
    if (!editorRef.current) return;

    const view = editorRef.current;
    const { state } = view;
    const selection = state.selection.main;

    const start = selection.from;
    const end = selection.to;

    let startText = "";
    let endText = "</div>\n";

    //Define alignment tags
    switch (alignment) {
      case "left":
        startText = `<div style="text-align: left;">`;
        break;
      case "center":
        startText = `<div style="text-align: center;">`;
        break;
      case "right":
        startText = `<div style="text-align: right;">`;
        break;
      default:
        return;
    }

    // Handle text selection
    const selectedText = state.doc.sliceString(start, end) || "Aligned Text";
    const wrappedText = `${startText}${selectedText}${endText}`;

    // Replace text with aligned text
    view.dispatch({
      changes: { from: start, to: end, insert: wrappedText },
      selection: { anchor: start + startText.length, head: start + startText.length + selectedText.length }
    });

    view.focus();
  };


  const applyFileAction = (action) => {
    if (action === "new") {
      setShowSaveModal(true); // Show save confirmation modal
      setPendingAction("new"); // Store action to execute later
    }
  };

  const handleFileUpload = (event) => {

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        console.log("Opened file content:", fileContent);

        //Agar HTML file hai, toh `loadFile()` ka use karo
        if (file.name.endsWith(".html")) {
          console.log("🔍 HTML file detected via Open button. Extracting Markdown...");
          loadFile(file.name, setMarkdown); //Ensure same logic is used
        } else {
          setMarkdown(fileContent); //Agar Markdown ya plain text hai, toh direct load karo
        }

      };
      reader.readAsText(file);
    }
  };


  const openFile = () => {
    document.getElementById("fileInput").click();
  };





  
  marked.setOptions({
    breaks: true, // Single enter pe bhi line break ho
    gfm: true, //GitHub-style markdown enable karega
    smartypants: true,//Enable smart quotes
  });

  const generateShareableLink = () => {
    const encodedMarkdown = encodeURIComponent(markdown);
    const shareableURL = `${window.location.origin}/shared?doc=${encodedMarkdown}`;
    navigator.clipboard.writeText(shareableURL);
    alert("Shareable link copied to clipboard!");
  };


  // Custom Undo Function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setMarkdown(history[prevIndex]);
    }
  };

  // Custom Redo Function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setMarkdown(history[nextIndex]);
    }
  };


  //Update History When Typing
  const handleChange = (value) => {
    if (value === history[historyIndex]) return; // 🔴 Prevent duplicate history states

    const newHistory = history.slice(0, historyIndex + 1); // 🔥 Remove future redo steps
    newHistory.push(value);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setMarkdown(value);
  };

  const handleInputChange = (e) => {
    updateMarkdown(e.target.value);
  };

  const copyText = () => {
    navigator.clipboard.writeText(markdown);
  };

  const pasteText = async () => {
    const text = await navigator.clipboard.readText();
    setMarkdown(markdown + text);
  };

  const selectAllText = () => {
    const textarea = document.querySelector("textarea");
    textarea.select();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const wordCount = markdown.split(/\s+/).filter(word => word.length > 0).length;

  const handleNewFile = () => {
    setShowNewFileModal(true);
  };

  const confirmSave = () => {
    setShowNewFileModal(false); // Close the first modal
    setShowFormatModal(true); // Open format selection modal
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format); // Store selected format

    // 🟢 Markdown ko HTML me convert karo
    const parsedHtml = marked(markdown);
    console.log("Debug: Calling saveFile with updateSavedFiles:", typeof updateSavedFiles);
    if (typeof updateSavedFiles !== "function") {
      console.error("updateSavedFiles is undefined in handleFormatSelect!", updateSavedFiles);
      return;
    }

    const isSaved = saveFile(format, markdown, parsedHtml, updateSavedFiles); // Save file with parsed HTML
    if (isSaved) {
      alert(`File saved as ${format.toUpperCase()} successfully!`);
      // setMarkdown("# Welcome to Markdown Editor!"); // Reset editor
      setShowFormatModal(false); // Close modal
    } else {
      alert("File download failed. Try again!");
    }
  };


  const confirmDiscard = () => {
    setShowNewFileModal(false);
    setShowDiscardWarning(true);
  };

  const confirmNewFile = () => {
    setMarkdown("# Welcome to Markdown Editor!"); // Clear the editor
    setShowDiscardWarning(false);
  };
  const handleCancelNewFile = () => {
    // Yahan pe "Do you want to save changes?" ka cancel action handle karo
    setShowNewFileModal(false); // Pehla modal band karenge
    // setTimeout(() => {
    setShowDiscardWarning(true); // Dusra modal show karenge
    // }, 300); // Smooth transition ke liye timeout
  };


  return (
    <div>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-title">
        <Container>
          <Navbar.Brand href="#">⚡ Markdown Live</Navbar.Brand>
          {/* <Nav className="ms-auto">
            <Nav.Link href="#">Login</Nav.Link>
          </Nav> */}
        </Container>
      </Navbar>

      {/* Second Toolbar Navbar */}
      <Navbar bg="light" className="px-3 navbar-toolbar">
        <Nav className="me-auto">
          {/* Wrap New Button and Dropdown in ButtonGroup */}

          {/* <Button variant="light" onClick={handleNewFile}>New</Button> */}
          <Dropdown as={ButtonGroup}>
            <Button variant="light">File</Button>
            <Dropdown.Toggle split variant="light" id="dropdown-file" />

            <Dropdown.Menu>
              {/* <Dropdown.Item>New</Dropdown.Item> */}
              {/* <Dropdown.Item onClick={() => applyFileAction("new")}>New</Dropdown.Item> */}
              <Button variant="light" onClick={handleNewFile}>New</Button>

              {/* First pop-up (Save or Discard) */}
              <ConfirmationModal
                show={showNewFileModal}
                onConfirm={confirmSave}
                // onCancel={() => setShowNewFileModal(false)}
                onCancel={handleCancelNewFile} // Yahan pe hum custom function use karenge
                title="Save Changes?"
                message="Do you want to save your work before starting a new document?"
              />
              {/* File Format Selection Modal */}
              <ConfirmationModal
                show={showFormatModal}
                onCancel={() => setShowFormatModal(false)}
                title="Save As"
                message="Choose a format to save your file:"
              >
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button variant="danger" onClick={() => handleFormatSelect("md")}>Markdown (.md)</Button>
                  <Button variant="danger" onClick={() => handleFormatSelect("html")}>HTML (.html)</Button>
                  <Button variant="danger" onClick={() => handleFormatSelect("txt")}>Plain Text (.txt)</Button>
                  <Button variant="danger" onClick={() => handleFormatSelect("pdf")}>PDF (.pdf)</Button>
                </div>
              </ConfirmationModal>

              {/* Second pop-up (Final Discard Warning) */}
              <ConfirmationModal
                show={showDiscardWarning}
                onConfirm={confirmNewFile}
                onCancel={() => setShowDiscardWarning(false)}
                title="Are you sure?"
                message="Your work will be lost forever. Continue?"
              />

              <Dropdown.Item onClick={openFile}>Open</Dropdown.Item>

              {/*Save button to open format selection modal */}
              <Dropdown.Item onClick={() => setShowFormatModal(true)}>Save</Dropdown.Item>

              {/* Save Format Selection Modal */}
              <ConfirmationModal
                show={showFormatModal}
                onCancel={() => setShowFormatModal(false)}
                title="Save As"
                message="Choose a format to save your file:"
              >
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <Button variant="danger" onClick={() => handleFormatSelect("md")}>Markdown (.md)</Button>
                  <Button variant="danger" onClick={() => handleFormatSelect("html")}>HTML (.html)</Button>
                  <Button variant="danger" onClick={() => handleFormatSelect("txt")}>Plain Text (.txt)</Button>
                  <Button variant="danger" onClick={() => handleFormatSelect("pdf")}>PDF (.pdf)</Button>
                </div>
              </ConfirmationModal>

              <Dropdown.Item onClick={() => togglePanel()}>
                Saved Files
              </Dropdown.Item>
            
              {/* <Dropdown.Item onClick={generateShareableLink}>Get Shareable Link</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>


          <Dropdown as={ButtonGroup}>
            <Button variant="light">Edit</Button>
            <Dropdown.Toggle split variant="light" />
            <Dropdown.Menu>
              {/* <Dropdown.Item>Undo</Dropdown.Item>
              <Dropdown.Item>Redo</Dropdown.Item> */}
              <Dropdown.Item onClick={handleUndo}>Undo</Dropdown.Item>
              <Dropdown.Item onClick={handleRedo}>Redo</Dropdown.Item>

              {/* <Dropdown.Item>Select All</Dropdown.Item>
              <Dropdown.Item>Copy</Dropdown.Item>
              <Dropdown.Item>Paste</Dropdown.Item> */}
              <Dropdown.Item onClick={copyText}>Copy</Dropdown.Item>
              <Dropdown.Item onClick={pasteText}>Paste</Dropdown.Item>
              <Dropdown.Item onClick={selectAllText}>Select All</Dropdown.Item>


            </Dropdown.Menu>
          </Dropdown>


          <Dropdown as={ButtonGroup}>
            <Button variant="light">View</Button>
            <Dropdown.Toggle split variant="light" />
            <Dropdown.Menu>
              
              <Dropdown.Item onClick={toggleFullScreen}>Fullscreen</Dropdown.Item>
           
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown as={ButtonGroup}>
            <Button variant="light">Tools</Button>
            <Dropdown.Toggle split variant="light" />
            <Dropdown.Menu>
              {/* <Dropdown.Item>Word Count</Dropdown.Item> */}
              <Dropdown.Item onClick={() => alert(`Word Count: ${wordCount}`)}>Word Count</Dropdown.Item>
              {/* Markdown Cheatsheet Option */}
              <Dropdown.Item onClick={() => setShowCheatsheet(true)}>Markdown Cheatsheet</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Nav>
        <div className="toolbar-buttons">
        {/* Formatting Buttons */}
        <Button variant="outline-dark" onClick={() => applyMarkdown("bold")}>
          <FaBold />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("underline")}>
          <FaUnderline />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("italic")}>
          <FaItalic />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("strikethrough")}>
          <FaStrikethrough />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("heading")}>
          <FaHeading />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("list-ul")}>
          <FaListUl />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("list-ol")}>
          <FaListOl />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("link")}>
          <FaLink />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("image")}>
          <FaImage />
        </Button>
        <Button variant="outline-dark" onClick={() => applyMarkdown("table")}>
          <FaTable />
        </Button>
        <Button variant="outline-dark" onClick={handleUndo} disabled={historyIndex === 0} >
          <FaUndo />
        </Button>
        <Button variant="outline-dark" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
          <FaRedo />
        </Button>
        <Button variant="outline-dark" onClick={() => applyAlignment("left")}>
          <FaAlignLeft />
        </Button>
        <Button variant="outline-dark" onClick={() => applyAlignment("center")}>
          <FaAlignCenter />
        </Button>
        <Button variant="outline-dark" onClick={() => applyAlignment("right")}>
          <FaAlignRight />
        </Button>
        </div>
      </Navbar>

      <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileUpload} />


      {/* Markdown Editor and Preview */}
      <Container fluid className="editor-container">
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <div className="editor-pane">
              {/*CodeMirror Editor */}
              <CodeMirror
                value={markdown}
                height="85vh"
                extensions={[
                  new LanguageSupport(markdownLanguage), // Markdown language support
                  EditorView.lineWrapping, //Enable line wrapping
                  EditorView.theme({
                    "&": { fontFamily: "monospace", fontSize: "1.1rem" },
                    ".cm-content": { fontSize: "1.1rem" }, //Set font size inside editor
                    ".cm-strong": { fontWeight: "bold" },
                    ".cm-emphasis": { fontStyle: "italic" },
                    ".cm-header": { fontWeight: "bold", fontSize: "1.5em" },
                  }),
                ]}
                onCreateEditor={(editor) => (editorRef.current = editor)}
                onChange={(value) => handleChange(value)}
              />
            </div>
          </Col>



          <Col xs={12} sm={12} md={6} lg={6} className="border p-3 bg-light preview-pane" style={{ height: "85vh", overflowY: "scroll" }}>
            <MarkdownRenderer content={markdown} />
          </Col>
        </Row>
      </Container>
      {/* Word Count Display */}
      <div className="word-count">
        <strong>Word Count:</strong> {wordCount}
      </div>

      {/* Cheatsheet Modal */}
      <Cheatsheet show={showCheatsheet} handleClose={() => setShowCheatsheet(false)} />

      {isPanelOpen && <SavedFilesPanel loadFile={loadFile} onClose={togglePanel}/>}
      

      <footer className="text-center bg-dark text-light py-3"> <p className="mb-0">&copy; MarkdownLive 2025</p> </footer>
    </div >
  );
};
export default MarkdownEditor;