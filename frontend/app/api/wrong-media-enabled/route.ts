import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const isPlayWrongMediaEnabled: string = await request
      .json()
      .then((res) => res.isEnabled);

    if (!isPlayWrongMediaEnabled)
      return NextResponse.json(
        {
          message: "No Data Received",
        },
        {
          status: 404,
        }
      );

    cookies().set({
      name: "wrong_media_enabled",
      value: `${isPlayWrongMediaEnabled}`,
    });

    return NextResponse.json(
      {
        message: "Play Wrong Media Cookie Set!",
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
    const isPlayWrongMediaEnabled = request.cookies.get("wrong_media_enabled");

    if (isPlayWrongMediaEnabled) {
      return NextResponse.json(
        {
          wrongMediaEnabled: isPlayWrongMediaEnabled.value,
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
    cookies().delete("wrong_media_enabled");

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
