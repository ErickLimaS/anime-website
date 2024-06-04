import axios from 'axios'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// handles user selected language for media title, adult content...
export async function middleware(request: NextRequest) {

    const anilistAccessInfo = request.nextUrl.hash

    const accessTokenHash = anilistAccessInfo.slice(anilistAccessInfo.search(/\baccess_token=\b/), anilistAccessInfo.search(/\b&token_type\b/)).slice(13)
    const tokenType = anilistAccessInfo.slice(anilistAccessInfo.search(/\btoken_type=\b/), anilistAccessInfo.search(/\b&expires_in\b/)).slice(11)
    const expiresIn = anilistAccessInfo.slice(anilistAccessInfo.search(/\bexpires_in=\b/)).slice(11)

    if (anilistAccessInfo) {
        axios.post(`${window.location.origin}/api/anilist`, {
            accessToken: accessTokenHash,
            tokenType: tokenType,
            expiresIn: expiresIn
        })
    }

    const mediaTitleLang = request.cookies.get("media_title_language")?.value

    const tokenOnCookie = request.cookies.get("access_token")

    const accessToken = tokenOnCookie ? JSON.parse(tokenOnCookie.value!).accessToken : undefined

    const isParamsOnPathname = request.nextUrl.search == `?lang=${mediaTitleLang}`

    if (mediaTitleLang && accessToken) {

        if (!isParamsOnPathname && request.nextUrl.pathname.slice(0, 6) == "/media") {

            return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?lang=${mediaTitleLang}`, { headers: { authorization: `Bearer ${accessToken}` } })
        }

        return NextResponse.next({ headers: { authorization: `Bearer ${accessToken}` } })

    }

    if (!isParamsOnPathname && mediaTitleLang && request.nextUrl.pathname.slice(0, 6) == "/media") {

        return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?lang=${mediaTitleLang}`)

    }

    return NextResponse.next()

}
