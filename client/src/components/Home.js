import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import LazySection from './LazySection';
import ServicesSection from './ServicesSection';

const CoachesSection = React.lazy(() => import('./CoachesSection'));

function Home() {
  const backgroundUrl = process.env.REACT_APP_BACKGROUND_URL;
  return (
    <div className="home-page">
      {/* Hero Section */}
      <header
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            Welcome
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          >
            Make Waves of Empowerment from Your Inner World Outward
          </motion.p>
        </div>
      </header>


      {/* Lazy Loaded Coaches Section */}
      <LazySection placeholder="Loading services...">
        <Suspense fallback={<div>Loading services...</div>}>
          <ServicesSection />
        </Suspense>
      </LazySection>
      {/* Lazy Loaded Coaches Section */}
      <LazySection placeholder="Loading coaches...">
        <Suspense fallback={<div>Loading coaches...</div>}>
          <CoachesSection />
        </Suspense>
      </LazySection>
      {/* Footer Section */}
      <footer>
        <p>&copy; 2024 Etherheal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;