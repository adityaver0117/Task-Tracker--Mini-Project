import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { ...userData } = formData;
      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-5xl w-full p-6 m-4 flex rounded-2xl shadow-2xl bg-white overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-100 rounded-l-2xl items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-50 opacity-80"></div>
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
            <svg className="w-32 h-32 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
            </svg>
            <h2 className="text-3xl font-bold text-indigo-800">Join Our Community</h2>
            <p className="text-indigo-700 max-w-md">Create an account and start managing your tasks efficiently with our powerful task management platform.</p>
          </div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-300 opacity-50"></div>
          <div className="absolute top-10 -right-10 w-32 h-32 rounded-full bg-indigo-400 opacity-40"></div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 py-8 px-8 md:px-12">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-gray-500 mb-8">Start your journey to better productivity</p>

          {formError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-pulse">
              <p className="font-medium">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                id="name"
                type="text"
                name="name"
                className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                id="email"
                type="email"
                name="email"
                className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="pl-10 block w-full rounded-lg border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none transition-colors duration-200"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Login instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;