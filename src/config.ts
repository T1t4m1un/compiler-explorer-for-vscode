import * as vscode from 'vscode';


// Retrieves the user customized configuration from vsscode config 
const vscodeConfig = vscode.workspace.getConfiguration('compiler-explorer-for-vscode');

const config = {
  backendUrl: vscodeConfig.get('backendUrl') as string,
};

export default config;
