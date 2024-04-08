import * as vscode from 'vscode';
import ExplorerPanel from './Explorer';
import config from './config';


// Retrieves the proxy configuration from the VS Code settings.
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

const explorerPanel = new ExplorerPanel({
  proxy: proxyConfig,
  backendUrl: config.backendUrl,
});

const explorerDisposable = vscode.commands.registerCommand(
  'compiler-explorer-for-vscode.showExplorer',
  () => {
    explorerPanel.initPanel();
  }
);

function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(explorerDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
