
"use client";

import { useState } from 'react';
import { Header } from '@/components/header';
import { ComicCard } from '@/components/comic-card';
import { AddComicDialog } from '@/components/add-comic-dialog';
import type { ExtractComicMetadataOutput } from '@/ai/flows/extract-comic-metadata-flow';

const mockComics = [
  {
    id: '1',
    title: 'The Amazing Spider-Man',
    series: 'Vol. 1',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['superhero', 'marvel'],
    aiHint: 'spider man comic',
  },
  {
    id: '2',
    title: 'Saga',
    series: 'Chapter One',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['sci-fi', 'fantasy', 'image'],
    aiHint: 'fantasy battle',
  },
  {
    id: '3',
    title: 'Batman: The Long Halloween',
    series: '',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['detective', 'dc'],
    aiHint: 'dark detective',
  },
  {
    id: '4',
    title: 'Monstress',
    series: 'Vol. 1: Awakening',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['fantasy', 'steampunk'],
    aiHint: 'art deco monster',
  },
  {
    id: '5',
    title: 'Paper Girls',
    series: 'Vol. 1',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['sci-fi', 'mystery'],
    aiHint: '80s newspaper girls',
  },
  {
    id: '6',
    title: 'Invincible',
    series: 'Compendium One',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['superhero', 'image'],
    aiHint: 'superhero fight',
  },
  {
    id: '7',
    title: 'Watchmen',
    series: '',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['superhero', 'classic'],
    aiHint: 'smiley face blood',
  },
  {
    id: '8',
    title: 'The Wicked + The Divine',
    series: 'Vol. 1: The Faust Act',
    coverUrl: 'https://placehold.co/400x600',
    tags: ['fantasy', 'modern'],
    aiHint: 'pop star gods',
  },
];

type Comic = {
  id: string;
  title: string;
  series: string;
  coverUrl: string;
  tags: string[];
  aiHint: string;
};

export default function Home() {
  const [comics, setComics] = useState<Comic[]>(mockComics);

  const handleAddComic = (data: Partial<ExtractComicMetadataOutput & { file: File | null }>) => {
    if (!data.file || !data.title) return;

    // En una app real, subirías el archivo a un servicio de almacenamiento
    // para obtener una URL persistente. Para esta demo, usamos una URL de objeto temporal.
    const coverUrl = URL.createObjectURL(data.file);
    
    const newComic: Comic = {
      id: new Date().toISOString(),
      title: data.title,
      series: data.series || '',
      coverUrl: coverUrl,
      tags: data.tags || [],
      aiHint: data.title.toLowerCase().split(' ').slice(0, 2).join(' '),
    };

    setComics(prevComics => [newComic, ...prevComics]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <AddComicDialog onComicAdded={handleAddComic} />
      </Header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl md:text-4xl">Mi Biblioteca</h1>
          <p className="text-muted-foreground">
            Explora y gestiona tu colección de cómics.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </main>
    </div>
  );
}
