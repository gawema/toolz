import { db } from "./config"
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  writeBatch 
} from "firebase/firestore"
import { Software } from "@/types/software"

export async function getSoftwares(userId: string) {
  const q = query(
    collection(db, "softwares"), 
    where("userId", "==", userId),
    orderBy("order", "asc")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Software[]
}

export async function addSoftware(software: Omit<Software, "id">) {
  const q = query(collection(db, "softwares"), where("userId", "==", software.userId))
  const querySnapshot = await getDocs(q)
  const order = querySnapshot.size

  return addDoc(collection(db, "softwares"), {
    ...software,
    order
  })
}

export async function updateSoftware(id: string, software: Partial<Software>) {
  const docRef = doc(db, "softwares", id)
  return updateDoc(docRef, software)
}

export async function updateSoftwareOrder(softwares: Software[]) {
  const batch = writeBatch(db)
  
  softwares.forEach((software, index) => {
    const docRef = doc(db, "softwares", software.id)
    batch.update(docRef, { order: index })
  })

  return batch.commit()
}

export async function deleteSoftware(id: string) {
  const docRef = doc(db, "softwares", id)
  return deleteDoc(docRef)
} 