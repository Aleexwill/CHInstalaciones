import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'carousel_slides'

export function useCarousel({ onlyActive = false } = {}) {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COL), orderBy('order'))

    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setSlides(onlyActive ? all.filter((s) => s.isActive) : all)
      setLoading(false)
    }, () => setLoading(false))

    return unsub
  }, [onlyActive])

  async function createSlide(data) {
    await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() })
  }

  async function updateSlide(id, data) {
    await updateDoc(doc(db, COL, id), data)
  }

  async function deleteSlide(id) {
    await deleteDoc(doc(db, COL, id))
  }

  return { slides, loading, createSlide, updateSlide, deleteSlide }
}
