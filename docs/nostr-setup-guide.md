# Nostr Identity Setup Guide

Here is a step-by-step guide on how to complete the extension setup and configure your Nostr identity for P2Pesa.

## Step 1: Install the Alby Browser Extension

1. Open your desktop browser (Chrome, Firefox, Brave, Edge, or Opera).
2. Go to the official Alby website: https://getalby.com/ and click the install button for your specific browser.
3. Once installed, pin the Alby extension to your browser toolbar so it is always visible.
4. Click on the Alby icon to open it for the first time.
5. Set a secure unlock password. This password encrypts your keys locally on your device.

## Step 2: Create or Import a Nostr Keypair

Once your extension is unlocked, you need to set up your cryptographic keys.

### Scenario A: If you are new to Nostr (Create a new key)

1. Click the Alby extension icon to open the main menu.
2. Select your account and click on **Wallet settings** (or the gear icon).
3. Click on **Nostr Settings**.
4. Click **Generate a new Master Key**. This will generate a 12-word seed phrase (recovery phrase) and derive your Nostr keys from it.
5. ⚠️ **Critical Security Step:** Write down these 12 words on physical paper and store them somewhere secure. Do not take a screenshot or save them in plain text on your computer. If you lose these words, you lose access to your Nostr identity forever.

### Scenario B: If you already have an existing Nostr account (Import your key)

1. Open Alby, navigate to **Wallet Settings** → **Nostr Settings**.
2. Find the input field for importing a key.
3. Paste your existing private key (which starts with `nsec1...`) into the field and save. *(Note: Alby safely encrypts your private key locally and will never share it with websites).*

## Step 3: (Optional) Set up your Name and Profile Picture

By default, P2Pesa will display your public key (starting with `npub...`) and a automatically generated robot avatar. If you want a custom name and profile picture:

1. Go to https://coracle.social/ or https://snort.social/.
2. Click **Login / Sign In**.
3. When prompted, select **Use Browser Extension (NIP-07)**.
4. An Alby popup will slide out asking you to authorize the website to read your public key. Click **Authorize / Allow**.
5. Once logged in, navigate to the Profile or Settings tab on the website.
6. Edit your profile details:
   - Enter your Username or Display Name.
   - Paste a direct link to an image (ending in `.png`, `.jpg`, or `.webp`) in the Picture / Avatar field.
7. Click **Save or Publish**.
8. Alby will pop up once more, asking you to cryptographically "Sign" the metadata event (known as a Kind 0 event). Click **Confirm / Sign**.

## Step 4: Log in to P2Pesa

Now that your extension is ready:

1. Go back to your local P2Pesa app (`http://localhost:3000`).
2. Click **Login with Nostr / Extension**.
3. Alby will prompt you to authorize P2Pesa. Click **Allow**. You are now logged in using your self-sovereign cryptographic identity!
