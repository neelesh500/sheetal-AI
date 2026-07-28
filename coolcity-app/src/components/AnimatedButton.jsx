import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AnimatedButton.css';

export default function AnimatedButton({ 
  children, 
  to, 
  external, 
  variant = 'primary', 
  className = '', 
  onClick 
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    
    // Add a slight delay for the animation to play before navigating
    setTimeout(() => {
      if (external) {
        window.open(to, '_blank', 'noopener,noreferrer');
      } else if (to) {
        navigate(to);
      }
    }, 300);
  };

  return (
    <motion.button
      className={`animated-btn btn-${variant} ${className}`}
      whileHover={{ scale: 1.05, translateY: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
    >
      <span className="btn-content">{children}</span>
      <div className="btn-glow"></div>
    </motion.button>
  );
}
