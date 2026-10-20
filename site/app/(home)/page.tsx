import Link from 'next/link';

const sections = [
  { href: '/docs/foundations/overview', title: '기초', body: '색상 · 타이포그래피 · 레이아웃 · 모양 · 깊이 · 모션' },
  { href: '/docs/components/guides', title: '컴포넌트', body: '컴포넌트마다 구조 · 변형 · 크기 · 상태의 세부 수치' },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-bold">Groo Design</h1>
        <p className="mt-3 text-fd-muted-foreground">
          그루 이음 · 그루 담다 가 함께 쓰는 디자인 시스템입니다. 웹과 앱은 이 문서의 값을 따릅니다.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
            >
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-fd-muted-foreground">{s.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
