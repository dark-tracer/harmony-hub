# Build the Joyce Dedo Narh memorial app

## What I’ll build
- Recreate the supplied memorial experience at `/` with the same warm ivory, deep green, gold, and burgundy visual language.
- Add the shared memorial header and footer, plus all six referenced screen states: home, obituary, service details, order of service, photo gallery, and the supplied downloadable order-of-service asset.
- Use the supplied portrait and gallery image links, exact memorial copy, ceremonial details, cards, quotations, and decorative motifs.
- Make navigation, mobile menu, gallery filtering, image lightbox, and downloadable-program actions work.
- Ensure layouts adapt cleanly between desktop and mobile while preserving the reference hierarchy and spacing.

## Technical details
- Implement each distinct screen as a TanStack route and use shared React components for navigation and footer content.
- Define the palette, typography, shadows, borders, and decorative treatments as semantic design tokens in the global stylesheet.
- Use the existing design-system button component for interactive controls and Lucide icons matching the references.
- Add unique page metadata to every content route.
- Validate the final experience in the running preview at desktop and mobile sizes, including navigation and gallery interactions.
