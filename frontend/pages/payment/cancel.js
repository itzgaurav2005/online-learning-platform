import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancel() {
  const router = useRouter();
  const { course_id } = router.query;

  return (
    <Layout title="Payment Cancelled - LearnHub">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center animate-fade-in">
            {/* Cancel Icon */}
            <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-red-600" size={64} />
            </div>

            {/* Cancel Message */}
            <h1 className="font-display text-4xl text-gray-900 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your payment was not processed
            </p>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What happened?</h3>
              <p className="text-gray-600 text-sm mb-4">
                You cancelled the payment process or closed the checkout window. 
                No charges have been made to your account.
              </p>
              <p className="text-gray-600 text-sm">
                The course is still available if you'd like to try again.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {course_id ? (
                <Link
                  href={`/courses/${course_id}`}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Course</span>
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <ArrowLeft size={20} />
                  <span>Browse Courses</span>
                </Link>
              )}
              <Link
                href="/dashboard/student"
                className="btn-secondary"
              >
                Go to Dashboard
              </Link>
            </div>

            {/* Help Text */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-2">
                Need help with payment?
              </p>
              <p className="text-sm text-gray-600">
                Contact us at{' '}
                <a href="mailto:support@learnhub.com" className="text-purple-600 hover:text-purple-700 font-medium">
                  support@learnhub.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}