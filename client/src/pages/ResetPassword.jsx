import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../assets/logo.png';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error('This reset link is invalid');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, ...formData });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src={logo} alt="EstateHub Logo" className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-2 text-gray-600">Choose a new password for your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="new-password" type="password" minLength="6" required value={formData.password} onChange={event => setFormData({ ...formData, password: event.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="confirm-password" type="password" minLength="6" required value={formData.confirmPassword} onChange={event => setFormData({ ...formData, confirmPassword: event.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500" /></div>
          </div>
          <button type="submit" disabled={loading || !token} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Updating...' : 'Reset password'}</button>
          <Link to="/login" className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-700"><ArrowLeft className="mr-2 h-4 w-4" />Back to login</Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
