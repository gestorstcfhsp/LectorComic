
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Sparkles, Loader2, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { extractComicMetadata } from "@/ai/flows/extract-comic-metadata-flow"
import type { ExtractComicMetadataOutput } from "@/ai/flows/extract-comic-metadata-flow"
import { generateComicCover } from "@/ai/flows/generate-comic-cover-flow"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { Comic } from "@/lib/db"

const toDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const dataUriToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
};

const initialFormData = {
    title: '',
    author: '',
    series: '',
    type: 'Cómic',
    tags: [],
    description: '',
    file: null,
};

type ComicDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: Partial<ExtractComicMetadataOutput & { file: File | Blob | null; type: string }>, id?: string) => void;
  comicToEdit?: Comic | null;
};

export function AddComicDialog({ isOpen, onOpenChange, onSave, comicToEdit }: ComicDialogProps) {
  const isEditing = !!comicToEdit;
  const [formData, setFormData] = useState<Partial<ExtractComicMetadataOutput & { file: File | Blob | null; type: string }>>(initialFormData);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen && comicToEdit) {
      setFormData({
        title: comicToEdit.title,
        author: comicToEdit.author,
        series: comicToEdit.series,
        description: comicToEdit.description,
        tags: comicToEdit.tags,
        type: comicToEdit.type,
        file: comicToEdit.file,
      });
    }
  }, [isOpen, comicToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData(prev => ({ ...prev, file }));
  }

  const handleExtract = async () => {
    if (!formData.file || !(formData.file instanceof File) || !formData.file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, selecciona un archivo de imagen de portada para extraer los datos.",
      });
      return;
    }
    
    setIsExtracting(true);
    try {
      const dataUri = await toDataUri(formData.file);
      const result = await extractComicMetadata({
        comicCover: dataUri,
        filename: formData.file.name,
      });
      
      setFormData(prev => ({
        ...prev,
        title: result.title,
        author: result.author,
        series: result.series,
        description: result.description,
        type: result.type || 'Cómic',
        tags: result.tags,
      }));

      toast({
        title: "Datos Extraídos",
        description: "La información del cómic ha sido rellenada. Por favor, revísala.",
      });

    } catch (error) {
      console.error("Error extracting metadata:", error);
      toast({
        variant: "destructive",
        title: "Error de Extracción",
        description: "No se pudieron extraer los datos del cómic. Por favor, inténtalo de nuevo o introduce los datos manualmente.",
      });
    } finally {
      setIsExtracting(false);
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: id === 'tags' ? value.split(',').map(t => t.trim()) : value }));
  }

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  }
  
  const handleGenerateCover = async () => {
    if (!formData.title) {
      toast({
        variant: "destructive",
        title: "Falta el Título",
        description: "Por favor, introduce un título para generar la portada.",
      });
      return;
    }
    
    setIsGeneratingCover(true);
    try {
      const result = await generateComicCover({
        title: formData.title,
        description: formData.description || '',
      });
      
      const generatedFile = await dataUriToFile(result.coverImageDataUri, `${formData.title.replace(/\s/g, '_')}-cover.png`);

      setFormData(prev => ({
        ...prev,
        file: generatedFile,
      }));

      toast({
        title: "Portada Generada",
        description: "Se ha generado una nueva portada con IA y se ha adjuntado como el archivo del cómic.",
      });

    } catch (error) {
      console.error("Error generating cover:", error);
      toast({
        variant: "destructive",
        title: "Error de Generación",
        description: "No se pudo generar la portada. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsGeneratingCover(false);
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData, comicToEdit?.id);
    onOpenChange(false);
  }

  const handleDialogStateChange = (openState: boolean) => {
    if (!openState) {
      setFormData(initialFormData);
      setIsExtracting(false);
      setIsGeneratingCover(false);
    }
    onOpenChange(openState);
  }

  const isExtractDisabled = isExtracting || !formData.file || !(formData.file instanceof File) || !formData.file.type.startsWith('image/');

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle className="font-headline">{isEditing ? "Editar Cómic" : "Añadir Nuevo Cómic"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Modifica los detalles de tu cómic." : "Introduce los detalles de tu cómic o sube su portada para que la IA los extraiga."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cover">Archivo del Cómic (.cbr, .pdf, o imagen de portada)</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="cover" 
                  type="file" 
                  className="flex-grow"
                  accept="image/*,.cbr,.cbz,.pdf"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={handleExtract} 
                  disabled={isExtractDisabled}
                  aria-label="Extraer datos con IA"
                >
                  {isExtracting ? <Loader2 className="animate-spin" /> : <Wand2 />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Sube una imagen de portada para activar la extracción con IA.</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input id="title" placeholder="p.ej., The Dark Knight Returns" className="col-span-3" value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Autor
              </Label>
              <Input id="author" placeholder="p.ej., Frank Miller" className="col-span-3" value={formData.author} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="series" className="text-right">
                Saga/Serie
              </Label>
              <Input id="series" placeholder="p.ej., Batman" className="col-span-3" value={formData.series} onChange={handleInputChange}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Cómic">Cómic</SelectItem>
                      <SelectItem value="Manhwa">Manhwa</SelectItem>
                      <SelectItem value="Manga">Manga</SelectItem>
                      <SelectItem value="Novela Gráfica">Novela Gráfica</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Etiquetas
              </Label>
              <Input id="tags" placeholder="p.ej., superhéroe, clásico, dc" className="col-span-3" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Descripción
              </Label>
              <Textarea id="description" placeholder="Un breve resumen del cómic..." className="col-span-3" value={formData.description} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                  <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleGenerateCover}
                      disabled={isGeneratingCover || !formData.title}
                  >
                      {isGeneratingCover ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      {isGeneratingCover ? 'Generando...' : 'Generar Portada con IA'}
                  </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEditing ? "Guardar Cambios" : "Guardar Cómic"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
