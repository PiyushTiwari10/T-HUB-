import React from 'react';

const About = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-[2.5rem] text-[#333] mb-4 md:text-[2rem]">About Tech Hub</h1>
        <div className="h-1 w-[60px] bg-[#4a6cf7] mx-auto"></div>
      </div>
      
      <div className="flex flex-col gap-12">
        <section className="mb-6">
          <h2 className="text-[1.8rem] text-[#333] mb-4 relative pb-2 md:text-[1.5rem]">
            Our Mission
            <div className="absolute bottom-0 left-0 w-[40px] h-[3px] bg-[#4a6cf7]"></div>
          </h2>
          <p className="text-[1.1rem] leading-relaxed text-[#555]">
            Tech Hub aims to simplify the technology landscape by providing comprehensive guides
            and resources for developers of all skill levels. We believe that technology should be
            accessible to everyone, and our platform is designed to help you navigate the complex
            world of tech stacks with ease.
          </p>
        </section>
        
        <section className="mb-6">
          <h2 className="text-[1.8rem] text-[#333] mb-4 relative pb-2 md:text-[1.5rem]">
            What We Offer
            <div className="absolute bottom-0 left-0 w-[40px] h-[3px] bg-[#4a6cf7]"></div>
          </h2>
          <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
            <li className="flex items-start gap-4 p-6 rounded-lg bg-[#f8f9fa] transition-transform duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
              <span className="text-[2rem] text-[#4a6cf7]">📚</span>
              <div>
                <h3 className="mb-2 text-[1.3rem] text-[#333]">Comprehensive Guides</h3>
                <p className="m-0 text-base text-[#555]">Detailed installation and usage instructions for various technologies</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-6 rounded-lg bg-[#f8f9fa] transition-transform duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
              <span className="text-[2rem] text-[#4a6cf7]">🔍</span>
              <div>
                <h3 className="mb-2 text-[1.3rem] text-[#333]">Technology Comparison</h3>
                <p className="m-0 text-base text-[#555]">Side-by-side comparisons to help you choose the right tools</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-6 rounded-lg bg-[#f8f9fa] transition-transform duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
              <span className="text-[2rem] text-[#4a6cf7]">💡</span>
              <div>
                <h3 className="mb-2 text-[1.3rem] text-[#333]">Troubleshooting Tips</h3>
                <p className="m-0 text-base text-[#555]">Solutions to common issues you might encounter</p>
              </div>
            </li>
            <li className="flex items-start gap-4 p-6 rounded-lg bg-[#f8f9fa] transition-transform duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
              <span className="text-[2rem] text-[#4a6cf7]">🚀</span>
              <div>
                <h3 className="mb-2 text-[1.3rem] text-[#333]">Best Practices</h3>
                <p className="m-0 text-base text-[#555]">Industry-standard approaches to technology implementation</p>
              </div>
            </li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-[1.8rem] text-[#333] mb-4 relative pb-2 md:text-[1.5rem]">
            Our Team
            <div className="absolute bottom-0 left-0 w-[40px] h-[3px] bg-[#4a6cf7]"></div>
          </h2>
          <p className="text-[1.1rem] leading-relaxed text-[#555]">
            Tech Hub is maintained by a team of passionate developers and technology enthusiasts
            who are committed to sharing knowledge and helping others succeed in their tech journey.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;