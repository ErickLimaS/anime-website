import { cookies } from "next/headers";
import { NextRequest, NextResponse, } from "next/server";

// HANDLES ACCESS TOKEN FOR ANILIST USERS

export async function POST(request: NextRequest) {

    try {

        const anilistTokenData: { accessToken: string, tokenType: string, expiresIn: string } = await request.json()

        if (!anilistTokenData) return NextResponse.json({
            "message": "No Token Received",
            status: 404
        })

        cookies().set({
            name: 'access_token',
            value: JSON.stringify(anilistTokenData) || "",
            httpOnly: true,
            expires: Date.now() + Number(anilistTokenData.expiresIn)
        })

        return NextResponse.json({
            "message": "Anilist Token Set!",
            status: 201
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
            "access_token": anilistAcessTokenData.accessToken,
            status: 200
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
            "message": "Success",
            status: 202
        })

    }
    catch (err) {

        return NextResponse.json({
            "message": err
        },)

    }
}