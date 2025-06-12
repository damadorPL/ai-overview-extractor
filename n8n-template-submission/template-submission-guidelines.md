# Template submission guidelines

## 💅 Example Great Workflow Templates

Below are examples of approved templates that meet our submission guidelines

- https://n8n.io/workflows/2109-enrich-new-discourse-members-with-clearbit-then-notify-in-slack/
- https://n8n.io/workflows/2116-verify-emails-and-enrich-new-form-leads-and-save-them-to-hubspot/

## ☑️ Guidelines

<aside>
📣 tl;dr: make sure the template is relevant to a broad enough group, well annotated so it’s clear what it does, and has some clear set up steps (via sticky, video, notion doc etc)

</aside>

- All your content should be written in English and spelled correctly
- **Provide a detailed description**: Provide a concise and informative description outlining the template's functionality and expected outcomes. Include a brief setup guide for user convenience. A detailed description not only clarifies the template's purpose but also enhances its discoverability through SEO. It’s advised to use these sections in your description:
    - Who is this for?
    - What problem is this workflow solving? / use case
    - What this workflow does
    - Setup
    - How to customize this workflow to your needs
    - Use Markdown formatting
    - Use ## H2 headlines for sections
- **Optimize for SEO**:
    1. Use the main nodes in the title and use sentence-style capitalization, e.g. `One-way sync between Pipedrive and HubSpot` or `Create an invoice in Google Sheets based on Typeform submission`
    2. Try to have a description with ~ 200 words
    3. Use H2 headers to structure your description into sections

- **Rename your workflow’s nodes** to explain what that step is doing. Workflow notes are a handy feature as are [Sticky notes](https://docs.n8n.io/workflows/components/sticky-notes/).

![do-dont.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d147bfac-0bab-4c58-884f-f45c5f5a13e8/098d1659-01df-401c-83f4-4fe230c06b86/do-dont.png)

- **Add a Sticky note that explains what the template does** and any dependencies required.
    - If you have an external setup guide, like a notion page, link it here too.
    - You are a rockstar if you also make a quick setup video 👩‍🎤. [Loom recordings](http://loom.com) are a simple way to go. You don’t have to be a pro Youtuber, simple videos are still really helpful. Plus our community will really appreciate it 🥰
    - Use different sticky colors

![Always include a sticky note that explains the workflow](https://prod-files-secure.s3.us-west-2.amazonaws.com/d147bfac-0bab-4c58-884f-f45c5f5a13e8/d66a8247-8f03-4a3d-92d4-5b5ad617caa9/Screenshot_2023-12-22_at_12.01.38.png)

Always include a sticky note that explains the workflow

- Try to make templates relevant to one of our categories.
    - Template categories (as of 15NOV2023)
        - AI
        - Building Blocks
        - DevOps
        - Engineering
        - Finance
        - HR
        - Managed Service Providers
        - Marketing
        - Product
        - Sales
        - Support
        - Other (great for Personal and Education; we plan to break this section out in future)
- Your template should cover a real use case of a potential user. Consider how to make the template applicable to a broader audience by finding the right balance in generalizing your use case.

<aside>
🧑‍🍳 #tip:  `Action verb` `thing being manipulated` to/ on / in / from `where`

</aside>

- When adding a template with a community node, please add a disclaimer to the top of your description that your template is only available on self-hosted. Also, make sure to add an image of your workflow to the top of your description, as we don’t show previews for community node templates.

## 👍 Additional Tips

- Try to use an `edit fields` node that allows users to set all their variables in one node
- Try to empathize with a user who is attempting to use your template. Keep in mind that they may not know as much about n8n as you do.