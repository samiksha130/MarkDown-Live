import React from "react";
import { Dropdown} from "react-bootstrap";


const SaveDropdown = ({ saveFile }) => {
  return (
    <Dropdown drop="end">
      <Dropdown.Toggle as={Dropdown.Item}>Save</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => saveFile("md")}>Save as Markdown (.md)</Dropdown.Item>
        <Dropdown.Item onClick={() => saveFile("html")}>Save as HTML (.html)</Dropdown.Item>
        <Dropdown.Item onClick={() => saveFile("txt")}>Save as Plain Text (.txt)</Dropdown.Item>
        <Dropdown.Item onClick={() => saveFile("pdf")}>Save as PDF (.pdf)</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SaveDropdown;
