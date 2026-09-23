import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      setSubmitted(true);
    } catch (error) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src={logo} alt="EstateHub Logo" className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
          <p className="mt-2 text-gray-600">Enter your email and we will send reset instructions.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
          <div>
            <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input id="reset-email" type="email" required value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Sending...' : 'Send reset link'}</button>
          {submitted && <p className="text-sm text-green-700">If an account exists for that email, reset instructions have been sent.</p>}
          <Link to="/login" className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-700"><ArrowLeft className="mr-2 h-4 w-4" />Back to login</Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
