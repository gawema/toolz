import { db } from "./config"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore"
import { Software } from "@/types/software" // We'll create this type file next

export async function getSoftwares(userId: string) {
  const q = query(collection(db, "softwares"), where("userId", "==", userId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Software[]
}

export async function addSoftware(software: Omit<Software, "id">) {
  return addDoc(collection(db, "softwares"), software)
}

export async function updateSoftware(id: string, software: Partial<Software>) {
  const docRef = doc(db, "softwares", id)
  return updateDoc(docRef, software)
}

export async function deleteSoftware(id: string) {
  const docRef = doc(db, "softwares", id)
  return deleteDoc(docRef)
} 