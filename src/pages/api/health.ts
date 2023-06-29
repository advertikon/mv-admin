import { NextRequest, NextResponse } from 'next/server';

export default function handler(req: NextRequest, resp: NextResponse) {
    // @ts-ignore
    resp.status(200).send('mv-front');
}
