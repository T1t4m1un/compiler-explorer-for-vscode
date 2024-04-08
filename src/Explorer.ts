import path from 'path';
import * as vscode from 'vscode';
import { AxiosProxyConfig } from 'axios';
import { throttle } from 'lodash';

type ExplorerPanelProps = {
  proxy: AxiosProxyConfig | undefined;
  backendUrl: string | undefined;
};

class ExplorerPanel {
  panel: vscode.WebviewPanel | undefined;
  activeEditor: vscode.TextEditor | undefined;
  proxy!: AxiosProxyConfig | undefined;
  backendUrl: string | undefined;

  constructor(explorerPanelProps: ExplorerPanelProps) {
    this.proxy = explorerPanelProps.proxy;
    this.backendUrl = explorerPanelProps.backendUrl;
  }
  
  getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Webview</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="${this.panel!.webview.asWebviewUri(vscode.Uri.file(path.join(__dirname, 'webview.js')))}"></script>
      </body>
    </html>`;
  }

  updateEditorState() {
    const activeEditor = vscode.window.activeTextEditor;

    if (typeof activeEditor === 'undefined' || !activeEditor.document || !this.panel) {
      // do nothing
    } else {
      this.activeEditor = activeEditor;
      const backendUrl = this.backendUrl;

      const languageId = activeEditor.document.languageId;
      const source = vscode.window.activeTextEditor?.document.getText();
      const proxy = this.proxy;
      const lineNo = activeEditor.selection.active.line;

      this.panel.webview.postMessage({
        type: 'updateEditorState',
        content: { source, languageId, proxy, lineNo, backendUrl, }
      });
    }
  }

  handleMessage(message: any) {
    const activeEditor = this.activeEditor;

    if (typeof activeEditor === 'undefined' || !activeEditor.document || !this.panel) {
      // do nothing
    } else {
      switch (message.type) {
        case 'gotoLine': {
          const lineNo = message.content.asmSelectedLineNo as number;
          if (lineNo < 0 || lineNo >= activeEditor.document.lineCount) {
            break;
          }

          activeEditor.selection = new vscode.Selection(lineNo, 0, lineNo, 0);
          activeEditor.revealRange(
            new vscode.Range(lineNo, 0, lineNo, 0),
            vscode.TextEditorRevealType.InCenter
          );
          break;
        }
      }
    }
  }
  
  initPanel() {
    this.panel = vscode.window.createWebviewPanel(
      'compilerExplorer',
      'Compiler Explorer',
      vscode.ViewColumn.Beside,
      { enableScripts: true, }
    );
    this.panel.webview.html = this.getWebviewContent();
    this.panel.webview.onDidReceiveMessage((message) => this.handleMessage(message));

    const updateEditorState = throttle(() => this.updateEditorState(), 500);

    updateEditorState();
    vscode.window.onDidChangeTextEditorSelection(updateEditorState);
  }
}

export default ExplorerPanel;
