'use client'

import React, { useState, useEffect } from 'react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/context/auth-context"
import { Software } from "@/types/software"
import { getSoftwares, addSoftware, updateSoftware, deleteSoftware, updateSoftwareOrder } from "@/lib/firebase/firestore"
import { toast } from "sonner"
import { SoftwareCard } from "./software-card"

export function Page() {
  const { user } = useAuth()
  const [softwares, setSoftwares] = useState<Software[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [rating, setRating] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchSoftwares = React.useCallback(async () => {
    try {
      if (!user) return
      const data = await getSoftwares(user.uid)
      setSoftwares(data)
    } catch (error) {
      console.error('Error fetching softwares:', error)
      toast.error('Failed to load softwares')
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchSoftwares()
    }
  }, [user, fetchSoftwares])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      if (editingId) {
        // Update existing software
        await updateSoftware(editingId, {
          name,
          description,
          category,
          price: parseFloat(price),
          rating: parseFloat(rating),
          updatedAt: new Date()
        })
        toast.success('Software updated successfully')
      } else {
        // Add new software
        const newSoftware: Omit<Software, 'id'> = {
          userId: user.uid,
          name,
          description,
          category,
          price: parseFloat(price),
          rating: parseFloat(rating),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        await addSoftware(newSoftware)
        toast.success('Software added successfully')
      }
      
      // Refresh the list
      fetchSoftwares()
      
      // Reset form
      setName('')
      setDescription('')
      setCategory('')
      setPrice('')
      setRating('')
      setEditingId(null)
    } catch (error) {
      console.error('Error saving software:', error)
      toast.error('Failed to save software')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSoftware(id)
      toast.success('Software deleted successfully')
      fetchSoftwares()
    } catch (error) {
      console.error('Error deleting software:', error)
      toast.error('Failed to delete software')
    }
  }

  const handleEdit = (software: Software) => {
    setEditingId(software.id)
    setName(software.name)
    setDescription(software.description)
    setCategory(software.category)
    setPrice(software.price.toString())
    setRating(software.rating.toString())
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSoftwares((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Save the new order to Firestore
        updateSoftwareOrder(newItems).catch((error) => {
          console.error('Error saving order:', error)
          toast.error('Failed to save order')
        })

        return newItems
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 items-center justify-between">
            <div className="text-xl font-semibold">Tuulz</div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.displayName}
              </span>
              <UserNav />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold mb-4 uppercase">Add new Tool</h1>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price ($/month)</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input id="rating" type="number" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} required />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="mt-4">{editingId ? 'Update' : 'Add'} Tool</Button>
          </form>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={softwares.map(s => s.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {softwares.map(software => (
                  <SoftwareCard
                    key={software.id}
                    software={software}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </main>
    </div>
  )
}