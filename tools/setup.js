const config = {
  name: {
    value: "reader-mode",
    description: "The package name of the extension",
    replacements: [
        {
            file: "package.json",
            match: "name",
        },
    ],
  },
  display_name: {
    value: "Reader Mode",
    description: "The display name of the extension",
    replacements: [
        {
            file: "src/_locales/en/messages.json",
            match: "appName.message",
        },
        {
            file: "README.md",
            match: "Reader Mode",
        }
    ],
  },
  short_name: {
    value: "reader-mode",
    description: "Short name for chrome store",
    replacements: [
        {
            file: "src/_locales/en/messages.json",
            match: "appShortName.message",
        },
    ],
  },
  description: {
    value: "A browser extension boilerplate",
    description: "Displayed automatically in chrome webstore",
    replacements: [
        {
            file: "src/_locales/en/messages.json",
            match: "appDesc.message",
        },
        {
            file: "package.json",
            match: "description",
        },
    ],
  },
  long_description: {
    value: `A simple extension that optimizes webpages for reading. 
    
    With one click (or less!), you can remove distractions like:
    * Cookie notices
    * Ads
    * Popups
    * Comments
    * And a host of other distracting elements
    
    It leaves only text and images for a clean and consistent reading view on every site.`,
    description: "Added to README and manually to chrome store",
  },
  feature_list: {
    value: ["Ask GPT for features list."],
  },
  verion: {
    value: "todays-date",
    description:
      "Version number, typically todays date in UK format. Used in package.json, manifest and other places",
  },
  keywords: {
    value: [],
  },
  git_repo: {
    value: "github.com/justiceo/reader-mode",
  },
  homepage_url: {
    value: "example.com",
    description:
      "Used by manifest and chrome store. Purchase from Namecheap or use Github page",
  },
  sentry_dsn: {
    value: "todo_invalid",
  },
  uninstall_form_link: {
    value: "todo",
  },
  updated_screenshot: {
    value: false,
  },
  updated_pin_it_gif: {
    value: false,
    optional: true,
  },
  updated_logo: {
    value: false,
  },
  chrome_id: {
    value: "ifokcmpbomhoaofjkbdhnfldmgiiggof",
    description:
      "Used to update README or as alternative to homepage URL. Generate this by uploading empty manifest",
  },
  remove_dev_section_of_readme: {
    value: false,
    description: "Remove the DEV README section in README.md",
  },
  updated_tos: {
    value: false,
  },
  updated_gh_page: {
    value: false,
  },
  files: [
    {
        name: "src/sentry.json",
        field: "version",
        value: "$name@$version",
    }
  ]
};

/*
Tasks
- Add replacement objects list to each property, {file, match, replacement}
- Run npm install
- Regenerate logo
- Regenerate translations
- Regenerate prod build
- Review changes
- Re-initialize git repo.

*/

function replace(file, wholeLine, replacement) {

}