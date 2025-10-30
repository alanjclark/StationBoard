declare module 'stompit' {
  interface ConnectOptions {
    host: string;
    port: number;
    connectHeaders: Record<string, string>;
  }

  interface Message {
    readString(encoding: string, callback: (error?: Error, body?: string) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
    read(): Buffer | null;
  }

  export function connect(options: ConnectOptions, callback: (error?: Error, client?: any) => void): void;

  export class Client {
    constructor(options: ConnectOptions);
    on(event: string, callback: (data?: any) => void): void;
    connect(callback: (error?: Error, stompClient?: any) => void): void;
    subscribe(headers: Record<string, string>, callback: (error?: Error, message?: Message) => void): void;
    disconnect(callback: () => void): void;
    ack(message: Message): void;
  }
  
  export interface Frame {
    headers: Record<string, string>;
    body: Buffer;
  }
}

