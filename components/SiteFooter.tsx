import Link from "next/link";
import { ArrowUpRight, Disc3 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div><div className="footer-kicker"><Disc3 size={18} /> MADE FOR THE MOMENT</div><h2>Musiknya dekat.<br /><em>Momenmu lekat.</em></h2></div>
        <div className="footer-side"><p>Temukan konser yang ingin kamu hadiri dan simpan setiap momennya bersama MelodyTix.</p><Link href="/" className="text-link">Jelajahi konser <ArrowUpRight size={17} /></Link></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} MelodyTix</span><span>Dibuat untuk pecinta musik.</span></div>
    </footer>
  );
}
