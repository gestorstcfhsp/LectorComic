
import { Header } from '@/components/header';
import { ComicCard } from '@/components/comic-card';
import { AddComicDialog } from '@/components/add-comic-dialog';

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

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header>
        <AddComicDialog />
      </Header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl md:text-4xl">Mi Biblioteca</h1>
          <p className="text-muted-foreground">
            Explora y gestiona tu colección de cómics.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          {mockComics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </main>
    </div>
  );
}
