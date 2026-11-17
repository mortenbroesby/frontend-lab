# Motion with purpose

Compare the same local save action with Still, Motion, and Motion + Lottie. Edit the card, save, then replay the confirmation or change the transition duration. Saving changes React state immediately; refresh resets it.

From the repository root:

```sh
npm install
npm run dev --workspace @lab/demo-motion-with-purpose
npm run check --workspace @lab/demo-motion-with-purpose
```

Open the URL Vite prints. The workspace runs and builds independently. The gallery discovers its metadata automatically. When hosted with the gallery, the demo links to [Add motion with purpose](../../gallery/src/content/tracks/experimental-projects/motion.mdx). Independent deployments can opt into that link through `VITE_GALLERY_URL`.

`index.tsx` contains the editor, treatments and interface transitions. `SaveSeal.tsx` owns the Lottie player lifecycle. `save-seal.json` is a local shape-only animation; [ASSET.md](ASSET.md) documents its provenance and CC0 reuse terms. No animation assets are fetched from a remote service.

System reduced motion disables interface movement and displays the vector seal's final frame. Motion and Lottie never decide whether saving succeeded. Empty titles cannot be saved, and closing the editor restores focus to Edit card.
