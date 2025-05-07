import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-2 bg-[#0568FF]"></div>
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-[#0568FF]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Your mentor booking has been confirmed. We've sent the details to
              your email.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Booking Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#0568FF] mt-0.5 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">
                    Session Information
                  </p>
                  <p className="text-gray-600">60-minute Mentorship Call</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-5 w-5 text-[#0568FF] mt-0.5 mr-3 flex items-center justify-center">
                  <span className="text-lg font-semibold">$</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Payment Amount</p>
                  <p className="text-gray-600">$150.00 USD</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Link to="/myFeed" className="flex-1">
              <button className="w-full bg-[#0568FF] hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
