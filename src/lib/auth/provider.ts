export interface AuthSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  expires: string;
}

export interface AuthProvider {
  /**
   * Retrieves the current active session.
   * Server-side only.
   */
  getSession(): Promise<AuthSession | null>;
}
