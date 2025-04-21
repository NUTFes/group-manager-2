// pages/api/auth/signup.ts
import type { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { mail, password, name, studentId, gradeId, departmentId } = req.body;

    // バックエンド（Rails など）にユーザー作成リクエスト
    const apiRes = await fetch('https://your-rails-app.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: mail,
          password,
          name,
          student_id: studentId,
          grade_id: gradeId,
          department_id: departmentId,
        },
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.json();
      return res
        .status(apiRes.status)
        .json({ error: err.error || 'Registration failed' });
    }

    return res.status(201).json({ ok: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || 'Internal error' });
    }
    return res.status(500).json({ error: 'Internal error' });
  }
};

export default handler;
