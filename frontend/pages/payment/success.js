import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../lib/api';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Loader, AlertCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
if (!router.isReady) return;
    
    if (session_id) {
      verifyPayment();
    }
  }, [router.isReady, session_id]);

  const verifyPayment = async () => {
    try {
      const { data } = await apiClient.get(`/payments/verify-session/${session_id}`);
      if (data.success) {
        setPayment(data.payment);
      } else {
        setError('Payment verification failed');
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  // if (!user) {
  //   return (
  //     <Layout>
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="text-center">
  //           <p className="text-gray-600">Please login to view payment status</p>
  //           <Link href="/login" className="btn-primary mt-4 inline-block">
  //             Login
  //           </Link>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout title="Payment Successful - LearnHub">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-2xl w-full">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <Loader className="animate-spin mx-auto text-purple-600 mb-4" size={48} />
              <p className="text-gray-600">Verifying your payment...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={64} className="mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Failed</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/courses" className="btn-primary inline-block">
                Back to Courses
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center animate-fade-in">
              {/* Success Icon */}
              <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="text-green-600" size={64} />
              </div>

              {/* Success Message */}
              <h1 className="font-display text-4xl gradient-text mb-4">
                Payment Successful!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Welcome to your new course! 🎉
              </p>

              {/* Payment Details */}
              {payment && (
                <div className="bg-purple-50 rounded-xl p-6 mb-8 text-left">
                  <h2 className="font-bold text-lg mb-4 text-center text-gray-900">
                    Payment Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course:</span>
                      <span className="font-semibold text-gray-900">{payment.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-semibold text-green-600">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: payment.currency.toUpperCase()
                        }).format(payment.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="badge badge-success">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Info */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You're now enrolled in the course</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Access all course materials immediately</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Track your progress as you learn</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Receive a certificate upon completion</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/student"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/courses"
                  className="btn-secondary"
                >
                  Browse More Courses
                </Link>
              </div>

              {/* Receipt Note */}
              <p className="text-sm text-gray-500 mt-8">
                A receipt has been sent to your email address
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}