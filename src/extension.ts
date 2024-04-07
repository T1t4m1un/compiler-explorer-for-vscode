import * as vscode from 'vscode';
import ExplorerPanel from './Explorer';
import API from './utils/api';


const proxyConfig = (() => {
  const vscodeProxy = vscode.workspace.getConfiguration('http').get('proxy');
  if (typeof vscodeProxy !== 'string') {
    return undefined;
  }
  const url = new URL(vscodeProxy);
  return {
    host: url.hostname,
    port: parseInt(url.port),
    protocol: url.protocol,
  };
}) ();

const api = new API(proxyConfig);

const outputChannel = vscode.window.createOutputChannel('Compiler Explorer');
api.setErrorLogger(error => outputChannel.appendLine(error.message));

const explorerPanel = new ExplorerPanel({ api, proxy: proxyConfig });

const explorerDisposable = vscode.commands.registerCommand(
  'compiler-explorer-for-vscode.showExplorer',
  () => { explorerPanel.initPanel(); }
);

function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(explorerDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
