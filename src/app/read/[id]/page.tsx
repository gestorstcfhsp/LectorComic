import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComicReaderPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="font-headline text-4xl">Comic Reader</h1>
        <p className="text-muted-foreground mt-2">
          Displaying comic with ID: {params.id}
        </p>
        <p className="mt-4 max-w-md">
          This is a placeholder for the integrated comic reader. Features like zoom, page-turning, and bookmarks will be available here.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
        </Button>
      </div>
    </div>
  );
}
