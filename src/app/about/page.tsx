import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg mb-8">This is the About page of our website.</p>
      <Link href="/" className="text-blue-500 hover:underline">
        Back to Homepage
      </Link>
    </div>
  );
}