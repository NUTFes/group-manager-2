import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

type ResponseData = {
  id: string | null;
  name: string | null;
  email: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const token = await getToken({ req });

  res.status(200).json({
    id: token?.sub || null,
    name: token?.name || null,
    email: token?.email || null,
  });
}
