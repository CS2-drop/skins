import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <div>
      <a href="/rules">Rules</a> | <a href="/privacy">Privacy Policy</a> | <a href="/contact">Contact</a>
    </div>
    <div>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
      {/* Add more social links */}
    </div>
    <p>&copy; {new Date().getFullYear()} CS2-Drop. All rights reserved.</p>
  </footer>
);

export default Footer;