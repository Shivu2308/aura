import React, { useState, useEffect } from 'react'
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FiUser, FiLock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import assets from '../assets/assets';
import axios from 'axios'
import { servalUrl } from '../App';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });

  const [inputFocus, setInputFocus] = useState({
    userName: false,
    password: false,
  });



  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Load remembered credentials
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({ ...prev, userName: rememberedUser }));
      setRememberMe(true);
      setInputFocus(prev => ({ ...prev, userName: true }));
    }
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleInputFocus = (fieldName) => {
    setInputFocus(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleInputBlur = (fieldName) => {
    if (!formData[fieldName]) {
      setInputFocus(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.userName || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.userName.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${servalUrl}/api/auth/signin`, 
        formData, 
        { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        }
      );

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedUser', formData.userName);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      dispatch(setUserData(response.data));
      
      // Success feedback
      setError('');
      
      // Navigate after a short delay to show success state
      setTimeout(() => {
        navigate('/');
      }, 500);

    } catch (error) {
      // console.error('Sign in error:', error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        setError('Connection timeout. Please try again.');
      } else if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSignIn(e);
    }
  };

  const getInputBorderColor = (fieldName) => {
    if (inputFocus[fieldName]) return 'border-blue-500';
    return 'border-gray-300';
  };

  // const getInputIcon = (fieldName) => {
  //   if (inputValid[fieldName] === true) {
  //     return <FiCheckCircle className="text-green-500 w-5 h-5" />;
  //   }
  //   if (inputValid[fieldName] === false) {
  //     return <FiAlertCircle className="text-red-500 w-5 h-5" />;
  //   }
  //   return null;
  // };

  return (
    <div className='w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col justify-center items-center p-4'>
      <div className='w-full max-w-4xl h-auto min-h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden shadow-2xl border border-gray-200'>
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-8 gap-6'>
          
          {/* Header */}
          <div className='flex gap-3 items-center text-2xl font-bold text-gray-800 mb-4'>
            <span>Sign In to</span>
            <img src={assets.auralogowords} alt="Aura Logo" className='w-[70px]'/>
          </div>

          <form onSubmit={handleSignIn} className='w-full max-w-sm space-y-6'>
            
            {/* Username Input */}
            <div className='relative'>
              <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('userName')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                <FiUser className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('userName')}
                  onBlur={() => handleInputBlur('userName')}
                  onKeyPress={handleKeyPress}
                  className='w-full h-full rounded-xl px-12 pr-10 outline-none text-gray-700 placeholder-transparent'
                  type="text"
                  id='userName'
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
                <label 
                  htmlFor="userName" 
                  className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                    inputFocus.userName || formData.userName ? 
                    'text-xs -top-2.5 text-blue-600' : 
                    'text-sm top-4'
                  }`}
                >
                  Username
                </label>
              </div>
            </div>

            {/* Password Input */}
            <div className='relative'>
              <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('password')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                <FiLock className="absolute left-4 text-gray-400 w-5 h-5" />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={() => handleInputBlur('password')}
                  onKeyPress={handleKeyPress}
                  className='w-full h-full rounded-xl px-12 pr-16 outline-none text-gray-700 placeholder-transparent'
                  type={showPassword ? "text" : "password"}
                  id='password'
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
                <label 
                  htmlFor="password" 
                  className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                    inputFocus.password || formData.password ? 
                    'text-xs -top-2.5 text-blue-600' : 
                    'text-sm top-4'
                  }`}
                >
                  Password
                </label>
                <div className="absolute right-4 flex items-center space-x-2">
                  {/* {getInputIcon('password')} */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    {showPassword ? <IoIosEyeOff className='w-5 h-5'/> : <IoIosEye className='w-5 h-5'/>}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex justify-between items-center text-sm'>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className='text-blue-600 hover:text-blue-800 hover:underline transition-colors'
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200'>
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className='text-sm'>{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading || !formData.userName || !formData.password}
              className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                loading || !formData.userName || !formData.password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ClipLoader size={20} color='white'/>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <p className='text-center text-gray-600 text-sm'>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className='text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors'
              >
                Sign Up
              </button>
            </p>

          </form>
        </div>

        {/* Right Side Panel */}
        <div className='w-[50%] h-full hidden lg:flex justify-center items-center bg-gradient-to-br from-black to-gray-800 flex-col gap-6 text-white rounded-l-3xl shadow-2xl'>
          <div className="text-center space-y-6">
            <img src={assets.applogo} alt="Aura Logo" className='w-24 mx-auto'/>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className='text-gray-300 max-w-xs'>
                Aura | Not Just A Platform, It's an Experience
              </p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500 rounded-full opacity-10"></div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
