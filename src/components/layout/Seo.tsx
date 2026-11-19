import { useEffect } from 'react';
import { SITE } from '@/data/site';

/** Titolo, description e canonical per pagina (SPA). */
export function Seo({ title, description, path }: { title: string; description: string; path: string }) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, val: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(sel) as HTMLElement | null;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    const meta = (name: string, prop = false) => () => {
      const m = document.createElement('meta');
      m.setAttribute(prop ? 'property' : 'name', name);
      return m;
    };
    set('meta[name="description"]', 'content', description, meta('description'));
    set('meta[property="og:title"]', 'content', title, meta('og:title', true));
    set('meta[property="og:description"]', 'content', description, meta('og:description', true));
    set('meta[property="og:url"]', 'content', SITE.url + path, meta('og:url', true));
    set('link[rel="canonical"]', 'href', SITE.url + path, () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
  }, [title, description, path]);
  return null;
}
