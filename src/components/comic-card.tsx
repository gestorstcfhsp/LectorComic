
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import type { Comic } from '@/lib/db';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ComicCardProps = {
  comic: Comic;
  onDelete: (id: string, title: string) => void;
};

export function ComicCard({ comic, onDelete }: ComicCardProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    
    // We only create an object URL for image files
    if (comic.file && comic.file.type.startsWith('image/')) {
      url = URL.createObjectURL(comic.file);
      setCoverUrl(url);
    }

    // Cleanup function to revoke the object URL
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [comic.file]);

  const confirmDelete = () => {
    onDelete(comic.id, comic.title);
  };

  return (
    // The main wrapper is now a div, allowing the Link and AlertDialog to be siblings.
    <div className="group relative">
      <AlertDialog>
        {/* The trigger is an absolutely positioned button that appears on hover.
            It is NOT a child of the Link component, so clicking it won't trigger navigation. */}
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Eliminar cómic"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cómic
              "{comic.title}" de tu biblioteca.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* The entire card is now wrapped in the link, separate from the delete button trigger. */}
      <Link href={`/read/${comic.id}`} className="block">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary">
          <div className="aspect-[2/3] relative bg-muted">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`Portada de ${comic.title}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={comic.aiHint}
                unoptimized={true} // Necessary for blob URLs
              />
            ) : (
              // Placeholder for non-image files
              <div className="flex h-full w-full items-center justify-center p-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-50"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <h3 className="font-headline text-base truncate" title={comic.title}>
              {comic.title}
            </h3>
            {comic.series && (
              <p className="text-sm text-muted-foreground truncate" title={comic.series}>
                {comic.series}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
