'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser, updatePermissions, deleteUser, resetUserPassword } from './actions'

type User = {
  id: string
  username: string
  isAdmin: boolean
  canViewInventory: boolean
  canManageSystem: boolean
  canAddStock: boolean
  canDrawToProject: boolean
  canConsume: boolean
  createdAt: Date
}

export default function UserClientPage({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pwdInputs, setPwdInputs] = useState<Record<string, string>>({})
  const [pwdMessages, setPwdMessages] = useState<Record<string, { ok: boolean; text: string }>>({})

  const handleToggle = async (userId: string, field: keyof User, currentValue: boolean) => {
    const userToUpdate = users.find(u => u.id === userId)
    if (!userToUpdate) return

    const newData = {
      isAdmin: userToUpdate.isAdmin,
      canViewInventory: userToUpdate.canViewInventory,
      canManageSystem: userToUpdate.canManageSystem,
      canAddStock: userToUpdate.canAddStock,
      canDrawToProject: userToUpdate.canDrawToProject,
      canConsume: userToUpdate.canConsume,
      [field]: !currentValue
    }

    setUsers(users.map(u => u.id === userId ? { ...u, [field]: !currentValue } : u))
    
    const res = await updatePermissions(userId, newData)
    if (res?.error) {
       alert(res.error)
       setUsers(initialUsers) // revert
    } else {
        router.refresh()
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return
    setLoading(true)
    const res = await deleteUser(userId)
    if (res?.error) {
        alert(res.error)
    } else {
        router.refresh()
    }
    setLoading(false)
  }

  const handlePasswordReset = async (userId: string) => {
    const newPwd = pwdInputs[userId] || ''
    const res = await resetUserPassword(userId, newPwd)
    if (res?.error) {
      setPwdMessages(prev => ({ ...prev, [userId]: { ok: false, text: res.error! } }))
    } else {
      setPwdMessages(prev => ({ ...prev, [userId]: { ok: true, text: 'Şifre güncellendi!' } }))
      setPwdInputs(prev => ({ ...prev, [userId]: '' }))
      setTimeout(() => setPwdMessages(prev => { const n = {...prev}; delete n[userId]; return n }), 3000)
    }
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const res = await createUser(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Kullanıcı & Yetki Yönetimi</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2.5fr)', gap: '24px' }}>
        {/* User Create Form */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Yeni Kullanıcı</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>Kullanıcı Adı</label>
              <input name="username" required type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>Şifre</label>
              <input name="password" required type="text" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
            </div>

            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Başlangıç Yetkileri</p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input type="checkbox" name="canViewInventory" defaultChecked /> Envanteri Görüntüleme
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input type="checkbox" name="canAddStock" /> Stok Ekleme (Giriş)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input type="checkbox" name="canDrawToProject" /> Projeye Malzeme Çekme
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input type="checkbox" name="canConsume" /> Malzeme Tüketme (Arşiv)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input type="checkbox" name="canManageSystem" /> Sistem Yönetimi (Kategori/Konum)
                </label>
            </div>

            {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>{error}</div>}
            
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '8px', justifyContent: 'center' }}>
              {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
            </button>
          </form>
        </div>

        {/* Users List & Permissions Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {users.map(user => (
            <div key={user.id} style={{ backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {user.username} 
                        {user.isAdmin && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Admin</span>}
                        {user.id === currentUserId && <span style={{ fontSize: '0.7rem', background: 'var(--success)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Sen</span>}
                    </h3>
                </div>
                {user.id !== currentUserId && (
                    <button onClick={() => handleDelete(user.id)} disabled={loading} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Sil</button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', opacity: user.isAdmin ? 0.5 : 1 }}>
                    <input type="checkbox" checked={user.canViewInventory} disabled={user.isAdmin} onChange={() => handleToggle(user.id, 'canViewInventory', user.canViewInventory)} /> 
                    Envanteri Görüntüleme
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', opacity: user.isAdmin ? 0.5 : 1 }}>
                    <input type="checkbox" checked={user.canAddStock} disabled={user.isAdmin} onChange={() => handleToggle(user.id, 'canAddStock', user.canAddStock)} /> 
                    Stok Ekleme
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', opacity: user.isAdmin ? 0.5 : 1 }}>
                    <input type="checkbox" checked={user.canDrawToProject} disabled={user.isAdmin} onChange={() => handleToggle(user.id, 'canDrawToProject', user.canDrawToProject)} /> 
                    Projeye Malzeme Çekme
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', opacity: user.isAdmin ? 0.5 : 1 }}>
                    <input type="checkbox" checked={user.canConsume} disabled={user.isAdmin} onChange={() => handleToggle(user.id, 'canConsume', user.canConsume)} /> 
                    Malzeme Tüketme
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', opacity: user.isAdmin ? 0.5 : 1 }}>
                    <input type="checkbox" checked={user.canManageSystem} disabled={user.isAdmin} onChange={() => handleToggle(user.id, 'canManageSystem', user.canManageSystem)} /> 
                    Sistem Yönetimi
                </label>
                
                {user.id !== currentUserId && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--danger)', marginTop: '8px', gridColumn: '1 / -1' }}>
                        <input type="checkbox" checked={user.isAdmin} onChange={() => handleToggle(user.id, 'isAdmin', user.isAdmin)} /> 
                        <b>Tam Admin Yetkisi (Tehlikeli)</b>
                    </label>
                )}
              </div>

              {/* Password Reset Section */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Yeni Şifre:</span>
                <input
                  type="text"
                  value={pwdInputs[user.id] || ''}
                  onChange={e => setPwdInputs(prev => ({ ...prev, [user.id]: e.target.value }))}
                  placeholder="Yeni şifre girin..."
                  style={{ flex: 1, minWidth: '160px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
                />
                <button
                  onClick={() => handlePasswordReset(user.id)}
                  disabled={!pwdInputs[user.id]}
                  style={{ padding: '6px 14px', borderRadius: '6px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.875rem', opacity: pwdInputs[user.id] ? 1 : 0.4 }}
                >
                  Güncelle
                </button>
                {pwdMessages[user.id] && (
                  <span style={{ fontSize: '0.8rem', color: pwdMessages[user.id].ok ? 'var(--success)' : 'var(--danger)' }}>
                    {pwdMessages[user.id].text}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
