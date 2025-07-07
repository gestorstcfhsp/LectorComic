'use server';
/**
 * @fileOverview An AI flow to generate a comic book cover image.
 *
 * - generateComicCover - A function that handles the comic book cover generation.
 * - GenerateComicCoverInput - The input type for the generateComicCover function.
 * - GenerateComicCoverOutput - The return type for the generateComicCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateComicCoverInputSchema = z.object({
  title: z.string().describe('The title of the comic book.'),
  description: z
    .string()
    .optional()
    .describe('A short description of the comic book.'),
});
export type GenerateComicCoverInput = z.infer<
  typeof GenerateComicCoverInputSchema
>;

const GenerateComicCoverOutputSchema = z.object({
  coverImageDataUri: z
    .string()
    .describe(
      "The generated comic book cover image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateComicCoverOutput = z.infer<
  typeof GenerateComicCoverOutputSchema
>;

export async function generateComicCover(
  input: GenerateComicCoverInput
): Promise<GenerateComicCoverOutput> {
  return generateComicCoverFlow(input);
}

const generateComicCoverFlow = ai.defineFlow(
  {
    name: 'generateComicCoverFlow',
    inputSchema: GenerateComicCoverInputSchema,
    outputSchema: GenerateComicCoverOutputSchema,
  },
  async (input) => {
    const prompt = `Generate a dynamic and exciting comic book cover.
    
    Style: Evoke the style of modern American comic books. Use bold lines, dynamic poses, and a vibrant color palette.
    Title: "${input.title}"
    ${input.description ? `Description: ${input.description}` : ''}
    
    The title should be prominently displayed. Do not include any other text unless it's part of the title.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return {coverImageDataUri: media.url};
  }
);
