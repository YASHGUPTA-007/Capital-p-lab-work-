## iOS image jitter on blog: root-cause analysis

**Page affected:** [`How do you feel about Climate Change?`](https://www.capitalp.org/blogs/how-do-you-feel-about-climate-change)  
**Scope:** Only reproducible on iOS (Safari / in‑app browsers). Android and desktop behave normally.

### Symptom

- **Observed behaviour:** On the climate‑emotions blog page, hero/inline images intermittently flicker, “jump”, or briefly disappear and reappear while scrolling on iOS, creating a chaotic/jittery experience.
- **Not observed:** The same content renders smoothly on Android phones and on laptops/desktop browsers.

### Relevant implementation

- **Blog page server component**: fetches blog content and passes HTML + metadata to the client component:

```64:79:app/blogs/[slug]/page.tsx
    const data = querySnapshot.docs[0].data();
    
    // Serialize Firestore Timestamps to ISO strings
 return {
  id: querySnapshot.docs[0].id,
  title: data.title || '',
  slug: data.slug || '',
  excerpt: data.excerpt || '',
  content: data.content || '',
  author: data.author || '',
  category: data.category || '',
  tags: data.tags || [],
  featuredImage: data.featuredImage || '',
  status: data.status || 'published',
  likes: data.likes || 0, // ✅ ADD THIS LINE
  createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  publishedAt: data.publishedAt?.toDate?.()?.toISOString() || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
};
```

- **Blog page client component**: renders the featured image and the rich‑text content (including inline images) using standard `img` tags:

```538:553:app/blogs/[slug]/BlogPostClient.tsx
          {post.featuredImage && (
            <figure className="relative w-full bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
                  <img
                    src={post.featuredImage}
                    alt={
                      post.featuredImageAlt || `Featured image for: ${post.title}`
                    }
                    className="w-full h-auto object-contain"
                    style={{
                      maxHeight: "80vh",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
```

- **Inline content images** inside the blog body are rendered via `dangerouslySetInnerHTML` and styled with the `.blog-content` CSS:

```570:593:app/blogs/[slug]/BlogPostClient.tsx
                <div
                    className="blog-content prose prose-lg max-w-none text-[#2b2e34]
                      prose-headings:text-[#2b2e34] prose-headings:font-serif prose-headings:font-bold
                      prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
                      prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight
                      prose-h3:text-3xl prose-h3:mb-5 prose-h3:mt-8
                      ...
                      prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:border-4 prose-img:border-white
                      ..."
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
```

- **Global media styling** forces all `img` elements to be block-level and responsive:

```47:51:app/globals.css
img, video, iframe {
  display: block;
  max-width: 100%;
  height: auto;
}
```

### Likely culprit (iOS-specific)

The jitter only on iOS strongly points to a **compositing / layer promotion issue in Safari**. The following CSS applied to the blog content and images is the most probable trigger:

- **Blog content container is forced onto a GPU layer and marked as animating:**

```202:206:app/blogs/blog-content.css
.blog-content {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

- **All images inside `.blog-content` are also forced onto their own composited layers and marked as changing opacity:**

```193:198:app/blogs/blog-content.css
.blog-content img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}
```

```208:212:app/blogs/blog-content.css
/* Optimize images for scroll performance */
.blog-content img {
  transform: translateZ(0);
  will-change: opacity;
}
```

- **The same `.blog-content` block is also given `overflow-x: hidden` and constrained width, which interacts badly with forced transforms on iOS:**

```219:223:app/blogs/blog-content.css
/* Prevent page-wide horizontal scroll */
.blog-content {
  overflow-x: hidden !important;
  max-width: 100% !important;
}
```

On iOS Safari, combining:

- `transform: translateZ(0)` on a large scrolling container **and** on its child images,
- `will-change: transform` / `will-change: opacity` hints (telling the browser to constantly keep layers ready for animation),
- plus `overflow-x: hidden` on the same container,

is a well‑known pattern that can produce **flickering / disappearing content while scrolling**, especially for images, due to aggressive GPU compositing and repaint bugs in WebKit.  
Other platforms (Chromium, Firefox, Android WebView) tend to handle this more gracefully, which matches the observed “iOS only” behaviour.

### Other related but less likely contributors

- **Table scrolling tweaks** add `-webkit-overflow-scrolling: touch` to tables inside `.blog-content`:

```225:233:app/blogs/blog-content.css
.blog-content table {
  display: block !important;
  width: auto !important;
  min-width: 100% !important;
  max-width: none !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
  ...
}
```

While `-webkit-overflow-scrolling: touch` can cause scroll glitches on iOS, this primarily affects horizontally-scrollable table regions. The report you shared is about **images jittering**, and those images are not inside these scrollable wrappers, so this is likely secondary.

### Summary of most probable root cause

- **Primary culprit:** the “performance optimizations” added for the blog content and its images:
  - `transform: translateZ(0)` and `will-change: transform` on `.blog-content`.
  - `transform: translateZ(0)` and `will-change: opacity` on `.blog-content img`.
- **Effect on iOS Safari:** these hints over‑promote the entire article content and its images to GPU layers while also constraining overflow, triggering Safari/WebKit compositing bugs that manifest as:
  - images flickering or temporarily disappearing on scroll,
  - jittery movement when the browser recomputes layers.

### Recommended fixes / mitigations

1. **Remove or narrow the aggressive transforms on the blog content for mobile/iOS**
   - Safest change: remove the transform/will-change entirely from the blog content and its images:
     - From `.blog-content`:
       - `transform: translateZ(0);`
       - `will-change: transform;`
       - (optionally) `backface-visibility: hidden;`
     - From `.blog-content img`:
       - `transform: translateZ(0);`
       - `will-change: opacity;`
   - Alternatively, **scope these only to larger screens** where iOS Safari mobile glitches are less common, e.g. wrap them in `@media (min-width: 1024px) { ... }`.

2. **Add an iOS-specific override as a defensive measure**
   - You can neutralize these properties specifically on iOS/WebKit using a feature query:

```css
@supports (-webkit-touch-callout: none) {
  .blog-content {
    transform: none !important;
    will-change: auto !important;
    backface-visibility: visible !important;
  }

  .blog-content img {
    transform: none !important;
    will-change: auto !important;
  }
}
```

3. **Keep `overflow-x: hidden` only if strictly necessary**
   - If images or content don’t actually overflow horizontally, consider removing or relaxing:

```css
.blog-content {
  overflow-x: hidden !important;
}
```

   - This reduces the complexity of the scrolling/compositing scenario for Safari, which can also reduce flicker risk.

### What to test after changes

On a real iOS device (Safari and one in‑app browser like Chrome or an embedded browser):

1. Navigate to `How do you feel about Climate Change?` and scroll slowly and quickly from top to bottom.
2. Pay special attention to:
   - the featured image block,
   - any inline images within the article body,
   - scrolling around the climate‑emotions table.
3. Confirm:
   - images no longer flicker, disappear, or “jump” while scrolling,
   - table scrolling still works, and the page no longer feels chaotic on iOS.

If jitter disappears once the transforms/will-change are disabled (especially under the `@supports (-webkit-touch-callout: none)` block), that will confirm these CSS “optimizations” as the root cause.

