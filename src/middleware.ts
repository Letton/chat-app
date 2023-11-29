import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    const isAuth = await getToken({req})

    const sensetiveRoutes = ['/app']
    const isAccessingSensetiveRoute = sensetiveRoutes.some((route) => pathname.startsWith(route))


    if (isAuth && (pathname === '/')) 
      return NextResponse.redirect(new URL('/app', req.url))

    if (!isAuth && isAccessingSensetiveRoute) 
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    
  }, {
    callbacks: 
    { 
      async authorized() {
        return true;
      }
    }
  }
)

export const config = {
  matcher: ['/', '/app/:path*']
}