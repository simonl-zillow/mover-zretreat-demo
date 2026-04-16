# Workshop guide — for participants

This app is a working Zillow-style property search. It opens on **sample homes** so you can experiment freely — by the end of the day your prototype will be running on real Zillow listings. If something goes wrong, you can always undo with **Cmd+Z** or ask Cursor to put it back.

**Cursor should already be open** with this project loaded. Your guide is right here — you're reading it inside the tool you're about to use.

---

## Step 1 — Get set up

1. Download the zip file that was shared with you and double-click it — a folder will appear
2. Move that folder to wherever you keep your Cursor projects
3. Open Cursor, then go to **File → Open Folder** and select the folder you just moved — a file tree will appear on the left side of your screen

🎉 **Voilà — you just loaded the Cursor project.**

---

## Step 2 — Start the app

1. Open Cursor Chat: **Cmd+L**
2. Ask: *"How do I start this app?"* — Cursor will tell you exactly what to do
3. Follow along. When a link appears at the bottom of your screen, **Cmd+click** it to open the app
4. Use it like a real user — search for something, click a listing, browse around

**Look for:** the small `mock` badge in the top-right of the header. That's your starting point — we'll switch it to `live` in Steps 4 and 5, and your prototype will show real Zillow homes.

---

## Step 3 — The switchboard

1. Open Cursor Chat (**Cmd+L**) and ask: *"Which file decides whether this app uses sample homes or real data? Explain it to me as a non-technical designer."*
2. Open the file Cursor points you to
3. Read only the comment at the very top — that's the whole story

**Cursor prompt to go deeper:**
```
Explain this file to me like I'm a designer who doesn't write code. What would happen if someone flipped it to live?
```

---

## Steps 4 & 5 — Connect to real homes

1. Check Slack — a small settings file has been shared with you. Download it and drag it into the **root of your project folder** in Cursor's file panel
2. Open Cursor Chat (**Cmd+L**) and ask: *"I've just added a .env.local file to my project. Stop the dev server and restart it for me so the new settings load."*
3. Follow the instructions — once the app restarts, the badge in the header will change from `mock` to `live`
4. Run a search. Click a listing. These are real Zillow homes.

🏠 **Your prototype is now running on live data.**

---

## Step 6 — Trace a field

1. In the app, click any listing to open the detail page
2. Find the blue **"Where each main field comes from"** box
3. Pick one row — "Price" is a good one
4. Go back to Cursor and ask: *"Show me where the price value lives in the content file"* — then find it yourself

**Useful habit:** you can always ask Cursor where something is coming from — to trace the source, troubleshoot something unexpected, or pinpoint exactly where to make a change.

---

## Step 7 — Make it yours

**What you're doing:** Picking one thing to change and using Cursor to build it.

This is vibe coding. Describe what you want. Cursor writes the code. You look at the result, decide if it's right, and iterate. Open Cursor Chat (**Cmd+L**), pick one prompt below, paste it in, and go.

---

### Option A — Make the cards feel more editorial
```
In src/components/PropertyCard.tsx, make the cards feel more like a design-forward real estate site. Use a larger, bolder font for the price. Add more breathing room between the price and the stats line. Make the address text a bit lighter and smaller. Show me the specific changes to make.
```

### Option B — Add a neighborhood welcome message
```
In src/App.tsx, add a short line of warm text just above the search results — something like "You're browsing Seattle homes." Style it like a soft editorial subheading: not a label, more like a magazine intro line. Muted color, slightly italic, comfortable spacing.
```

### Option C — Make the heart button actually save favorites
```
In src/components/PropertyCard.tsx, make the heart button save the listing's ID to localStorage so it stays filled in when you refresh the page. Use the listing's id field as the key. The heart should load its saved state when the component mounts.
```

### Option D — Skeleton loading cards
```
In src/App.tsx, when the app is loading search results, instead of the plain "Searching…" text, show three placeholder cards that look like the real cards but with gray blocks — a rectangle where the photo goes, a short bar for the price, a longer bar for the address. This pattern is called a skeleton loader.
```

### Option E — Change the mood entirely
```
In src/App.tsx and src/components/PropertyCard.tsx, change the visual mood of the app to feel like a luxury real estate site. More whitespace, an elegant or serif-inspired font for the price, softer gray tones throughout. Only change colors, fonts, and spacing — don't touch any functionality.
```

---

**When you're done:** Share a screenshot with the group. Mention whether you were in mock or live mode.

**Hit a wall?** Paste this into Cursor Chat:
```
Something went wrong. Here's what I see: [describe what happened]. Can you help me fix it without changing anything that was already working?
```

---

## Cursor cheat sheet

| If you want to… | Say this to Cursor |
|---|---|
| Understand what a file does | `Explain [filename] like I'm a designer, not an engineer` |
| Make a visual change | `In [filename], change [describe it in plain English]` |
| Undo a Cursor suggestion | Cmd+Z — or ask: `Revert the last change you made` |
| Find where something lives in the code | `Where in the code does [the thing on screen] come from?` |
| Add something new | `Add [describe it] to [filename]. Don't change anything else.` |
| Check if your change broke something | `Does anything in the project depend on [filename] that I should know about?` |
