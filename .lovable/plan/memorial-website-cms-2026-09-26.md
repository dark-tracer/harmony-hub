# Memorial Website CMS

## Goal
Add a private, page-by-page content editor with a live website preview. The public memorial remains visually unchanged while its displayed content becomes editable.

## What will be built
- A secure email/password sign-in for the supplied owner account.
- A protected `/admin` editor available only to approved administrators.
- A split-screen editing workspace: organized fields on the left and a live page preview on the right.
- Separate editor sections for shared header/footer content, Home, Obituary, Service Details, Order of Service, and Photo Gallery.
- Controls to edit all displayed wording, labels, dates, venue details, links, portrait/gallery image URLs, captions, categories, and repeating items.
- Add, remove, reorder, save, and reset controls for repeatable cards, biography chapters, guidance items, liturgy movements, and gallery photos.
- Public pages that read the saved content from Lovable Cloud, with the current website content seeded as the initial version.
- Clear saved/error states and sign-out controls.

## Access and security
- No public registration page.
- The supplied account will be activated immediately and assigned the administrator role.
- Roles will be stored separately from user identity records.
- Anyone may read the published memorial content; only an authenticated administrator may modify it.
- Database access rules will enforce permissions even if someone calls the underlying endpoints directly.

## Technical details
- Store each page as a typed JSON document in a `site_content` table, keyed by page/section.
- Add a separate `user_roles` table and a protected `has_role` check.
- Use authenticated server functions for CMS reads/writes and public read-only server functions for website rendering.
- Register the existing bearer-token middleware for protected calls and preserve public-page server rendering.
- Keep route-specific metadata while moving all visible page content into the CMS.
- Validate saved content before writing it and preserve the existing memorial styling.

## Verification
- Confirm all five public pages render their seeded content.
- Sign in with the owner account and verify the protected editor opens.
- Change representative text and image fields, save, and verify the public page reflects the update.
- Confirm unauthenticated and non-admin write attempts are denied.
- Check desktop and mobile layouts, including the split preview and navigation.
