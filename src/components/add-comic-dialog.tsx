"use client"

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
import { PlusCircle, Sparkles } from "lucide-react"

export function AddComicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Cómic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Añadir Nuevo Cómic</DialogTitle>
          <DialogDescription>
            Introduce los detalles de tu nuevo cómic.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input id="title" placeholder="p.ej., The Dark Knight Returns" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Autor
            </Label>
            <Input id="author" placeholder="p.ej., Frank Miller" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="series" className="text-right">
              Saga/Serie
            </Label>
            <Input id="series" placeholder="p.ej., Batman" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Etiquetas
            </Label>
            <Input id="tags" placeholder="p.ej., superhéroe, clásico, dc" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="cover" className="text-right">
              Archivo
            </Label>
            <Input id="cover" type="file" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Textarea id="description" placeholder="Un breve resumen del cómic..." className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <div className="col-start-2 col-span-3">
                <Button variant="outline" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Portada con IA
                </Button>
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Guardar Cómic</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
