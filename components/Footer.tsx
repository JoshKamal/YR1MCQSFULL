import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Medical MCQ Quiz</h3>
            <p className="text-gray-400 mb-4">Enhance your medical knowledge with our comprehensive question bank and advanced learning tools.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link></li>
              <li><Link href="/practice" className="text-gray-400 hover:text-white transition">Practice</Link></li>
              <li><Link href="/modules" className="text-gray-400 hover:text-white transition">Modules</Link></li>
              <li><Link href="/subscription" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="bi bi-envelope text-gray-400 mr-2 mt-1"></i>
                <span className="text-gray-400">support@medicalquiz.com</span>
              </li>
              <li className="flex items-start">
                <i className="bi bi-telephone text-gray-400 mr-2 mt-1"></i>
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <i className="bi bi-geo-alt text-gray-400 mr-2 mt-1"></i>
                <span className="text-gray-400">123 Medical Center Dr, Suite 456<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Medical MCQ Quiz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
