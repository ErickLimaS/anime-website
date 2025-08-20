import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const isAdultContentEnabled: string = await request
      .json()
      .then((res) => res.isAdultContentEnabled);

    if (!isAdultContentEnabled)
      return NextResponse.json(
        {
          message: "No Data Received",
        },
        {
          status: 404,
        }
      );

    cookies().set({
      name: "is_adult_content_enabled",
      value: isAdultContentEnabled,
    });

    return NextResponse.json(
      {
        message: "Adult Content Cookie Set!",
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
    const isAdultContentEnabled = request.cookies.get(
      "is_adult_content_enabled"
    );

    if (isAdultContentEnabled) {
      return NextResponse.json(
        {
          isAdultContentEnabled: isAdultContentEnabled.value,
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
    cookies().delete("is_adult_content_enabled");

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
