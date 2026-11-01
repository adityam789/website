@AGENTS.md

# Project orientation
Before changing code, read `docs/ARCHITECTURE.md` (structure, styling rules, data locations, known gaps) and, for common tasks,
`docs/FEATURE_RECIPES.md`. Parent dir (`../content.md`, `../design.md`) holds the original content/design spec (not part of this git repo).
Key rules: main site = plain CSS (`globals.css` + CSS modules); `/dmp` = styled-components only; content is hard-coded in page files
(duplicated across pages, grep before editing facts); keep these docs updated when structure changes.
