import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        {/* 404 Icon */}
        <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8">
          <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M15 3H9a2 2 0 00-2 2v1.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 000 1.414l6.414 6.414A1 1 0 009 21.586V23a2 2 0 002 2h6a2 2 0 002-2v-1.586a1 1 0 01.293-.707l6.414-6.414a1 1 0 000-1.414L19.293 7.293A1 1 0 0119 6.586V5a2 2 0 00-2-2z" />
          </svg>
        </div>

        {/* Error Content */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, it happens to the best of us!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto btn-secondary"
            >
              <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto btn-primary inline-block"
            >
              <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home Page
            </Link>
          </div>

          {/* Fun Facts */}
          <div className="mt-12 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Fun Fact!</h3>
            <p className="text-xs text-blue-700">
              The term "404 error" comes from the room number at CERN where the World Wide Web was born. 
              Room 404 was where they kept the central database!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound