"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Software } from "@/types/software"

interface SoftwareCardProps {
  software: Software
  onEdit: (software: Software) => void
  onDelete: (id: string) => void
}

export function SoftwareCard({ software, onEdit, onDelete }: SoftwareCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: software.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      <div 
        className="absolute inset-0 bottom-[56px] cursor-move" 
        {...attributes} 
        {...listeners}
      />
      <CardHeader>
        <CardTitle>{software.name}</CardTitle>
        <CardDescription>{software.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{software.description}</p>
        <p className="mt-2">Price: ${software.price}/month</p>
        <p>Rating: {software.rating}/5</p>
      </CardContent>
      <CardFooter className="flex justify-between relative">
        <Button variant="outline" onClick={() => onEdit(software)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(software.id)}>Delete</Button>
      </CardFooter>
    </Card>
  )
} 