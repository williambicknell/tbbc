# Travel by B Corp Overtourism Flipbook

Static flipbook for the Travel by B Corp overtourism playbook.

## Deploy to Vercel

Deploy the repository as a static Vercel project. There is no build command and no output directory.

## Circle embed

After Vercel gives you the production URL, paste this into a Circle custom HTML block and replace `YOUR_VERCEL_URL`:

```html
<iframe
  src="https://tbbc-ten.vercel.app/"
  title="Travel by B Corp Overtourism Playbook"
  style="display:block;width:100vw;height:calc(100vh - 48px);height:calc(100dvh - 48px);margin-left:calc(50% - 50vw);border:0;border-radius:0;overflow:hidden;"
  loading="lazy"
  allowfullscreen
></iframe>
```

The reader scales to the iframe viewport. The `48px` offset keeps the controls visible when Circle renders the block below its page chrome.
