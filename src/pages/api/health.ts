import { NextRequest, NextResponse } from 'next/server';

export default function handler(req: NextRequest, resp: NextResponse) {
    (resp as any).status(200).send('mv-front');
}
