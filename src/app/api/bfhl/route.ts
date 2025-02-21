import { NextResponse } from 'next/server';

interface RequestData {
  data: (string | number)[];
}

interface ResponseData {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
}

export async function POST(request: Request) {
  const { data }: RequestData = await request.json();

  const numbers = data.filter((item) => !isNaN(Number(item))).map(String);
  const alphabets = data.filter((item) => isNaN(Number(item))).map(String);
  const highest_alphabet =
    alphabets.length > 0
      ? [alphabets.reduce((a, b) => (a.toLowerCase() > b.toLowerCase() ? a : b))]
      : [];

  const response: ResponseData = {
    is_success: true,
    user_id: 'harsh_kumar_26052004',
    email: 'xt.harshh@gmail.com',
    roll_number: '2236801',
    numbers,
    alphabets,
    highest_alphabet,
  };

  return NextResponse.json(response);
}

export async function GET() {
  return NextResponse.json({ operation_code: 1 });
}