import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestPatch, supabaseRestUpsert } from '@/lib/supabaseAdminFetch';

// GET /api/user/theme - Get user's theme preference
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    // First, get the global default theme (set by admin)
    let globalDefaultTheme = 'default';
    try {
      const globalThemeRes = await supabaseRestGet('/rest/v1/festival_themes?select=id&is_active=eq.true');
      if (Array.isArray(globalThemeRes) && globalThemeRes.length > 0) {
        globalDefaultTheme = globalThemeRes[0].id || 'default';
      }
    } catch (error) {
      console.error('Error fetching global default theme:', error);
    }

    // If no user identifier provided, return global default
    if (!userId && !phone && !email) {
      return NextResponse.json({
        theme: globalDefaultTheme,
        isGlobalDefault: true,
      });
    }

    let query = '/rest/v1/users?select=id,selected_theme';
    
    if (userId) {
      query += `&id=eq.${encodeURIComponent(userId)}`;
    } else if (phone) {
      query += `&phone=eq.${encodeURIComponent(phone)}`;
    } else if (email) {
      query += `&email=eq.${encodeURIComponent(email)}`;
    }

    const users = await supabaseRestGet(query);
    
    if (Array.isArray(users) && users.length > 0) {
      const user = users[0];
      // Return user's theme if set, otherwise return global default
      const userTheme = user.selected_theme || globalDefaultTheme;
      return NextResponse.json({
        userId: user.id,
        theme: userTheme,
        isGlobalDefault: !user.selected_theme,
      });
    }

    // User not found, return global default theme
    return NextResponse.json({
      theme: globalDefaultTheme,
      isGlobalDefault: true,
    });
  } catch (error: any) {
    console.error('Error fetching user theme:', error);
    // Return default theme on error
    return NextResponse.json({
      theme: 'default',
      isGlobalDefault: true,
    });
  }
}

// PATCH /api/user/theme - Update user's theme preference
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phone, email, theme } = body;

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      );
    }

    if (!userId && !phone && !email) {
      return NextResponse.json(
        { error: 'User identifier (userId, phone, or email) is required' },
        { status: 400 }
      );
    }

    // First, try to find the user
    let query = '/rest/v1/users?select=id';
    
    if (userId) {
      query += `&id=eq.${encodeURIComponent(userId)}`;
    } else if (phone) {
      query += `&phone=eq.${encodeURIComponent(phone)}`;
    } else if (email) {
      query += `&email=eq.${encodeURIComponent(email)}`;
    }

    let users: any[] = [];
    try {
      users = await supabaseRestGet(query);
    } catch (e) {
      console.error('Error finding user:', e);
    }

    if (Array.isArray(users) && users.length > 0) {
      // User exists, update theme
      const user = users[0];
      await supabaseRestPatch(
        `/rest/v1/users?id=eq.${user.id}`,
        { selected_theme: theme }
      );
      
      return NextResponse.json({
        success: true,
        userId: user.id,
        theme,
      });
    } else {
      // User doesn't exist, but we can't create without more info
      // Return success but note that user needs to be created first
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found. Please ensure user account exists.',
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error updating user theme:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update theme' },
      { status: 500 }
    );
  }
}
