import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaUsers, FaRocket, FaLightbulb, FaTools, FaBook, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const features = [
    {
      icon: <FaCode className="text-3xl" />,
      title: "Comprehensive Guides",
      description: "Step-by-step installation and usage instructions for various technologies, frameworks, and tools. Perfect for both beginners and experienced developers."
    },
    {
      icon: <FaTools className="text-3xl" />,
      title: "Technology Comparison",
      description: "Detailed side-by-side comparisons of different technologies, helping you make informed decisions for your projects."
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "Troubleshooting Tips",
      description: "Solutions to common issues and challenges, with detailed explanations and best practices for problem resolution."
    },
    {
      icon: <FaBook className="text-3xl" />,
      title: "Best Practices",
      description: "Industry-standard approaches and methodologies for implementing technologies effectively and efficiently."
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Tech News & Updates",
      description: "Stay updated with the latest technology trends, news, and updates from across the web."
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Security Guidelines",
      description: "Essential security practices and guidelines for implementing technologies safely and securely."
    }
  ];

  const stats = [
    { number: "100+", label: "Technologies Covered" },
    { number: "24/7", label: "Community Support" },
    { number: "50K+", label: "Monthly Users" },
    { number: "1000+", label: "Guides & Resources" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <FaRocket className="text-5xl text-blue-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to Tech Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive platform for technology exploration, learning, and implementation.
            We're here to make your tech journey smoother and more successful.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-3xl font-bold text-blue-500 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.section 
          {...fadeInUp}
          className="mb-16 bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaUsers className="text-blue-500" />
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At Tech Hub, we're on a mission to democratize technology knowledge and make it accessible to everyone. 
            We believe that understanding and implementing technology shouldn't be a daunting task. Our platform 
            provides comprehensive resources, guides, and tools to help developers of all skill levels navigate 
            the complex world of technology with confidence and ease.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          {...fadeInUp}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Community Section */}
        <motion.section 
          {...fadeInUp}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg mb-8">
              Be part of a growing community of developers, tech enthusiasts, and learners. 
              Share your knowledge, learn from others, and stay updated with the latest in technology.
            </p>
            <motion.a
              href="https://github.com/PiyushTiwari10/T-HUB-"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </motion.a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;