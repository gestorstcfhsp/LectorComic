
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import type { Comic } from '@/lib/db';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
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
  onEdit: (comic: Comic) => void;
};

export function ComicCard({ comic, onDelete, onEdit }: ComicCardProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    
    if (comic.file && (comic.file instanceof File || comic.file instanceof Blob) && comic.file.type.startsWith('image/')) {
      url = URL.createObjectURL(comic.file);
      setCoverUrl(url);
    }

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
    <div className="group relative">
       <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(comic)}
            aria-label="Editar cómic"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
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
      </div>

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
                unoptimized={true}
              />
            ) : (
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
