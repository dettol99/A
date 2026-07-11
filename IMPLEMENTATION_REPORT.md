# Medly Final UI — Phase 1 of 2

## Redesigned in this phase
- Home screen only: rebuilt the phone-width, RTL-first home surface with safe-area-aware top spacing, Medly header, search/filter row, real-data hero metadata, horizontal poster rails, and preserved media navigation plus long-press add-to-list behavior.
- Media Details screen only: replaced the old simple details view with a centered vertical poster layout, soft backdrop, metadata row, director/cast/genre/rating/action/overview sections that render only when backed by available real data.
- Profile screen only: rebuilt the profile view with editable cover affordance, overlapping avatar, user identity, member badge, follower/following counts, action buttons, statistics tabs, real profile/auth data, and Games active in stats.
- Shared bottom tab bar required by these screens: rebuilt labels/icons, purple active state, floating glass styling, centered phone-width presentation, and safe-area bottom spacing.

## Mandatory review fixes completed
- Restored Home safe-area handling so the header is offset below the status bar/notch.
- Added bottom padding and safe-area-aware spacing to the redesigned scroll views so the floating tab bar does not cover content.
- Removed the hard-coded hero subtitle `مغامرة · خيال علمي`; the hero now uses only available media type and release year metadata, and omits missing metadata.

## Preserved functionality
- Existing Supabase/auth/profile services remain in place.
- Existing routing and real media service calls remain in place.
- Add-to-list bottom sheet behavior remains available from Home long press and Media Details.
- Profile edit/upload flows remain routed through the existing edit profile screen.

## Remaining visual mismatches
- Native icon fonts were not added in this phase; tab/action icons use lightweight text glyphs to avoid adding a new dependency.
- Runtime visual screenshot validation was not completed because the web export/preview step was blocked by an environment HTTP proxy error.
- Some rich Media Details sections (community rating charts, reviews, recommendations, and lists containing the item) are hidden unless the existing details payload supplies real data for them.

## RESUME FROM HERE
Phase 2: Lists, Community/Voice Rooms, and Settings.
