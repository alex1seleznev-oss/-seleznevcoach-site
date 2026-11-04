import { NextResponse } from 'next/server';

// Vercel authenticates the owner; no admin password is embedded in public code.
export function GET() {
  return NextResponse.redirect('https://vercel.com/toprunnersteam/seleznevcoach-site', 307);
}
