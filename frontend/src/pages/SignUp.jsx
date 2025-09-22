import React, { useState, useEffect } from 'react'
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiArrowLeft, FiShield } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import assets from '../assets/assets';
import axios from 'axios'
import { servalUrl } from '../App';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    otp: ''
  });

  const [inputFocus, setInputFocus] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
    otp: false,
  });

  const [inputValid, setInputValid] = useState({
    name: null,
    userName: null,
    email: null,
    password: null,
    otp: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // OTP Timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Input validation
  const validateInput = (name, value) => {
    switch (name) {
      case 'name':
        const isValidName = value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
        setInputValid(prev => ({ ...prev, name: isValidName }));
        break;
      case 'userName':
        const isValidUsername = value.length >= 3 && /^[a-zA-Z0-9._]+$/.test(value);
        setInputValid(prev => ({ ...prev, userName: isValidUsername }));
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setInputValid(prev => ({ ...prev, email: emailRegex.test(value) }));
        break;
      case 'password':
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
        setInputValid(prev => ({ ...prev, password: strength >= 3 }));
        break;
      case 'otp':
        const isValidOtp = value.length === 6 && /^\d{6}$/.test(value);
        setInputValid(prev => ({ ...prev, otp: isValidOtp }));
        break;
      default:
        break;
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Fair';
    if (passwordStrength === 4) return 'Good';
    return 'Strong';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    validateInput(name, value);
  };

  const handleInputFocus = (fieldName) => {
    setInputFocus(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleInputBlur = (fieldName) => {
    if (!formData[fieldName]) {
      setInputFocus(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !inputValid.email) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${servalUrl}/api/auth/registerUsersendOTP`, 
        { email: formData.email }, 
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      setCurrentStep(2);
      setOtpTimer(120); // 2 minutes timer
      setInputFocus(prev => ({ ...prev, otp: true }));
      
    } catch (error) {
      console.error('Send OTP error:', error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Connection timeout. Please try again.');
      } else if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Invalid email address');
      } else if (error.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp || !inputValid.otp) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${servalUrl}/api/auth/verifyOtp`, 
        { email: formData.email, otp: formData.otp }, 
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      setCurrentStep(3);
      setInputFocus(prev => ({ ...prev, name: true }));
      
    } catch (error) {
      console.error('Verify OTP error:', error);
      
      if (error.response?.status === 400) {
        setError('Invalid or expired OTP. Please try again.');
      } else {
        setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !inputValid.name) {
      setError('Please enter a valid name');
      return;
    }
    if (!formData.userName || !inputValid.userName) {
      setError('Please enter a valid username');
      return;
    }
    if (!formData.password || !inputValid.password) {
      setError('Please enter a stronger password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${servalUrl}/api/auth/signup`, 
        {
          name: formData.name,
          userName: formData.userName,
          email: formData.email,
          password: formData.password
        }, 
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      dispatch(setUserData(response.data));
      
      // Navigate after success
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error) {
      console.error('Sign up error:', error);
      
      if (error.response?.status === 409) {
        setError('Username or email already exists');
      } else {
        setError(error.response?.data?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpTimer(120);
    await handleSendOTP({ preventDefault: () => {} });
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setError('');
  };

  const getInputBorderColor = (fieldName) => {
    if (inputValid[fieldName] === true) return 'border-green-500';
    if (inputValid[fieldName] === false) return 'border-red-500';
    if (inputFocus[fieldName]) return 'border-blue-500';
    return 'border-gray-300';
  };

  const getInputIcon = (fieldName) => {
    if (inputValid[fieldName] === true) {
      return <FiCheckCircle className="text-green-500 w-5 h-5" />;
    }
    if (inputValid[fieldName] === false) {
      return <FiAlertCircle className="text-red-500 w-5 h-5" />;
    }
    return null;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const steps = ['Email Verification', 'OTP Verification', 'Account Details'];

  return (
    <div className='w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col justify-center items-center p-4'>
      <div className='w-full max-w-4xl h-auto min-h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden shadow-2xl border border-gray-200'>
        
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-8 gap-6'>
          
          {/* Header with Step Indicator */}
          <div className='w-full max-w-sm space-y-6'>
            <div className='text-center space-y-4'>
              <div className='flex gap-3 items-center justify-center text-2xl font-bold text-gray-800'>
                <span>Sign Up to</span>
                <img src={assets.auralogowords} alt="Aura Logo" className='w-[70px]'/>
              </div>
              
              {/* Step Progress */}
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step ? <FiCheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-1 mx-1 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-gray-600 text-sm">{steps[currentStep - 1]}</p>
            </div>

            {/* Step 1: Email Verification */}
            {currentStep === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className='relative'>
                  <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('email')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                    <FiMail className="absolute left-4 text-gray-400 w-5 h-5" />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('email')}
                      onBlur={() => handleInputBlur('email')}
                      className='w-full h-full rounded-xl px-12 pr-10 outline-none text-gray-700 placeholder-transparent'
                      type="email"
                      id='email'
                      placeholder="Email Address"
                      autoComplete="email"
                      required
                    />
                    <label 
                      htmlFor="email" 
                      className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                        inputFocus.email || formData.email ? 
                        'text-xs -top-2.5 text-blue-600' : 
                        'text-sm top-4'
                      }`}
                    >
                      Email Address
                    </label>
                    <div className="absolute right-4">
                      {getInputIcon('email')}
                    </div>
                  </div>
                  {inputValid.email === false && (
                    <p className="text-red-500 text-xs mt-1 ml-1">Please enter a valid email address</p>
                  )}
                </div>

                {error && (
                  <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200'>
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className='text-sm'>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !formData.email || !inputValid.email}
                  className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                    loading || !formData.email || !inputValid.email
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <ClipLoader size={20} color='white'/>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center space-y-2">
                  <FiShield className="w-12 h-12 text-blue-600 mx-auto" />
                  <p className="text-gray-600 text-sm">
                    We've sent a verification code to<br/>
                    <span className="font-semibold text-gray-800">{formData.email}</span>
                  </p>
                </div>

                <div className='relative'>
                  <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('otp')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                    <MdVerifiedUser className="absolute left-4 text-gray-400 w-5 h-5" />
                    <input
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('otp')}
                      onBlur={() => handleInputBlur('otp')}
                      className='w-full h-full rounded-xl px-12 pr-10 outline-none text-gray-700 placeholder-transparent text-center text-lg tracking-widest'
                      type="text"
                      id='otp'
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                    <label 
                      htmlFor="otp" 
                      className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                        inputFocus.otp || formData.otp ? 
                        'text-xs -top-2.5 text-blue-600' : 
                        'text-sm top-4'
                      }`}
                    >
                      6-Digit OTP
                    </label>
                    <div className="absolute right-4">
                      {getInputIcon('otp')}
                    </div>
                  </div>
                  {inputValid.otp === false && (
                    <p className="text-red-500 text-xs mt-1 ml-1">Please enter a valid 6-digit OTP</p>
                  )}
                </div>

                {otpTimer > 0 ? (
                  <p className="text-center text-sm text-gray-600">
                    Resend OTP in <span className="font-semibold text-blue-600">{formatTime(otpTimer)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer transition-colors"
                  >
                    Resend OTP
                  </button>
                )}

                {error && (
                  <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200'>
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className='text-sm'>{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || !formData.otp || !inputValid.otp}
                    className={`flex-1 h-12 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      loading || !formData.otp || !inputValid.otp
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <ClipLoader size={20} color='white'/>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Account Details */}
            {currentStep === 3 && (
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Name Input */}
                <div className='relative'>
                  <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('name')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                    <FiUser className="absolute left-4 text-gray-400 w-5 h-5" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('name')}
                      onBlur={() => handleInputBlur('name')}
                      className='w-full h-full rounded-xl px-12 pr-10 outline-none text-gray-700 placeholder-transparent'
                      type="text"
                      id='name'
                      placeholder="Full Name"
                      autoComplete="name"
                      required
                    />
                    <label 
                      htmlFor="name" 
                      className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                        inputFocus.name || formData.name ? 
                        'text-xs -top-2.5 text-blue-600' : 
                        'text-sm top-4'
                      }`}
                    >
                      Full Name
                    </label>
                    <div className="absolute right-4">
                      {getInputIcon('name')}
                    </div>
                  </div>
                  {inputValid.name === false && (
                    <p className="text-red-500 text-xs mt-1 ml-1">Name must be at least 2 characters</p>
                  )}
                </div>

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
                    <div className="absolute right-4">
                      {getInputIcon('userName')}
                    </div>
                  </div>
                  {inputValid.userName === false && (
                    <p className="text-red-500 text-xs mt-1 ml-1">Username must be at least 3 characters (letters, numbers, dots, underscores only)</p>
                  )}
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
                      className='w-full h-full rounded-xl px-12 pr-16 outline-none text-gray-700 placeholder-transparent'
                      type={showPassword ? "text" : "password"}
                      id='password'
                      placeholder="Password"
                      autoComplete="new-password"
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
                      {getInputIcon('password')}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <IoIosEyeOff className='w-5 h-5'/> : <IoIosEye className='w-5 h-5'/>}
                      </button>
                    </div>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength <= 2 ? 'text-red-500' :
                          passwordStrength === 3 ? 'text-yellow-500' :
                          passwordStrength === 4 ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Use 8+ characters with a mix of letters, numbers & symbols
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200'>
                    <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className='text-sm'>{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading || !formData.name || !formData.userName || !formData.password || !inputValid.name || !inputValid.userName || !inputValid.password}
                    className={`flex-1 h-12 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      loading || !formData.name || !formData.userName || !formData.password || !inputValid.name || !inputValid.userName || !inputValid.password
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <ClipLoader size={20} color='white'/>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            <p className='text-center text-gray-600 text-sm'>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate("/sign-in")}
                className='text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors'
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className='w-[50%] h-full hidden lg:flex justify-center items-center bg-gradient-to-br from-black to-gray-800 flex-col gap-6 text-white rounded-l-3xl shadow-2xl'>
          <div className="text-center space-y-6">
            <img src={assets.applogo} alt="Aura Logo" className='w-24 mx-auto'/>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Join Aura Today!</h2>
              <p className='text-gray-300 max-w-xs'>
                Connect with friends and share your amazing moments
              </p>
            </div>
          </div>
          
          {/* Step-specific content */}
          <div className="text-center space-y-4">
            {currentStep === 1 && (
              <div className="space-y-2">
                <FiMail className="w-8 h-8 text-blue-400 mx-auto" />
                <p className="text-sm text-gray-300">Verify your email to get started</p>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-2">
                <FiShield className="w-8 h-8 text-green-400 mx-auto" />
                <p className="text-sm text-gray-300">Security verification in progress</p>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-2">
                <FiUser className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="text-sm text-gray-300">Almost there! Create your profile</p>
              </div>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-10"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-500 rounded-full opacity-10"></div>
          <div className="absolute top-1/2 left-5 w-12 h-12 bg-pink-500 rounded-full opacity-10"></div>
        </div>
      </div>
    </div>
  )
}

export default SignUp