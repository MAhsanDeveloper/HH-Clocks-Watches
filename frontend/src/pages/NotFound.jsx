import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-gray-700 mb-6">Page not found. Go back to <Link to="/" className="text-blue-600 underline">Home</Link>.</p>
    </section>
  );
};

export default NotFound;
