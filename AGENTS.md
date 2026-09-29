<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Store public memorial copy as one typed JSON document per page in `site_content`; this keeps every page independently editable and seedable.
- Enforce CMS writes through authenticated administrator RLS and server functions; route guards alone are not a security boundary.
- Keep tribute entries in the existing page-document CMS model so the owner can manage them with the same secure editor workflow.
