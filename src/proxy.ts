import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

const publicRoutes = ['/login', '/logo.png']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // İmage, public klasör ve next iç dosyalarını bypass et
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('session')?.value
  
  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await decrypt(cookie)
  
  if (!payload?.id) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    return response
  }

  // Admin / Kullanıcı yönetimi sayfasına girişi sadece adminle kısıtla
  if (pathname.startsWith('/admin') && !payload.isAdmin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|logo.png).*)'],
}
