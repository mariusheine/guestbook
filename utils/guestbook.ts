export interface Page {
  author?: string;
  content: string;
  image: string;
  imageContext: string;
  createdAt: string;
}

export interface Guestbook {
  id: string;
  title: string;
  pages: Page[];
  description?: string;
}