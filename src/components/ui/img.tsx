import { cn } from '@/lib/utils';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** id della foto importata, es. "foto-001" (public/img/foto-001-{sm,md,lg}.webp) */
  photo: string;
  sizes?: string;
  priority?: boolean;
};

/** Foto WebP responsive generate da scripts/import-content.mjs */
export function Img({ photo, sizes = '100vw', priority, className, alt = '', ...rest }: Props) {
  const base = `/img/${photo}`;
  return (
    <img
      src={`${base}-md.webp`}
      srcSet={`${base}-sm.webp 640w, ${base}-md.webp 1100w, ${base}-lg.webp 1920w`}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={cn('block h-full w-full object-cover', className)}
      {...rest}
    />
  );
}
