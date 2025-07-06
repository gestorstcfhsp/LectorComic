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
          Add Comic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Comic</DialogTitle>
          <DialogDescription>
            Enter the details for your new comic book.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" placeholder="e.g., The Dark Knight Returns" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input id="author" placeholder="e.g., Frank Miller" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="series" className="text-right">
              Saga/Series
            </Label>
            <Input id="series" placeholder="e.g., Batman" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input id="tags" placeholder="e.g., superhero, classic, dc" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="cover" className="text-right">
              File
            </Label>
            <Input id="cover" type="file" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" placeholder="A short summary of the comic..." className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <div className="col-start-2 col-span-3">
                <Button variant="outline" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Cover with AI
                </Button>
             </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Comic</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
