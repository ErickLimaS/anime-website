import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const subtitleLanguage: string = await request
      .json()
      .then((res) => res.subtitleLanguage);

    if (!subtitleLanguage)
      return NextResponse.json(
        {
          message: "No Data Received",
        },
        {
          status: 404,
        }
      );

    cookies().set({
      name: "subtitle_language",
      value: subtitleLanguage,
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
    const subtitleLanguage = request.cookies.get("subtitle_language");

    if (subtitleLanguage) {
      return NextResponse.json(
        {
          subtitleLanguage: subtitleLanguage.value,
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
    cookies().delete("subtitle_language");

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
