// src/components/footer.tsx

export const Footer = () => (
  <footer className="bg-gray-800 text-white py-4 mt-auto">
    <div className="container mx-auto text-center">
      © {new Date().getFullYear()} MyApp. All rights reserved.
    </div>
  </footer>
);
export default Footer;