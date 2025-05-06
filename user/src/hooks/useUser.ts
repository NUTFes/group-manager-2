import { useEffect, useState } from 'react';

export type User = {
  id?: number;
  name: string | null;
  email: string | null;
};

export const useUser = () => {
  const [user, setUser] = useState<User>({
    name: null,
    email: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch('/api/getUser');
      const data = await res.json();
      setUser({
        ...data,
        id: data.id ? Number(data.id) : undefined,
      });
    };

    fetchUserInfo();
  }, []);

  return { user };
};
