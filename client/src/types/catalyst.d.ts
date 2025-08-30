declare global {
  interface Window {
    catalyst?: {
      auth?: {
        signIn: (elementId: string) => void;
        signOut: (redirectPath: string) => void;
      };
    };
  }
}

export {};
