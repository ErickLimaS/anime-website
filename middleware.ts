import axios from 'axios'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// handles user selected language for media title, adult content...
export async function middleware(request: NextRequest) {

    // Related to Anilist Login Access
    if (request.nextUrl.hash) {

        const anilistAccessHashOnURL = request.nextUrl.hash

        const accessTokenHash = anilistAccessHashOnURL.slice(anilistAccessHashOnURL.search(/\baccess_token=\b/), anilistAccessHashOnURL.search(/\b&token_type\b/)).slice(13)
        const tokenType = anilistAccessHashOnURL.slice(anilistAccessHashOnURL.search(/\btoken_type=\b/), anilistAccessHashOnURL.search(/\b&expires_in\b/)).slice(11)
        const expiresIn = anilistAccessHashOnURL.slice(anilistAccessHashOnURL.search(/\bexpires_in=\b/)).slice(11)

        axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`, {
            accessToken: accessTokenHash,
            tokenType: tokenType,
            expiresIn: expiresIn
        })

    }

    const tokenOnCookie = request.cookies.get("access_token")

    const accessToken = tokenOnCookie ? JSON.parse(tokenOnCookie.value!).accessToken : undefined

    if (request.nextUrl.pathname.startsWith("/watch")) {

        const playWrongMedia = request.cookies.get("wrong_media_enabled")?.value

        const queryParamString = new URLSearchParams(request.nextUrl.searchParams)

        if (playWrongMedia == "true") {

            return NextResponse.next({ headers: { authorization: `Bearer ${accessToken}` } })

        }
        else if (playWrongMedia == "false" && queryParamString.toString().includes("&alert") == false) {

            if (accessToken) {
                return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?${queryParamString.toString()}&alert=true`,
                    { headers: { authorization: `Bearer ${accessToken}` } }
                )
            }

            return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?${queryParamString.toString()}&alert=true`)

        }

        if (accessToken) {

            return NextResponse.next({ headers: { authorization: `Bearer ${accessToken}` } })

        }

        return NextResponse.next()

    }

    if (request.nextUrl.pathname.startsWith("/media")) {

        const mediaTitleLang = request.cookies.get("media_title_language")?.value
        const isParamsOnPathname = request.nextUrl.search == `?lang=${mediaTitleLang}`

        if (mediaTitleLang) {

            if (accessToken) {

                if (!isParamsOnPathname) {
                    return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?lang=${mediaTitleLang}`, { headers: { authorization: `Bearer ${accessToken}` } })
                }

                return NextResponse.next({ headers: { authorization: `Bearer ${accessToken}` } })

            }

            if (!isParamsOnPathname && mediaTitleLang) {

                return NextResponse.redirect(`${request.nextUrl.origin}${request.nextUrl.pathname}?lang=${mediaTitleLang}`)

            }

        }

    }

    if (accessToken) {
        return NextResponse.next({ headers: { authorization: `Bearer ${accessToken}` } })
    }

    return NextResponse.next()

}
