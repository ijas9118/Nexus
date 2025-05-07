import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-2 bg-[#0568FF]"></div>
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Payment Cancelled
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Your mentor booking was not completed. No charges have been made
              to your account.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What would you like to do?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <ArrowLeft className="h-5 w-5 text-[#0568FF] mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Try Again</p>
                  <p className="text-gray-600">
                    Return to the booking page and try a different payment
                    method
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MessageCircle className="h-5 w-5 text-[#0568FF] mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">Need Help?</p>
                  <p className="text-gray-600">
                    Contact our support team if you're experiencing issues
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Link to="/mentors" className="flex-1">
              <button className="w-full bg-[#0568FF] hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                Try Again
              </button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/myFeed"
              className="text-[#0568FF] hover:text-blue-700 font-medium inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
