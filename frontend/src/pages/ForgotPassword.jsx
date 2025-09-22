import React, { useState } from 'react'
import axios from 'axios'
import { servalUrl } from '../App'
import { ClipLoader } from 'react-spinners'
import { FiMail, FiLock, FiShield, FiAlertCircle, FiCheckCircle, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdVerifiedUser } from 'react-icons/md'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [inputFocus, setInputFocus] = useState({
        email: false,
        otp: false,
        newPassword: false,
        confirmPassword: false
    })
    const [inputValid, setInputValid] = useState({
        email: null,
        otp: null,
        newPassword: null,
        confirmPassword: null
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [passwordStrength, setPasswordStrength] = useState(0)
    const navigate = useNavigate()

    // Validation functions
    const validateInput = (name, value) => {
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                setInputValid(prev => ({ ...prev, email: emailRegex.test(value) }))
                break
            case 'otp':
                const isValidOtp = value.length === 6 && /^\d{6}$/.test(value)
                setInputValid(prev => ({ ...prev, otp: isValidOtp }))
                break
            case 'newPassword':
                const strength = calculatePasswordStrength(value)
                setPasswordStrength(strength)
                setInputValid(prev => ({ ...prev, newPassword: strength >= 3 }))
                break
            case 'confirmPassword':
                const passwordsMatch = value === formData.newPassword && value.length > 0
                setInputValid(prev => ({ ...prev, confirmPassword: passwordsMatch }))
                break
            default:
                break
        }
    }

    const calculatePasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500'
        if (passwordStrength === 3) return 'bg-yellow-500'
        if (passwordStrength === 4) return 'bg-blue-500'
        return 'bg-green-500'
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak'
        if (passwordStrength === 3) return 'Fair'
        if (passwordStrength === 4) return 'Good'
        return 'Strong'
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
        validateInput(name, value)
    }

    const handleInputFocus = (fieldName) => {
        setInputFocus(prev => ({ ...prev, [fieldName]: true }))
    }

    const handleInputBlur = (fieldName) => {
        if (!formData[fieldName]) {
            setInputFocus(prev => ({ ...prev, [fieldName]: false }))
        }
    }

    const getInputBorderColor = (fieldName) => {
        if (inputValid[fieldName] === true) return 'border-green-500'
        if (inputValid[fieldName] === false) return 'border-red-500'
        if (inputFocus[fieldName]) return 'border-blue-500'
        return 'border-gray-300'
    }

    const getInputIcon = (fieldName) => {
        if (inputValid[fieldName] === true) {
            return <FiCheckCircle className="text-green-500 w-5 h-5" />
        }
        if (inputValid[fieldName] === false) {
            return <FiAlertCircle className="text-red-500 w-5 h-5" />
        }
        return null
    }

    const handleStep1 = async () => {
        if (!formData.email || !inputValid.email) {
            setError('Please enter a valid email address')
            return
        }

        setLoading(true)
        setError('')
        try {
            await axios.post(`${servalUrl}/api/auth/sendotp`, { email: formData.email }, { withCredentials: true })
            setStep(2)
            setInputFocus(prev => ({ ...prev, otp: true }))
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleStep2 = async () => {
        if (!formData.otp || !inputValid.otp) {
            setError('Please enter a valid 6-digit OTP')
            return
        }

        setLoading(true)
        setError('')
        try {
            await axios.post(`${servalUrl}/api/auth/verifyUserOtp`, { 
                email: formData.email, 
                otp: formData.otp 
            }, { withCredentials: true })
            setStep(3)
            setInputFocus(prev => ({ ...prev, newPassword: true }))
        } catch (error) {
            setError(error?.response?.data?.message || 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleStep3 = async () => {
        if (!formData.newPassword || !inputValid.newPassword) {
            setError('Please enter a stronger password')
            return
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')
        try {
            await axios.post(`${servalUrl}/api/auth/resetPassword`, { 
                email: formData.email, 
                password: formData.newPassword 
            }, { withCredentials: true })
            
            // Success - redirect to login
            setTimeout(() => {
                navigate('/sign-in')
            }, 1000)
        } catch (error) {
            setError(error?.response?.data?.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    const goToPreviousStep = () => {
        setStep(prev => Math.max(1, prev - 1))
        setError('')
    }

    const steps = ['Email Verification', 'OTP Verification', 'Reset Password']

    return (
        <div className='w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col justify-center items-center p-4'>
            <div className='w-full max-w-4xl h-auto min-h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden shadow-2xl border border-gray-200'>
                
                <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-8 gap-6'>
                    
                    <div className='w-full max-w-sm space-y-6'>
                        <div className='text-center space-y-4'>
                            <div className='flex gap-3 items-center justify-center text-2xl font-bold text-gray-800'>
                                <span>Reset Password</span>
                            </div>
                            
                            {/* Step Progress */}
                            <div className="flex items-center justify-center space-x-2">
                                {[1, 2, 3].map((stepNum) => (
                                    <div key={stepNum} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                            step >= stepNum 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {step > stepNum ? <FiCheckCircle className="w-4 h-4" /> : stepNum}
                                        </div>
                                        {stepNum < 3 && (
                                            <div className={`w-8 h-1 mx-1 ${
                                                step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <p className="text-gray-600 text-sm">{steps[step - 1]}</p>
                        </div>

                        {/* Step 1: Email */}
                        {step === 1 && (
                            <div className="space-y-6">
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
                                    onClick={handleStep1}
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
                            </div>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <div className="space-y-6">
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

                                {error && (
                                    <div className='flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200'>
                                        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <p className='text-sm'>{error}</p>
                                    </div>
                                )}

                                <div className="flex space-x-3">
                                    <button
                                        onClick={goToPreviousStep}
                                        className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                    >
                                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    
                                    <button
                                        onClick={handleStep2}
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
                            </div>
                        )}

                        {/* Step 3: Reset Password */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <FiLock className="w-12 h-12 text-green-600 mx-auto" />
                                    <h3 className="text-lg font-semibold text-gray-800">Create New Password</h3>
                                    <p className="text-gray-600 text-sm">
                                        Choose a strong password for your account
                                    </p>
                                </div>

                                {/* New Password */}
                                <div className='relative'>
                                    <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('newPassword')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                                        <FiLock className="absolute left-4 text-gray-400 w-5 h-5" />
                                        <input
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            onFocus={() => handleInputFocus('newPassword')}
                                            onBlur={() => handleInputBlur('newPassword')}
                                            className='w-full h-full rounded-xl px-12 pr-16 outline-none text-gray-700 placeholder-transparent'
                                            type={showPassword ? "text" : "password"}
                                            id='newPassword'
                                            placeholder="New Password"
                                            required
                                        />
                                        <label 
                                            htmlFor="newPassword" 
                                            className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                                                inputFocus.newPassword || formData.newPassword ? 
                                                'text-xs -top-2.5 text-blue-600' : 
                                                'text-sm top-4'
                                            }`}
                                        >
                                            New Password
                                        </label>
                                        <div className="absolute right-4 flex items-center space-x-2">
                                            {getInputIcon('newPassword')}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                            >
                                                {showPassword ? <FiEyeOff className='w-5 h-5'/> : <FiEye className='w-5 h-5'/>}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {formData.newPassword && (
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
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className='relative'>
                                    <div className={`relative flex items-center w-full h-14 rounded-xl border-2 transition-all duration-300 ${getInputBorderColor('confirmPassword')} focus-within:border-blue-500 focus-within:shadow-lg`}>
                                        <FiLock className="absolute left-4 text-gray-400 w-5 h-5" />
                                        <input
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            onFocus={() => handleInputFocus('confirmPassword')}
                                            onBlur={() => handleInputBlur('confirmPassword')}
                                            className='w-full h-full rounded-xl px-12 pr-16 outline-none text-gray-700 placeholder-transparent'
                                            type={showConfirmPassword ? "text" : "password"}
                                            id='confirmPassword'
                                            placeholder="Confirm Password"
                                            required
                                        />
                                        <label 
                                            htmlFor="confirmPassword" 
                                            className={`absolute left-12 px-2 bg-white text-gray-500 pointer-events-none transition-all duration-300 ease-out ${
                                                inputFocus.confirmPassword || formData.confirmPassword ? 
                                                'text-xs -top-2.5 text-blue-600' : 
                                                'text-sm top-4'
                                            }`}
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="absolute right-4 flex items-center space-x-2">
                                            {getInputIcon('confirmPassword')}
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                            >
                                                {showConfirmPassword ? <FiEyeOff className='w-5 h-5'/> : <FiEye className='w-5 h-5'/>}
                                            </button>
                                        </div>
                                    </div>
                                    {inputValid.confirmPassword === false && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">Passwords do not match</p>
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
                                        onClick={goToPreviousStep}
                                        className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                                    >
                                        <FiArrowLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    
                                    <button
                                        onClick={handleStep3}
                                        disabled={loading || !formData.newPassword || !formData.confirmPassword || !inputValid.newPassword || !inputValid.confirmPassword}
                                        className={`flex-1 h-12 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                                            loading || !formData.newPassword || !formData.confirmPassword || !inputValid.newPassword || !inputValid.confirmPassword
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-black hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <ClipLoader size={20} color='white'/>
                                                <span>Resetting...</span>
                                            </div>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Back to Sign In Link */}
                        <p className='text-center text-gray-600 text-sm'>
                            Remember your password?{' '}
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
                            <h2 className="text-xl font-bold">Reset Your Password</h2>
                            <p className='text-gray-300 max-w-xs'>
                                Secure your account with a new password
                            </p>
                        </div>
                    </div>
                    
                    {/* Step-specific content */}
                    <div className="text-center space-y-4">
                        {step === 1 && (
                            <div className="space-y-2">
                                <FiMail className="w-8 h-8 text-blue-400 mx-auto" />
                                <p className="text-sm text-gray-300">Enter your email to get started</p>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-2">
                                <FiShield className="w-8 h-8 text-green-400 mx-auto" />
                                <p className="text-sm text-gray-300">Verify your identity with OTP</p>
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-2">
                                <FiLock className="w-8 h-8 text-purple-400 mx-auto" />
                                <p className="text-sm text-gray-300">Create a strong new password</p>
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

export default ForgotPassword