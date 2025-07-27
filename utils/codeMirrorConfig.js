import { markdown } from "@codemirror/lang-markdown";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { history, historyKeymap } from "@codemirror/commands";

export const getCodeMirrorConfig = () => ({
  extensions: [
    markdown(), //Markdown support
    EditorView.lineWrapping, // Wrap long lines
  ],
  theme: "light",
  lineNumbers: true, // Show line numbers
});
const state = EditorState.create({
  doc: "Your initial text...",
  extensions: [
      history(), //history tracking is enabled
      keymap.of([...historyKeymap]) //Enable Ctrl+Z & Ctrl+Y shortcuts
  ]
});
