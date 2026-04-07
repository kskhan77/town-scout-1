import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  // These classes match the cyan/rounded look in your TownScout design
  const baseStyles = "px-6 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95";
  
  const variants = {
    primary:
      "bg-gradient-to-r from-[#00b8e6] to-[#00d1ff] text-white shadow-md shadow-[#002d5b]/15 hover:brightness-105",
    secondary: "border-2 border-[#00d1ff] bg-white text-[#002d5b] hover:bg-cyan-50",
    outline: "border border-transparent text-slate-600 hover:text-[#002d5b]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};