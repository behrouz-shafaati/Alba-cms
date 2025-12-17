# ALBA CMS

ALBA CMS is an open-source, Next.js 15-based content management system focused on **static-first (SSG)** content generation, performance, and SEO. It uses **TailwindCSS** with **shadcn/ui**, **Tiptap** for JSON-based rich text, and **Server Actions** instead of API routes.

---

## Features

- Static-first content generation (SSG)
- Fully optimized for SEO and performance (LCP, FCP, etc.)
- Server Actions-based backend
- Rich text support via Tiptap (JSON)
- TailwindCSS + shadcn/ui components
- Migration tools for importing content, users, categories, and comments from WordPress
- WAF-friendly request patterns with authentication

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/behrouz-shafaati/Alba-cms
cd Alba-cms
```

2. Install dependencies:

```bash
pnpm install
```

3. Set environment variables in `.env`:

```
DATABASE_URL=<your-database-connection-string>
ALBACMS_SECRET=<your-secret-key>
```

4. **Seed data** (required for first run):

Open `@/lib/seed-data.js` and set your **super admin user**:

```js
export const superAdmin = {
  email: 'admin@example.com',
  username: 'superadmin',
  password: 'strongpassword',
}
```

Run the seed script:

```bash
pnpm seed
```

This initializes the database with default content and the super admin account.

5. Start the development server:

```bash
pnpm dev
```

---

## Migration Tool

ALBA CMS includes a migration tool to safely import content from WordPress.

### Key points

- Requests must include the custom API key in headers: `X-Albacms-Key`.
- Requests must identify themselves using the User-Agent:

```text
ALBA-CMS-Migrator/0.1 (+https://github.com/behrouz-shafaati/Alba-cms)
```

- Use `define('ALBACMS_MIGRATION_MODE', true);` in your plugin or `wp-config.php` to enable migration endpoints.
- Migration endpoints are **WAF-friendly**, use **rate-limiting**, and batch requests to avoid IP blocking.

---

## Versioning

ALBA CMS follows **semantic versioning**:

- `0.x` → Pre-release / development
- `0.1.1` → Initial internal release
- `1.0.0` → Public stable release

---

## Tech Stack

- **Frontend:** Next.js 15, TailwindCSS, shadcn/ui, Tiptap
- **Backend:** Next.js Server Actions, Mongo DB, SSG-first
- **Database:** MongoDb
- **Migration:** WordPress API importer with secure headers and batch requests

---

## Security

- All migration requests are authenticated using an **API key**.
- Requests are identified with a clear **User-Agent** pointing to the public repo.
- Endpoints are only active when `ALBACMS_MIGRATION_MODE` is enabled.
- Requests are batch-oriented and rate-limited to avoid IP blocking from WordPress WAFs like BitNinja.

---

## Author

**Behrouz Shafaati**  
GitHub: [https://github.com/behrouz-shafaati/Alba-cms](https://github.com/behrouz-shafaati/Alba-cms)
