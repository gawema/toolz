'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/lib/context/auth-context"

type Software = {
  id: string
  name: string
  description: string
  category: string
  price: number
  rating: number
}

export function Page() {
  const { user } = useAuth()
  const [softwares, setSoftwares] = useState<Software[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [rating, setRating] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSoftwares()
  }, [])

  const fetchSoftwares = () => {
    // This is a mock function. In a real app, you'd fetch from an API or database
    const mockSoftwares: Software[] = [
      { id: '1', name: 'Slack', description: 'Team communication tool', category: 'Communication', price: 12.50, rating: 4.5 },
      { id: '2', name: 'Trello', description: 'Project management tool', category: 'Productivity', price: 10, rating: 4.2 },
      { id: '3', name: 'Zoom', description: 'Video conferencing tool', category: 'Communication', price: 14.99, rating: 4.3 },
    ]
    setSoftwares(mockSoftwares)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      // Update existing software
      setSoftwares(softwares.map(sw => 
        sw.id === editingId ? { ...sw, name, description, category, price: parseFloat(price), rating: parseFloat(rating) } : sw
      ))
      setEditingId(null)
    } else {
      // Add new software
      const newSoftware: Software = {
        id: Date.now().toString(),
        name,
        description,
        category,
        price: parseFloat(price),
        rating: parseFloat(rating)
      }
      setSoftwares([...softwares, newSoftware])
    }
    // Reset form
    setName('')
    setDescription('')
    setCategory('')
    setPrice('')
    setRating('')
  }

  const handleDelete = (id: string) => {
    setSoftwares(softwares.filter(sw => sw.id !== id))
  }

  const handleEdit = (software: Software) => {
    setEditingId(software.id)
    setName(software.name)
    setDescription(software.description)
    setCategory(software.category)
    setPrice(software.price.toString())
    setRating(software.rating.toString())
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex h-16 items-center justify-between">
            <div className="text-xl font-semibold">SaaS Software Tracker</div>
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
          <h1 className="text-2xl font-bold mb-4">SaaS Software Tracker</h1>
          
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
            <Button type="submit" className="mt-4">{editingId ? 'Update' : 'Add'} Software</Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {softwares.map(software => (
              <Card key={software.id}>
                <CardHeader>
                  <CardTitle>{software.name}</CardTitle>
                  <CardDescription>{software.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{software.description}</p>
                  <p className="mt-2">Price: ${software.price}/month</p>
                  <p>Rating: {software.rating}/5</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleEdit(software)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(software.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}