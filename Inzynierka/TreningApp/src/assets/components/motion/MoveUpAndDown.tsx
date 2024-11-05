import { motion } from "framer-motion";

function MoveUpAndDown({ children, direction }: { children: React.ReactNode, direction: string }) 
{
  return (
    <motion.div
      initial={{ y: direction === 'up' ? window.innerHeight : -window.innerHeight, opacity: 0 }}
      animate={{ y: 0, x:0, opacity: 1 }}
      exit={{ 
        y: direction === 'up' ? -window.innerHeight : window.innerHeight, opacity: 0
      }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default MoveUpAndDown;
