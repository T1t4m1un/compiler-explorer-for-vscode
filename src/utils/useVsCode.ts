import { useEffect, useCallback } from 'react';

interface Message {
  type: string;
  content?: any;
}

export type MessageReceivedHandler = (message: Message) => void;

export function useVsCode(onMessageReceived: MessageReceivedHandler) {
  const sendMessage = useCallback((message: Message) => {
    // @ts-ignore
    const vscode = acquireVsCodeApi();
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
