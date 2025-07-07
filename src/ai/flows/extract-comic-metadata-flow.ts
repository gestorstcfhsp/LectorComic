
'use server';
/**
 * @fileOverview An AI flow to extract metadata from a comic book cover.
 *
 * - extractComicMetadata - A function that handles the comic book metadata extraction.
 * - ExtractComicMetadataInput - The input type for the extractComicMetadata function.
 * - ExtractComicMetadataOutput - The return type for the extractComicMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExtractComicMetadataInputSchema = z.object({
  comicCover: z
    .string()
    .describe(
      "A photo of the comic book cover, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  filename: z.string().describe('The filename of the comic book.'),
});
export type ExtractComicMetadataInput = z.infer<typeof ExtractComicMetadataInputSchema>;

const ExtractComicMetadataOutputSchema = z.object({
  title: z.string().describe('The main title of the comic book.'),
  author: z
    .string()
    .describe(
      'The author(s) and/or artist(s) of the comic book. List multiple names separated by commas.'
    ),
  series: z
    .string()
    .describe(
      'The series this comic book belongs to. If it is a standalone issue or graphic novel, this can be empty.'
    ),
  description: z
    .string()
    .describe(
      'A short, one or two sentence summary or synopsis of the comic based on its cover and title.'
    ),
  type: z.string().describe('The type of comic, for example: "Cómic", "Manga", "Manhwa", or "Novela Gráfica".'),
  tags: z
    .array(z.string())
    .describe(
      'A list of relevant tags, such as genre (e.g., superhero, sci-fi, fantasy), publisher (e.g., Marvel, DC, Image), or key characters.'
    ),
});
export type ExtractComicMetadataOutput = z.infer<typeof ExtractComicMetadataOutputSchema>;

export async function extractComicMetadata(
  input: ExtractComicMetadataInput
): Promise<ExtractComicMetadataOutput> {
  return extractComicMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractComicMetadataPrompt',
  input: {schema: ExtractComicMetadataInputSchema},
  output: {schema: ExtractComicMetadataOutputSchema},
  prompt: `You are an expert comic book cataloger. Your task is to extract metadata from the cover of a comic book.

Analyze the provided cover image and filename to identify the following information:
- Title
- Author(s)/Artist(s)
- Series (if applicable)
- A brief description based on the cover art and title.
- The type of comic. It can be "Cómic" (for American/European style), "Manga" (Japanese), "Manhwa" (Korean), or "Novela Gráfica". If unsure, default to "Cómic".
- Relevant tags (genre, publisher, main characters).

If you cannot determine a piece of information, leave the corresponding field blank. Be as accurate as possible.

Filename: {{{filename}}}
Cover Image: {{media url=comicCover}}`,
});

const extractComicMetadataFlow = ai.defineFlow(
  {
    name: 'extractComicMetadataFlow',
    inputSchema: ExtractComicMetadataInputSchema,
    outputSchema: ExtractComicMetadataOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
