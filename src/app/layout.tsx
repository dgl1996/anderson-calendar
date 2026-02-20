export const metadata = {
  title: '安德森极简工作日历',
  description: '专为管理人员设计的极简工作日历',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}