import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // DEBUG: Log password info (first 3 chars only for security)
    console.log('[AUTH DEBUG] ADMIN_PASSWORD exists:', !!adminPassword);
    console.log('[AUTH DEBUG] ADMIN_PASSWORD prefix:', adminPassword?.substring(0, 3) || 'undefined');
    console.log('[AUTH DEBUG] Received password prefix:', password?.substring(0, 3) || 'undefined');
    console.log('[AUTH DEBUG] Password lengths - env:', adminPassword?.length, 'received:', password?.length);
    
    if (!adminPassword) {
      console.log('[AUTH DEBUG] ❌ Admin password not configured');
      return NextResponse.json(
        { success: false, error: 'Admin password not configured' },
        { status: 500 }
      );
    }
    
    const passwordsMatch = password === adminPassword;
    console.log('[AUTH DEBUG] Password comparison result:', passwordsMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    if (passwordsMatch) {
      console.log('[AUTH DEBUG] ✅ Authentication successful, setting cookie');
      const response = NextResponse.json({ success: true });
      
      // Set httpOnly cookie that expires in 7 days
      response.cookies.set('jez-admin', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        path: '/',
      });
      
      return response;
    }
    
    console.log('[AUTH DEBUG] ❌ Authentication failed - incorrect password');
    return NextResponse.json({ 
      success: false, 
      error: 'Incorrect password' 
    });
  } catch (error) {
    console.log('[AUTH DEBUG] ❌ Exception caught:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
