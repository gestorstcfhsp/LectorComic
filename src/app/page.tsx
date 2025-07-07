
"use client";

import { Header } from '@/components/header';
import { ComicCard } from '@/components/comic-card';
import { AddComicDialog } from '@/components/add-comic-dialog';
import type { ExtractComicMetadataOutput } from '@/ai/flows/extract-comic-metadata-flow';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Comic } from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const comics = useLiveQuery(
    () => db.comics.orderBy('createdAt').reverse().toArray()
  );

  const handleAddComic = async (data: Partial<ExtractComicMetadataOutput & { file: File | null }>) => {
    if (!data.file || !data.title) return;

    const newComic: Comic = {
      id: crypto.randomUUID(),
      title: data.title,
      author: data.author || '',
      series: data.series || '',
      description: data.description || '',
      tags: data.tags || [],
      file: data.file,
      aiHint: data.title.toLowerCase().split(' ').slice(0, 2).join(' '),
      createdAt: new Date(),
    };

    try {
      await db.comics.add(newComic);
    } catch (error) {
      console.error("Failed to add comic to DB:", error);
      // Here you could use a toast to notify the user of the failure
    }
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
          {comics ? (
            comics.length > 0 ? (
              comics.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">Tu biblioteca está vacía. ¡Añade tu primer cómic!</p>
            )
          ) : (
            // Skeletons for loading state
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
