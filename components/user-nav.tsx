"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { useAuth } from "@/lib/context/auth-context"
import { auth } from "@/lib/firebase/config"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function UserNav() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (!user) return null

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.photoURL || undefined} 
              alt={user.displayName || "User avatar"} 
              className="object-cover"
            />
            <AvatarFallback className="text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "w-56"
          )}
          align="end"
          sideOffset={5}
        >
          <div className="px-2 py-1.5 text-sm font-semibold">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              Profile
            </DropdownMenuPrimitive.Item>
            <DropdownMenuPrimitive.Item
              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            >
              Settings
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>
          <DropdownMenuPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
          <DropdownMenuPrimitive.Item
            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600"
            onClick={handleSignOut}
          >
            Log out
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
} 