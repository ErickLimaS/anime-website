import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// HANDLES ACCESS TOKEN FOR ANILIST USERS
export async function POST(request: NextRequest) {
  try {
    const anilistTokenData: {
      accessToken: string;
      tokenType: string;
      expiresIn: string;
    } = await request.json();

    if (!anilistTokenData)
      return NextResponse.json(
        {
          message: "No Token Received",
        },
        {
          status: 404,
        }
      );

    cookies().set({
      name: "access_token",
      value: JSON.stringify(anilistTokenData) || "",
      httpOnly: true,
      expires: Date.now() + Number(anilistTokenData.expiresIn),
    });

    return NextResponse.json(
      {
        message: "Anilist Token Set!",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const anilistAccessTokenData = request.cookies.get("access_token")
      ? JSON.parse(request.cookies.get("access_token")!.value).accessToken
      : null;

    if (anilistAccessTokenData) {
      return NextResponse.json(
        {
          message: "Success",
          access_token: anilistAccessTokenData,
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        message: "No Cookie Found",
      },
      {
        status: 404,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE() {
  try {
    cookies().delete("access_token");

    return NextResponse.json(
      {
        message: "Success",
      },
      {
        status: 202,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err,
      },
      {
        status: 500,
      }
    );
  }
}
