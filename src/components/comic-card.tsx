import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

type Comic = {
  id: string;
  title: string;
  series: string;
  coverUrl: string;
  aiHint: string;
};

type ComicCardProps = {
  comic: Comic;
};

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link href={`/read/${comic.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary">
        <div className="aspect-[2/3] relative">
          <Image
            src={comic.coverUrl}
            alt={`Cover of ${comic.title}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={comic.aiHint}
          />
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
  );
}
