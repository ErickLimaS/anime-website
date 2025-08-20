import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const titleLanguage: string = await request
      .json()
      .then((res) => res.titleLanguage);

    if (!titleLanguage)
      return NextResponse.json(
        {
          message: "No Data Received",
        },
        {
          status: 404,
        }
      );

    cookies().set({
      name: "media_title_language",
      value: titleLanguage,
    });

    return NextResponse.json(
      {
        message: "Media Title Language Cookie Set!",
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
    const mediaTitleLanguage = request.cookies.get("media_title_language");

    if (mediaTitleLanguage) {
      return NextResponse.json(
        {
          mediaTitleLanguage: mediaTitleLanguage.value,
        },
        {
          status: 201,
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
    cookies().delete("media_title_language");

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
