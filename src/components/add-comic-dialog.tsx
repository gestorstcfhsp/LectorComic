
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Sparkles, Loader2, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { extractComicMetadata } from "@/ai/flows/extract-comic-metadata-flow"
import type { ExtractComicMetadataOutput } from "@/ai/flows/extract-comic-metadata-flow"

const toDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const initialFormData = {
    title: '',
    author: '',
    series: '',
    tags: [],
    description: '',
    file: null,
};

type AddComicDialogProps = {
  onComicAdded: (data: Partial<ExtractComicMetadataOutput & { file: File | null }>) => void;
};

export function AddComicDialog({ onComicAdded }: AddComicDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ExtractComicMetadataOutput & { file: File | null }>>(initialFormData);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData(prev => ({ ...prev, file }));
  }

  const handleExtract = async () => {
    if (!formData.file || !formData.file.type.startsWith('image/')) {
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.file || !formData.title) {
      toast({
        variant: "destructive",
        title: "Faltan datos",
        description: "El título y el archivo del cómic son obligatorios.",
      });
      return;
    }
    
    onComicAdded(formData);
    
    toast({
      title: "Cómic añadido",
      description: `"${formData.title}" se ha añadido a tu biblioteca.`,
    });

    setOpen(false);
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFormData(initialFormData);
      setIsExtracting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Cómic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle className="font-headline">Añadir Nuevo Cómic</DialogTitle>
            <DialogDescription>
              Introduce los detalles de tu cómic o sube su portada para que la IA los extraiga.
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
                  disabled={isExtracting || !formData.file || !formData.file.type.startsWith('image/')}
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
                  <Button type="button" variant="outline" className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar Portada con IA
                  </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Cómic</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
