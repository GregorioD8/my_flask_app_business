// CoachCard.js
import React, { memo } from 'react';
import { motion } from 'framer-motion';

const CoachCard = memo(({ coach, FRONTEND_URL }) => (
  <motion.div
    className="col-md-4 mb-4"
    initial={{ opacity: 0, y: 30 }} // Start animation with slight opacity and offset
    animate={{ opacity: 1, y: 0 }} // Animate to full opacity and position
    transition={{ duration: 0.6, ease: 'easeOut', delay: coach.id * 0.1 }} // Stagger animation by coach ID
  >
    <div className="card">
      <img
        src={`${FRONTEND_URL}/images/coaches/${coach.id}.jpeg`}
        alt={coach.name} // Use coach name as alt text for accessibility
        className="card-img-top"
        loading="lazy" // Lazy load image for performance
      />
      <div className="card-body">
        <h5 className="card-title">{coach.name}</h5>
        <p className="card-background"><strong>Background:</strong></p>
        <p className="card-text">{coach.specialization}</p>
      </div>
    </div>
  </motion.div>
));

export default CoachCard;