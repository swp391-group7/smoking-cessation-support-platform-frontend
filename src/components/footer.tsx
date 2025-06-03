// src/components/footer.tsx

export const Footer = () => {
    const name = "John Doe"; // Replace with your name or fetch dynamically
 return (
  <footer className="bg-gray-800 text-white py-4 mt-auto">
    <div className="container mx-auto text-center">
      © {new Date().getFullYear()} MyApp. All rights reserved.
      <div>my name is  {name} </div>
    </div>
  </footer>
);
}
export default Footer;