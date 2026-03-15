import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { username, email, password } = await req.json();

  const demoUser = {
    username: "admin",
    email: "admin@tripeloo.com",
    password: "123456"
  };

  if (
    username === demoUser.username &&
    email === demoUser.email &&
    password === demoUser.password
  ) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}