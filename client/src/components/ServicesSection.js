import React from 'react';
import { motion } from 'framer-motion';

const coachingServices = [
  {
    title: "Wellness Empowerment",
    description:
      "Helps clients build a balanced, empowered approach to wellness, addressing mental, emotional, and lifestyle factors to enhance overall well-being.",
  },
  {
    title: "Resilient Mindset",
    description:
      "Supports clients in developing mental resilience and a positive mindset, enabling them to navigate challenges and setbacks with strength and adaptability.",
  },
  {
    title: "Holistic Growth",
    description:
      "Takes a whole-person approach, encouraging personal and professional growth by addressing emotional, mental, and lifestyle goals for a more fulfilling life.",
  },
  {
    title: "Emotional Wellness",
    description:
      "Guides clients in cultivating emotional health and stability, empowering them to manage stress, improve relationships, and achieve a sense of inner peace.",
  },
  {
    title: "Life Empowerment",
    description:
      "Focuses on empowering clients to take control of their life goals, make proactive choices, and build confidence to create meaningful change in various life areas.",
  },
  {
    title: "Boundaries",
    description:
      "Helps clients establish healthy boundaries to protect their time, energy, and well-being, fostering more balanced and fulfilling relationships.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: 'easeOut' },
};

function ServicesSection() {
  return (
    <section className="services-section">
      <motion.h2
        className="services-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      >
        Our Services
      </motion.h2>
      <div className="services-list">
        {coachingServices.map((service, index) => (
          <motion.div
            className="service-item"
            key={index}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.3 }}
          >
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;