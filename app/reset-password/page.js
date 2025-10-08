import PasswordReset from "@/components/PasswordReset";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        <PasswordReset />
        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
