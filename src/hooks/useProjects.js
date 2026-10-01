import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'projects'

export function useProjects({ onlyActive = false } = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, COL), orderBy('order'))

    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setProjects(onlyActive ? all.filter((p) => p.isActive) : all)
      setLoading(false)
    }, () => setLoading(false))

    return unsub
  }, [onlyActive])

  async function createProject(data) {
    await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() })
  }

  async function updateProject(id, data) {
    await updateDoc(doc(db, COL, id), data)
  }

  async function deleteProject(id) {
    await deleteDoc(doc(db, COL, id))
  }

  return { projects, loading, createProject, updateProject, deleteProject }
}
