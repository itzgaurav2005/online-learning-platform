import Layout from '../components/Layout';
import Link from 'next/link';
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="text-purple-600" size={32} />,
      title: 'Comprehensive Courses',
      description: 'Access hundreds of courses across various subjects and skill levels',
    },
    {
      icon: <Users className="text-indigo-600" size={32} />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators',
    },
    {
      icon: <Award className="text-pink-600" size={32} />,
      title: 'Certificates',
      description: 'Earn certificates upon course completion to showcase your skills',
    },
    {
      icon: <TrendingUp className="text-blue-600" size={32} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Courses' },
    { number: '100+', label: 'Expert Instructors' },
    { number: '50,000+', label: 'Certificates Issued' },
  ];

  return (
    <Layout title="LearnHub - Master New Skills Online">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight">
                Master New Skills at Your Own Pace
              </h1>
              <p className="text-xl text-purple-100">
                Join thousands of students learning from expert instructors. Start your journey to success today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/courses" className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
                  Explore Courses
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
                <Link href="/register" className="btn-secondary border-white text-white hover:bg-white hover:text-purple-600">
                  Get Started Free
                </Link>
              </div>
            </div>

            <div className="hidden md:block animate-fade-in animate-delay-200">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-400 rounded-full p-2">
                        <Star className="text-white" size={20} />
                      </div>
                      <div>
                        <div className="text-white font-semibold">4.9/5 Average Rating</div>
                        <div className="text-purple-200 text-sm">From 10,000+ students</div>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 space-y-2">
                      <div className="text-purple-200 text-sm">Popular This Week</div>
                      <div className="text-white font-semibold">Web Development Bootcamp</div>
                      <div className="flex items-center space-x-2 text-sm text-purple-200">
                        <Users size={16} />
                        <span>1,234 enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="font-display text-4xl md:text-5xl gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl mb-4 text-gray-900">
              Why Choose LearnHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display text-4xl md:text-5xl">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-purple-100">
            Join our community of learners and unlock your potential today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register" className="btn-primary bg-white text-purple-600 hover:bg-gray-100">
              Sign Up Now
            </Link>
            <Link href="/courses" className="btn-secondary border-white text-white hover:bg-white hover:text-purple-600">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <span className="font-display text-xl text-white">LearnHub</span>
              </div>
              <p className="text-sm">
                Empowering learners worldwide with quality education
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Become a Student</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Teach on LearnHub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
