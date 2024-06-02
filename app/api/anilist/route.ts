import { cookies } from "next/headers";
import { NextRequest, NextResponse, } from "next/server";

// HANDLES ACCESS TOKEN FOR ANILIST USERS

export async function POST(request: NextRequest) {

    try {
        const anilistTokenData = await request.json()

        if (!anilistTokenData) return NextResponse.json({
            "message": "No Token Received"
        })

        cookies().set({
            name: 'access_token',
            value: JSON.stringify(anilistTokenData) || "",
            httpOnly: true
        })

        return NextResponse.json({
            "message": "Anilist Token Set!"
        })

    }
    catch (err) {

        return NextResponse.json({
            "message": err
        },)

    }

}

export async function GET(request: NextRequest) {

    try {

        const anilistAcessTokenData = JSON.parse(request.cookies.get("access_token")?.value as string)

        return NextResponse.json({
            "message": "Success",
            "access_token": anilistAcessTokenData.accessToken
        })

    }
    catch (err) {

        return NextResponse.json({
            "message": err
        },)

    }
}

export async function DELETE() {

    try {

        cookies().delete("access_token")

        return NextResponse.json({
            "message": "Success"
        })

    }
    catch (err) {

        return NextResponse.json({
            "message": err
        },)

    }
}