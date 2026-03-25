
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { signToken } from '@/lib/auth';
export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const { email, password } = await request.json();
    
    // Normalize email to lowercase to match signup logic
    const lowEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowEmail }).select('+password');
    if (!user) {
      // Returns specific message for frontend toast
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      // Returns specific message for frontend toast
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = { id: user._id, username: user.username, email: user.email };
    const token = signToken(tokenData);

    const response = NextResponse.json({ 
      message: "Login successful", 
      success: true,
      user: { username: user.username } 
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      // Use SameSite=None for cross-site contexts (Vercel HTTPS).
      // This is required when frontend and api may be accessed cross-site.
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}