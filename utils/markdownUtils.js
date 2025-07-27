// // Function to add markdown syntax
// const applyMarkdown = (syntax) => {
//     let addition = syntax;
//     if (syntax === "bold") addition = "**bold**";
//     if (syntax === "UnderLine") addition = "<u>UnderLine</u>";
//     if (syntax === "strikethrough") addition = "~strikethrough~";
//     if (syntax === "italic") addition = "_italic_";
//     if (syntax === "heading") addition = "# Heading";
//     if (syntax === "list-ul") addition = "- List Item";
//     if (syntax === "list-ol") addition = "1. Ordered Item";
//     if (syntax === "link") addition = "[Link](https://example.com)";
//     if (syntax === "image") addition = "![Alt text](image.jpg)";
//     if (syntax === "table") addition = "| Col1 | Col2 |\n|------|------|\n| Val1 | Val2 |";
export const applyMarkdown = (syntax) => {
    const mappings = {
      bold: "**bold**",
      italic: "_italic_",
      underline: "<u>UnderLine</u>",
      strikethrough: "~~strikethrough~~",
      heading: "# Heading",
      listUl: "- List Item",
      listOl: "1. Ordered Item",
      link: "[Link](https://example.com)",
      image: "![Alt text](image.jpg)",
      table: "| Col1 | Col2 |\n|------|------|\n| Val1 | Val2 |"
    };
    return mappings[syntax] || "";
  };
  
  export const applyAlignment = (alignment) => {
    const alignments = {
      left: "<div style='text-align: left;'>Align Left Text</div>",
      center: "<div style='text-align: center;'>Align Center Text</div>",
      right: "<div style='text-align: right;'>Align Right Text</div>"
    };
    return alignments[alignment] || "";
  }; 