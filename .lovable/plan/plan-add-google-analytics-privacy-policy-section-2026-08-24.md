# Plan: Add Google Analytics Privacy Policy Section

## Goal
Insert the approved "Analytics and Tracking Technologies" section into `src/components/LegalContent.tsx` (Part 2: Privacy Policy) as the new section 4, and renumber the existing sections 4–7 down to 5–8 so the numbering stays consecutive.

## Current state (Part 2: Privacy Policy)
1. Information We Collect
2. How We Use Your Information
3. Sharing Your Information
4. Data Security & Retention
5. Your Rights & Data Deletion
6. Changes to This Policy
7. Contact Us

## Target state (Part 2: Privacy Policy)
1. Information We Collect
2. How We Use Your Information
3. Sharing Your Information
4. **Analytics and Tracking Technologies** (new)
5. Data Security & Retention (was 4)
6. Your Rights & Data Deletion (was 5)
7. Changes to This Policy (was 6)
8. Contact Us (was 7)

## New section text (section 4)
```
4. Analytics and Tracking Technologies

We use Google Analytics, a web analytics service provided by Google LLC ("Google"), to understand how visitors use our website and application. Google Analytics uses cookies and similar tracking technologies to collect and analyze data about your interactions with the Service, including page views, session duration, in-app events (such as game starts, game completions, and account sign-ups), device type, browser type, and approximate location derived from your IP address.

The information collected by Google Analytics may be associated with your account information when you are signed in, which allows us to link visitation data with your user profile for the purpose of understanding engagement and improving the Service. This association occurs only for signed-in users; anonymous visitors are tracked without a linked account identity.

Google may use this data to provide analytics services and may transfer it to servers located outside of Canada. You can learn more about how Google uses data in connection with Google Analytics and how to opt out by reviewing:
- Google's Privacy Policy: https://policies.google.com/privacy
- Google Analytics opt-out browser add-on: https://tools.google.com/dlpage/gaoptout
- Google Ads Settings (to manage ad personalization): https://adssettings.google.com

You can also limit tracking by disabling cookies in your browser, using private/incognito browsing mode, or using a browser with built-in tracking protection.
```

The three Google links render as teal underlined `<a>` links matching the existing email/website link styling already used in section 8 (Contact Us) and the data-deletion email — same `text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))]` treatment, with the list using the same `list-disc pl-5` bullet style as the other lists in the policy.

## Renumber edits
For each of the four shifted sections, only the leading bold number changes:
- `4. Data Security & Retention` → `5. Data Security & Retention`
- `5. Your Rights & Data Deletion` → `6. Your Rights & Data Deletion`
- `6. Changes to This Policy` → `7. Changes to This Policy`
- `7. Contact Us` → `8. Contact Us`

No body text in those sections changes.

## Effective date
Adding a policy section is a material change, and the policy itself says major changes are announced by "posting the new policy on this page and updating the effective date." So also:
- Update the "Effective Date" line in `LegalContent.tsx` from `July 11, 2026` to `August 24, 2026`.
- Update `src/pages/Terms.tsx` JSON-LD `dateModified` (and the Article `dateModified`) from `2026-07-11` to `2026-08-24` so search engines reflect the revision. `datePublished` stays `2026-07-11`.

## Scope / out of scope
- In: the new section, renumbering, effective-date + JSON-LD date bump.
- Out: no other policy copy changes, no checkbox/banner UI, no Terms of Service edits.
