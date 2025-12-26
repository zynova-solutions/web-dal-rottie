// Hide admin navbar on login page by not rendering the parent layout
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50">{children}</div>;
}
