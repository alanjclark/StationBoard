declare module 'stompit' {
  interface ConnectOptions {
    host: string;
    port: number;
    connectHeaders: Record<string, string>;
  }

  interface Message {
    readString(encoding: string, callback: (error?: Error, body?: string) => void): void;
  }

  export class Client {
    constructor(options: ConnectOptions);
    on(event: string, callback: (data?: any) => void): void;
    connect(callback: (error?: Error, stompClient?: any) => void): void;
    subscribe(headers: Record<string, string>, callback: (error?: Error, message?: Message) => void): void;
    disconnect(callback: () => void): void;
  }
  
  export interface Frame {
    headers: Record<string, string>;
    body: Buffer;
  }
}

