
"use client";

import React from 'react';
import { Header } from '@/components/header';
import { ComicCard } from '@/components/comic-card';
import { AddComicDialog } from '@/components/add-comic-dialog';
import type { ExtractComicMetadataOutput } from '@/ai/flows/extract-comic-metadata-flow';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Comic } from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';

export default function Home() {
  const comics = useLiveQuery(
    () => db.comics.orderBy('createdAt').reverse().toArray()
  );

  const handleAddComic = async (data: Partial<ExtractComicMetadataOutput & { file: File | null; type: string }>) => {
    if (!data.file || !data.title || !data.type) return;

    const newComic: Comic = {
      id: crypto.randomUUID(),
      title: data.title,
      author: data.author || '',
      series: data.series || '',
      description: data.description || '',
      tags: data.tags || [],
      type: data.type,
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

  const groupedComics = React.useMemo(() => {
    if (!comics) return {};
    
    const byType = comics.reduce((acc, comic) => {
        const type = comic.type || 'Sin Categoría';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(comic);
        return acc;
    }, {} as Record<string, Comic[]>);

    const result: Record<string, Record<string, Comic[]>> = {};

    for (const type in byType) {
        result[type] = byType[type].reduce((acc, comic) => {
            const series = comic.series || 'Tomos Únicos';
            if (!acc[series]) {
                acc[series] = [];
            }
            acc[series].push(comic);
            return acc;
        }, {} as Record<string, Comic[]>);
    }
    
    for (const type in result) {
      result[type] = Object.fromEntries(
        Object.entries(result[type]).sort(([seriesA], [seriesB]) => seriesA.localeCompare(seriesB))
      );
    }

    return Object.fromEntries(
        Object.entries(result).sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
    );
}, [comics]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <AddComicDialog onComicAdded={handleAddComic} />
      </Header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl md:text-4xl">Mi Biblioteca</h1>
          <p className="text-muted-foreground">
            Explora y gestiona tu colección de cómics por tipo y saga.
          </p>
        </div>
        {comics ? (
            comics.length > 0 && groupedComics ? (
              <Accordion type="multiple" className="w-full space-y-4" defaultValue={Object.keys(groupedComics)}>
                {Object.entries(groupedComics).map(([type, seriesGroup]) => (
                  <AccordionItem value={type} key={type} className="border-b-0">
                    <AccordionTrigger className="text-2xl font-headline px-4 bg-card rounded-md border hover:no-underline">
                      {type}
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 space-y-8">
                      {Object.entries(seriesGroup).map(([series, comicList]) => (
                        <Collapsible key={series} defaultOpen className="px-2">
                           <CollapsibleTrigger className="flex w-full items-center justify-between text-xl font-headline mb-4 border-b pb-2">
                             <span>{series}</span>
                             <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
                           </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                              {comicList.map((comic) => (
                                <ComicCard key={comic.id} comic={comic} />
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="col-span-full text-center text-muted-foreground">Tu biblioteca está vacía. ¡Añade tu primer cómic!</p>
            )
          ) : (
            // Skeletons for loading state
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-14 w-1/3 rounded-lg" />
                   <div className="px-2 space-y-6">
                      <Skeleton className="h-8 w-1/4" />
                       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="space-y-2">
                            <Skeleton className="aspect-[2/3] w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}
