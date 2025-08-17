import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

// SVG Icon Components for features
const IconRealTime = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconUserRoles = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconAlerts = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconLogs = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);


const LandingPage = () => {
  const features = [
    {
      icon: <IconRealTime />,
      title: "Real-Time Inventory Tracking",
      description: "Monitor your stock levels instantly and avoid surprises with up-to-date inventory data.",
    },
    {
      icon: <IconUserRoles />,
      title: "Role-Based User Access",
      description: "Assign permissions to managers and staff, ensuring secure and appropriate access for every user.",
    },
    {
      icon: <IconAlerts />,
      title: "Low-Stock Alerts",
      description: "Get notified when items run low so you can restock in time and never miss a sale.",
    },
    {
      icon: <IconLogs />,
      title: "Activity & Change Logs",
      description: "Track every change and action for full accountability and easy auditing.",
    },
  ];

  // GSAP smooth scroll handler
  const scrollToSection = (id: string) => {
    gsap.to(window, {
      duration: 0, // instant scroll
      scrollTo: { y: `#${id}`, offsetY: 0 },
      ease: 'none',
    });
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Anchor for Home section */}
      <div id="home"></div>
      {/* New Header/Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">
            <Link to="/">Invntry</Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-600 hover:text-primary-600 bg-transparent border-none cursor-pointer"
              style={{ padding: 0 }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-primary-600 bg-transparent border-none cursor-pointer"
              style={{ padding: 0 }}
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-primary-600 bg-transparent border-none cursor-pointer"
              style={{ padding: 0 }}
            >
              Features
            </button>
            <Link
              to="/register"
              className="bg-primary-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
          </nav>
          <div className="md:hidden">
            {/* Mobile Menu Button can be added here */}
            <button className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main>
        {/* New Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                Product Inventory, Simplified.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Gain control and visibility over your stock with our intuitive platform. Track, manage, and optimize with ease.
              </p>
              <Link
                to="/register"
                className="inline-block bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-primary-700 transition"
              >
                Start For Free
              </Link>
            </div>
            {/* Right Column: Illustration */}
            <div className="flex justify-center">
              {/* Replace this with your own illustration */}
              <img src = "public/3d-rendering-ecommerce-background.png" alt="Inventory Management Illustration" className="max-w-full h-auto" />
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">About Us</h2>
            <p className="text-lg text-gray-600">
              Invntry is dedicated to helping businesses of all sizes manage their inventory with ease and efficiency. Our mission is to provide intuitive, powerful tools that streamline your workflow and empower your team to succeed.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Everything You Need to Succeed</h2>
              <p className="mt-4 text-lg text-gray-600">
                Powerful features designed to streamline your workflow.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Invntry. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;