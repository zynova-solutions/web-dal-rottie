export default function NotAuthenticated() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-[#7a1313] mb-2">User not authenticated</h2>
      <p className="text-gray-600 mb-4">You must be logged in as an admin to access this page.</p>
      <a href="/admin" className="text-[#7a1313] underline font-semibold">Go to Login</a>
    </div>
  );
}
