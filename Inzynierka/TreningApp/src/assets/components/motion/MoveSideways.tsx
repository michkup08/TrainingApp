import { motion } from "framer-motion";

function MoveSideways({ children, direction }: { children: React.ReactNode, direction: string }) 
{
  return (
    <motion.div
      initial={{ x: direction === 'left' ? -window.innerWidth : window.innerWidth, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.1, ease: 'easeInOut' },
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default MoveSideways;
