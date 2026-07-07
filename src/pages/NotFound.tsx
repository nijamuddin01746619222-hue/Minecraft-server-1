import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
      <h1 className="text-6xl font-bold text-black mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-600 mb-8">Page Not Found</h2>
      <p className="text-gray-700 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-3 rounded-lg transition-colors"
      >
        RETURN TO STORE
      </Link>
    </div>
  );
}
