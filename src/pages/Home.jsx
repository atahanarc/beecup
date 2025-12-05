import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import Locations from '../components/Locations';
import AppSection from '../components/AppSection';
import FeedbackSection from '../components/FeedbackSection';

const ScrollReveal = ({ children, delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}>
      {children}
    </motion.div>
);

const Home = ({ onProductSelect }) => {
  return (
    <>
        <ScrollReveal><Hero /></ScrollReveal>
        <ScrollReveal delay={0.2}>
            <MenuSection onProductSelect={onProductSelect} />
        </ScrollReveal>
        <ScrollReveal><AppSection /></ScrollReveal>
        <ScrollReveal><Locations /></ScrollReveal>
        <ScrollReveal><FeedbackSection /></ScrollReveal>
    </>
  );
};

export default Home;