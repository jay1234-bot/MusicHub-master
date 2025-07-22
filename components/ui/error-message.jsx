import { motion } from "framer-motion";
import { Button } from "./button";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center p-6 bg-background/80 rounded-xl shadow-lg border border-red-300 mx-auto my-8 max-w-xs"
    >
      <span className="text-red-500 text-2xl mb-2">⚠️</span>
      <p className="text-center text-base text-red-600 mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </motion.div>
  );
} 