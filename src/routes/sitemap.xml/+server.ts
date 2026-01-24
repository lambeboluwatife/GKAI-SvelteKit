import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const domain = 'https://gkai-svelte-kit.vercel.app';
	const pages = ['', 'game', 'leaderboard', 'stats', 'how-to-play', 'login', 'register', 'profile'];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map((page) => {
		return `  <url>
    <loc>${domain}/${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
	})
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
