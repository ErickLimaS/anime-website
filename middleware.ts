import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// handles user selected language for media title, adult content...
export async function middleware(request: NextRequest) {

    const mediaTitleLang = request.cookies.get("media_title_language")?.value

    const tokenOnCookie = request.cookies.get("access_token")

    const accessToken = tokenOnCookie ? JSON.parse(tokenOnCookie.value!).accessToken : undefined

    if (mediaTitleLang && accessToken) {

        const isParamsOnPathname = request.nextUrl.search == `?lang=${mediaTitleLang}`

        if (!isParamsOnPathname) {
            return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?lang=${mediaTitleLang}`, { headers: { authorization: `Bearer ${accessToken}` } })
        }

        return NextResponse.next({ headers: { authorization: `Bearer ${accessToken}` } })

    }

    return NextResponse.next()

}
