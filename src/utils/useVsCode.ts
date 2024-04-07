import { useEffect, useCallback } from 'react';

interface Message {
  type: string;
  content?: any;
}

export type MessageReceivedHandler = (message: Message) => void;

// @ts-ignore
const vscode = window.vscode || acquireVsCodeApi();
// @ts-ignore
window.vscode = vscode;

export function useVsCode(onMessageReceived: MessageReceivedHandler) {
  const sendMessage = useCallback((message: Message) => {
    vscode.postMessage(message);
  }, []);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (onMessageReceived) {
        onMessageReceived(event.data);
      }
    };

    window.addEventListener('message', messageHandler);

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [onMessageReceived]);

  return { sendMessage };
}
