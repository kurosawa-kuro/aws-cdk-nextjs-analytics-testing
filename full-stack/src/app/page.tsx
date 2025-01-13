import Image from "next/image";
import { prisma } from '@/lib/prisma';

// Userデータの型定義
interface User {
  id: number;
  email: string;
  name: string | null;
}

// サーバーサイドでユーザーデータを取得
export async function getUsersData(): Promise<User[]> {
  return await prisma.user.findMany();
}

// 定数定義
const PAGE_STYLES = {
  container: "grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20",
  main: "flex flex-col gap-8 row-start-2 items-center sm:items-start",
  button: {
    primary: "rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5",
    secondary: "rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
  }
};

// ユーザーリストコンポーネント
function UserList({ users }: { users: User[] }) {
  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">User List</h2>
        <a
          href="/users/add"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add User
        </a>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{user.email}</h3>
            <p className="text-sm text-gray-600">
              {user.name || 'No name provided'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// フッターコンポーネント
function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <FooterLink href="https://nextjs.org/learn" icon="/file.svg" text="Learn" />
      <FooterLink href="https://vercel.com/templates?framework=next.js" icon="/window.svg" text="Examples" />
      <FooterLink href="https://nextjs.org" icon="/globe.svg" text="Go to nextjs.org →" />
    </footer>
  );
}

// フッターリンクコンポーネント
function FooterLink({ href, icon, text }: { href: string; icon: string; text: string }) {
  return (
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src={icon}
        alt={`${text} icon`}
        width={16}
        height={16}
      />
      {text}
    </a>
  );
}

export default async function Home() {
  const users = await getUsersData();

  return (
    <div className={PAGE_STYLES.container}>
      <main className={PAGE_STYLES.main}>
        <UserList users={users} />
      </main>
      <Footer />
    </div>
  );
}
