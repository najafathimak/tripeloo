import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image
              src="/assets/logo_new.png"
              alt="Tripeloo Logo"
              width={150}
              height={50}
              className="h-10 sm:h-12 w-auto mb-2"
            />
            <p className="mt-2 text-sm text-gray-600">India's travel platform for stays, activities, and curated trips.</p>
          </div>
          <div>
            <div className="font-semibold">Quick Links</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link className="hover:text-brand" href="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-brand" href="/terms">Terms</Link></li>
              <li><Link className="hover:text-brand" href="/help">Help</Link></li>
              <li><Link className="hover:text-brand" href="/partner">Partner with Us</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Connect</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a className="hover:text-brand" href="https://instagram.com" target="_blank">Instagram</a></li>
              <li><a className="hover:text-brand" href="https://youtube.com" target="_blank">YouTube</a></li>
              <li><a className="hover:text-brand" href="https://wa.me/0000000000" target="_blank">WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Contact</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Email: <a className="hover:text-brand underline underline-offset-2" href="mailto:hello@tripeloo.com">hello@tripeloo.com</a></li>
              <li>Phone: +91 00000 00000</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-500">© {new Date().getFullYear()} Tripeloo. All rights reserved.</div>
      </div>
    </footer>
  );
}

