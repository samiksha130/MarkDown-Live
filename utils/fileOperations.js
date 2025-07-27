import { MarkdownRenderer } from "../MarkdownRenderer"; //Import Renderer
import html2pdf from "html2pdf.js";
import ReactDOMServer from "react-dom/server";

export const downloadFile = (filename, content, type) => {
  console.log("Starting download for:", filename);
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("Download complete:", filename);
};

export const saveFile = (format, markdown, parsedHtml, updateSavedFiles) => {

  console.log("saveFile called with format:", format);
  console.log("Markdown content before saving PDF:", markdown);

  console.log("Debug: Received updateSavedFiles type:", typeof updateSavedFiles);

  if (typeof updateSavedFiles !== "function") {
    console.error("Error: updateSavedFiles is not a function! It is:", updateSavedFiles);
    return false;  
  }
  let filename = prompt("Enter file name:");
  if (!filename) return;
  let content = markdown;
  let type = "text/plain";

  if (format === "md") {
    filename += ".md";
    type = "text/markdown";
  } else if (format === "html") {
    filename += ".html";
const parsedHtml = ReactDOMServer.renderToStaticMarkup(<MarkdownRenderer content={markdown} />);

content = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown to HTML Preview</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.4/katex.min.css">
<style> 
body { font-family: Helvetica, sans-serif; font-size: 14px; padding: 20px; max-width: 900px; margin: auto; }
h1 { font-size: 24px; font-weight: bold; }
h2 { font-size: 20px; font-weight: bold; }
h3 { font-size: 18px; font-weight: bold; }
p, li { font-size: 14px; line-height: 1.6; }
ul, ol { padding-left: 20px; }
pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
code { background: #eee; padding: 2px 5px; border-radius: 3px; font-family: monospace;}
sub { font-size: 0.75em; } 
sup { font-size: 0.75em; } 
abbr { text-decoration: underline dotted; cursor: help; } 
.footnotes { font-size: 12px; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
</style>
</head>
<body class="markdown-body">
<!-- Markdown Content:
${markdown}
-->
${parsedHtml}
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.4/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({ startOnLoad: true });
</script>
</body>
</html>`;


    type = "text/html";
  } else if (format === "txt") {
    filename += ".txt";
    type = "text/plain";
  }

  else if (format === "pdf") {
    filename += ".pdf";
    
//code3
const previewElement = document.getElementById("rendered-output"); // Extract rendered Markdown HTML
    if (!previewElement) {
        console.error("❌ Error: 'rendered-output' element not found! Cannot generate PDF.");
        return false;
    }

    console.log(" Extracted Rendered Markdown:", previewElement.innerHTML);

    // Convert HTML to a PDF with proper text formatting
    html2pdf()
        .from(previewElement)
        .set({
            margin: 10,
            filename: filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .toPdf()
        .get('pdf')
        .then(function (pdf) {
            console.log("PDF Successfully Generated!");

// Insert manual page breaks at specific points
const content = previewElement.innerHTML;
const breakPoints = ["<h1>", "<h2>", "<h3>", "<table>", "<pre>", "<blockquote>"];
content.replace(/<table>/g, '<div class="large-table"></div><table>');

let modifiedContent = content;
        breakPoints.forEach(tag => {
            modifiedContent = modifiedContent.replace(
                new RegExp(tag, "g"),
                `<div class="page-break"></div>${tag}`
            );
        });
        
          // page break after every major section
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.text(`Page ${i} of ${totalPages}`, 180, 290); // Add footer for clarity
        }
            pdf.save(filename);

    });
    console.log("PDF Generated:", filename);
    return true;
  }

  let files = JSON.parse(localStorage.getItem("savedFiles")) || [];

  if (!files.includes(filename)) {
    files.push(filename);
    localStorage.setItem("savedFiles", JSON.stringify(files));
  }
  
  localStorage.setItem(filename, content);

// Call function
if (typeof updateSavedFiles === "function") {
  updateSavedFiles();
} else {
  console.error("Error: updateSavedFiles is not a function!");
}


    downloadFile(filename, content, type);
    return true;
  };


  export const trackFileInLocalStorage = (filename) => {
    let files = JSON.parse(localStorage.getItem("savedFiles")) || [];
  
    if (!files.includes(filename)) {
      files.push(filename);
      localStorage.setItem("savedFiles", JSON.stringify(files));
    }
  };
  



  export const loadFile = (filename, updateMarkdown) => { //Accept updateMarkdown as a parameter
    const content = localStorage.getItem(filename);
    if (!content) return;
  
    console.log("Loaded File Content:", content); // Debugging

    // If it's an HTML file, try extracting Markdown
    if (filename.endsWith(".html")) {
      console.log("🔍 HTML file detected. Extracting Markdown...");
  
      //Extract Markdown from HTML comments (if available)
      const markdownMatch = content.match(/<!-- Markdown Content:\s*([\s\S]*?)\s*-->/);
      if (markdownMatch) {
        const extractedMarkdown = markdownMatch[1].trim();
        console.log("Extracted Markdown:", extractedMarkdown);
        updateMarkdown(extractedMarkdown); // Load extracted Markdown into editor
        return;
      } else {
        console.warn("No embedded Markdown found in the HTML file.");
        updateMarkdown("<!-- Cannot extract original Markdown. Editing raw HTML instead. -->\n\n" + content);
        return;
      }
    }
  
    //If it's a Markdown file, load as-is
    updateMarkdown(content); 
};