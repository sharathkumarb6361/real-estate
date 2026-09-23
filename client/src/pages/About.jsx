import { Target, Users, Award, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={logo} alt="EstateHub Logo" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EstateHub</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property. We make real estate simple, transparent, and accessible for everyone.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, EstateHub has grown from a small startup to one of the most trusted real estate platforms in India. Our mission is to simplify the property buying and selling process through technology and transparency.
            </p>
            <p className="text-gray-600 mb-4">
              We believe that everyone deserves to find their dream home without the hassle and confusion that often comes with real estate transactions. That's why we've built a platform that puts you first.
            </p>
            <p className="text-gray-600">
              With a team of experienced professionals and cutting-edge technology, we're committed to providing you with the best real estate experience possible.
            </p>
          </div>
          <div className="bg-blue-100 rounded-xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-gray-600">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Expert Agents</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparency</h3>
              <p className="text-gray-600">We believe in complete transparency in all our dealings.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">Our customers are at the heart of everything we do.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in every aspect of our service.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">We conduct business with the highest ethical standards.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">R</span>
              </div>
              <div>
                <h3 className="font-semibold">Rahul Sharma</h3>
                <p className="text-sm text-gray-500">Home Buyer</p>
              </div>
            </div>
            <p className="text-gray-600">
              "EstateHub made finding my dream home so easy. The platform is intuitive and the agents were incredibly helpful throughout the process."
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">P</span>
              </div>
              <div>
                <h3 className="font-semibold">Priya Patel</h3>
                <p className="text-sm text-gray-500">Property Investor</p>
              </div>
            </div>
            <p className="text-gray-600">
              "I've bought multiple properties through EstateHub. Their transparency and professionalism are unmatched in the industry."
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">A</span>
              </div>
              <div>
                <h3 className="font-semibold">Amit Kumar</h3>
                <p className="text-sm text-gray-500">First-time Buyer</p>
              </div>
            </div>
            <p className="text-gray-600">
              "As a first-time home buyer, I was nervous about the process. EstateHub guided me every step of the way. Highly recommended!"
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of happy customers who found their perfect property with EstateHub</p>
          <a
            href="/properties"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Browse Properties
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
