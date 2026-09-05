import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-purple-50">
      <div className="blob bg-purple-300 w-96 h-96 top-0 left-20"></div>
      <div className="blob bg-fuchsia-200 w-96 h-96 top-40 right-20" style={{ animationDelay: '2s' }}></div>
      <div className="blob bg-purple-200 w-96 h-96 -bottom-8 left-40" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 w-full max-w-5xl p-6 text-center animate-fade-in-up flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-purple-200 shadow-sm text-sm font-bold text-purple-600 mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Vibrant & Clean UI Experience</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-slate-800">
          Form<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600">App</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
          A beautifully simple way to submit your details and manage applications securely.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link to="/login/customer" className="w-full sm:w-auto">
            <button className="btn-primary w-full px-10 flex items-center justify-center gap-3">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          
          <Link to="/login/admin" className="w-full sm:w-auto">
            <button className="btn-secondary w-full px-10 flex items-center justify-center gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Admin Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
