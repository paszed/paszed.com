import { site } from "@/config/site";

export function GET() {
  const body = `# ${site.owner}

${site.description}

## Website

- [Home](${site.url}/)
- [About](${site.url}/about)
- [Projects](${site.url}/projects)
- [Specifications](${site.url}/specs)
- [Contact](${site.url}/contact)

## Discovery

- [Sitemap](${site.url}/sitemap.xml)
- [Robots](${site.url}/robots.txt)

## Languages

The website is available in English, German, and Hungarian.
English is the default language. German pages use /de and Hungarian pages use /hu.

## Author

- Name: ${site.owner}
- Website: ${site.url}/
- Email: ${site.email}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
