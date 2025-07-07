import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComicReaderPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-headline text-4xl">Lector de Cómics</h1>
        <p className="text-muted-foreground mt-2">
          Mostrando cómic con ID: {params.id}
        </p>
        <p className="mt-4 max-w-md">
          Este es un marcador de posición para el lector de cómics integrado. Funciones como zoom, cambio de página y marcadores estarán disponibles aquí.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Biblioteca
          </Link>
        </Button>
      </div>
    </div>
  );
}
