import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, password } = body;

  if (email === "admin@tripeloo.com" && password === "123456") {
    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  }

  return NextResponse.json({
    success: false,
    message: "Invalid credentials",
  });
}