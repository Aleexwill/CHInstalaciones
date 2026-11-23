import { useState, useEffect } from 'react'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

// Returns: undefined (loading) | null (sin acceso) | 'propietario' | 'colaborador'
export function useAdminRole(user) {
  const [role, setRole] = useState(undefined)

  useEffect(() => {
    if (user === undefined) return
    if (!user) { setRole(null); return }

    let cancelled = false

    async function fetchRole() {
      try {
        console.log('[useAdminRole] fetching uid:', user.uid)
        const snap = await getDoc(doc(db, 'admin_users', user.uid))
        if (cancelled) return
        console.log('[useAdminRole] doc exists:', snap.exists(), snap.exists() ? snap.data() : null)
        if (snap.exists()) { setRole(snap.data().role ?? 'colaborador'); return }

        const workersSnap = await getDocs(
          query(collection(db, 'workers'), where('uid', '==', user.uid))
        )
        if (!cancelled) setRole(workersSnap.empty ? null : 'colaborador')
      } catch (err) {
        console.error('[useAdminRole] error:', err)
        if (!cancelled) setRole(null)
      }
    }

    fetchRole()
    return () => { cancelled = true }
  }, [user?.uid])

  return role
}
