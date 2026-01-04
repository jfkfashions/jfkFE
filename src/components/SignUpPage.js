import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, Link } from "react-router-dom";
import image from "../images/singup.webp";
import "../styles/global.css";
import "../styles/SignUpPage.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    role: "client",
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    gender: "",
    birthdate: "",
  });

  const navigate = useNavigate();
  const [maildata, setMaildata] = useState({
    message: "",
    subject: "",
    username: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setLoading(true);

      // Validate passwords
      if (userData.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      await axios.post(`${backendUrl}/api/users/signup/`, userData);

      // maildata.message = `
      //   <p>Dear <strong>${userData.firstname} ${userData.lastname}</strong>,</p>
      //   <p>Your client profile has just been created with <strong>JFK Tailor Shop</strong>.</p>
      //   <p><strong>Username:</strong> ${userData.username}</p>
      //   <p><strong>Password:</strong> ${userData.password}</p>
      //   <p>Please expect to hear from us again when your order is created.</p>
      //   <p>Thanks for choosing <strong>JFK Tailor Shop</strong>.</p>
      //   <p>Best regards,<br/>JFK Tailor Shop</p>
      // `;
      maildata.message = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to JFK Tailor Shop</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .tagline {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .welcome-title {
            color: #8B4513;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 25px;
            color: #444;
        }
        
        .highlight {
            color: #A0522D;
            font-weight: 600;
        }
        
        .credentials-box {
            background: linear-gradient(135deg, rgba(139, 69, 19, 0.05) 0%, rgba(160, 82, 45, 0.05) 100%);
            border-left: 4px solid #8B4513;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        
        .credential-item {
            display: flex;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(139, 69, 19, 0.1);
        }
        
        .credential-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .credential-label {
            font-weight: 600;
            color: #8B4513;
            min-width: 100px;
        }
        
        .credential-value {
            font-weight: 500;
            color: #222;
        }
        
        .security-note {
            background-color: #fff8f0;
            border: 1px solid #ffd8b2;
            border-radius: 8px;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
        }
        
        .security-icon {
            color: #DC143C;
            font-weight: bold;
            margin-right: 5px;
        }
        
        .next-steps {
            background-color: #f0f8ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .steps-title {
            color: #8B4513;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .step-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .step-number {
            background: #8B4513;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .contact-info {
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            margin: 25px 0;
        }
        
        .contact-title {
            color: #8B4513;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .footer {
            text-align: center;
            padding: 25px 20px;
            background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
            color: white;
            font-size: 14px;
        }
        
        .signature {
            font-style: italic;
            margin-top: 15px;
            opacity: 0.9;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-icon {
            display: inline-block;
            margin: 0 8px;
            color: white;
            font-size: 18px;
            text-decoration: none;
        }
        
        @media (max-width: 600px) {
            .email-body {
                padding: 20px 15px;
            }
            
            .welcome-title {
                font-size: 20px;
            }
            
            .greeting {
                font-size: 16px;
            }
            
            .credential-item {
                flex-direction: column;
            }
            
            .credential-label {
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="logo">JFK TAILOR SHOP</div>
            <div class="tagline">Where We Create Magic</div>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <h2 class="welcome-title">🎉 Welcome to JFK Tailor Shop!</h2>
            
            <p class="greeting">
                Dear <span class="highlight">${userData.firstname} ${userData.lastname}</span>,
            </p>
            
            <p>We're absolutely thrilled to welcome you to the JFK Tailor Shop family! Your journey to perfectly tailored clothing begins now. 🎩✨</p>
            
            <!-- Credentials Box -->
            <div class="credentials-box">
                <div class="credential-item">
                    <span class="credential-label">Username:</span>
                    <span class="credential-value">${userData.username}</span>
                </div>
                <div class="credential-item">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">${userData.password}</span>
                </div>
            </div>
            
            <!-- Security Note -->
            <div class="security-note">
                <p>🔒 <span class="security-icon">Important:</span> For your security, we recommend changing your password after your first login.</p>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3 class="steps-title">📋 What's Next?</h3>
                
                <div class="step-item">
                    <span class="step-number">1</span>
                    <span>Login to your account using the credentials above</span>
                </div>
                
                <div class="step-item">
                    <span class="step-number">2</span>
                    <span>Complete your profile and upload a profile picture</span>
                </div>
                
                <div class="step-item">
                    <span class="step-number">3</span>
                    <span>Submit your body measurements for accurate tailoring</span>
                </div>
                
                <div class="step-item">
                    <span class="step-number">4</span>
                    <span>Browse our catalog and place your first order!</span>
                </div>
            </div>
            
            <!-- About Us -->
            <p>At <strong class="highlight">JFK Tailor Shop</strong>, we believe that great clothing should fit perfectly and reflect your unique style. Our expert tailors are dedicated to creating garments that not only fit well but also make you feel confident and stylish.</p>
            
            <p>✨ <strong>Pro Tip:</strong> Keep an eye on your inbox! We'll notify you about:</p>
            <ul style="margin-left: 20px; margin-bottom: 20px;">
                <li>Order confirmations and updates</li>
                <li>Special promotions and discounts</li>
                <li>New fabric arrivals</li>
                <li>Style tips and fashion advice</li>
            </ul>
            
            <!-- Contact Info -->
            <div class="contact-info">
                <h3 class="contact-title">📞 Need Help?</h3>
                <p>Our customer support team is here to assist you:</p>
                <p><strong>Email:</strong> support@jfktailorshop.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM</p>
            </div>
            
            <p style="text-align: center; font-size: 16px; margin-top: 25px;">
                Thank you for choosing <strong class="highlight">JFK Tailor Shop</strong>.<br>
                We can't wait to create something magical for you! ✂️🧵
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>JFK Tailor Shop | Where Excellence Meets Elegance</p>
            <p>123 Fashion Avenue, Style District | New York, NY 10001</p>
            
            <div class="social-links">
                <a href="#" class="social-icon">📘</a>
                <a href="#" class="social-icon">📷</a>
                <a href="#" class="social-icon">🐦</a>
                <a href="#" class="social-icon">📌</a>
            </div>
            
            <p class="signature">Best regards,<br>The JFK Tailor Shop Team</p>
            
            <p style="font-size: 12px; opacity: 0.7; margin-top: 15px;">
                This email was sent to ${userData.email} because you signed up for JFK Tailor Shop.<br>
                If you believe you received this in error, please ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
`;
      maildata.subject = "Your Profile with JFK";
      maildata.username = userData.username;
      setMaildata(maildata);

      await axios.post(`${backendUrl}/api/users/notifications/email`, maildata);

      setSuccessMessage(
        "Account created successfully! Redirecting to login..."
      );

      // Wait a moment before redirecting
      setTimeout(() => {
        navigate(localStorage.getItem("username") ? -1 : "/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "An error occurred during sign-up. Please try again."
      );
      console.error("Error during sign-up", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  const handleBackToLogin = () =>
    navigate(localStorage.getItem("username") ? -1 : "/login");

  return (
    <div
      className="page signup-page"
      style={{
        backgroundImage: `url(${image})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="container-signup">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBackToLogin}
          className="button button-secondary back-button"
          aria-label="Go back to login page"
          style={{
            background: COLORS.SECONDARY_RED,
            color: COLORS.TEXT_WHITE,
            alignSelf: "flex-start",
            marginBottom: "20px",
          }}
        >
          ← Back to Login
        </button>

        {/* Signup header */}
        <div className="signup-header">
          <h2 className="heading-signup">Create Your Account</h2>
          <p className="signup-subtitle">
            Join JFK Tailor Shop and start your journey with us
          </p>
        </div>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstname" className="form-label">
                  First Name *
                </label>
                <input
                  id="firstname"
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  className="input signup-input"
                  placeholder="Enter your first name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname" className="form-label">
                  Last Name *
                </label>
                <input
                  id="lastname"
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  className="input signup-input"
                  placeholder="Enter your last name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="input signup-input"
                  required
                  disabled={loading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="birthdate" className="form-label">
                  Date of Birth *
                </label>
                <input
                  id="birthdate"
                  type="date"
                  name="birthdate"
                  value={userData.birthdate}
                  onChange={handleChange}
                  className="input signup-input"
                  required
                  disabled={loading}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="phonenumber" className="form-label">
                  Phone Number *
                </label>
                <input
                  id="phonenumber"
                  type="tel"
                  name="phonenumber"
                  value={userData.phonenumber}
                  onChange={handleChange}
                  className="input signup-input"
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
                  pattern="[0-9]*"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="input signup-input"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  className="input signup-input"
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                  <span className="password-hint"> (min. 6 characters)</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="input signup-input"
                  placeholder="Create a secure password"
                  required
                  disabled={loading}
                  minLength="6"
                />
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {errorMessage && (
            <div
              className="error-message"
              role="alert"
              aria-live="assertive"
              style={{
                color: COLORS.ERROR,
                background: "rgba(239, 68, 68, 0.1)",
                borderLeft: `3px solid ${COLORS.ERROR}`,
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              className="success-message"
              role="alert"
              aria-live="assertive"
              style={{
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.1)",
                borderLeft: "3px solid #10B981",
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="terms-container">
            <p className="terms-text">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="terms-link">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="terms-link">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="button button-primary signup-button"
            disabled={loading}
            style={{
              background: COLORS.BUTTON_ACTIVE,
              color: COLORS.TEXT_WHITE,
              width: "100%",
              marginTop: "20px",
            }}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="login-link-container">
          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
