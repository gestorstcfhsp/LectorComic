
import Dexie, { type Table } from 'dexie';

export interface Comic {
  id: string;
  title: string;
  author: string;
  series: string;
  description: string;
  tags: string[];
  file: Blob; // The comic file (image, cbr, cbz, pdf)
  aiHint: string;
  createdAt: Date;
}

export class ComicDB extends Dexie {
  comics!: Table<Comic>; 

  constructor() {
    super('comicCloudReaderDB');
    this.version(1).stores({
      // Primary key and indexed props
      comics: 'id, title, series, createdAt' 
    });
  }
}

export const db = new ComicDB();
