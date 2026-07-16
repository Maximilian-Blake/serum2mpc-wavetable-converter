# serum2mpc-wavetable-converter 🎹
A fast, secure and client-side utility to convert Serum & Serum 2 wavetables into standard MPC compatible formats (strictly interpolating to 256 frames). 

🌐 Launch the Web App Here:
* https://maximilian-blake.github.io/serum2mpc-wavetable-converter

### 🔗 Connect & Support:
* Patreon https://www.patreon.com/cw/MaximilianBlake?vanity=MaximilianBlake
* YouTube: https://www.youtube.com/@BlakeMaximilian
* Instagram: https://www.instagram.com/maximilian_blake
* TikTok: https://www.tiktok.com/@maximilian.blake

### 📖 How to Use it:
Because this web application processes audio entirely on your local machine, it requires zero installation and is extremely fast. 
1. Open the Web App link above.
2. Click "Select Wavetable Folder" and choose the folder on your hard drive containing your Serum ".wav" files. 
3. Your browser will ask for permission to view the files. Click "Allow".
4. Click "Generate MPC Wavetables". 
5. The app will process the files in memory and automatically download a clean ".zip" file containing your new MPC 3.9+ ready wavetables and "format.json" files!
6. ⚠️ IMPORTANT: 
* Loading the converted Wavetable/Wavetables into your standalone MPC:
* Unzip the downloaded file and place its contents into a folder named "Wavetables".
* That folder must be placed inside a parent folder named "Oscillators". 
* Connect your MPC to your computer (Controller Mode) and copy the "Oscillators" folder to the root of your MPC's internal drive, it must sit at the exact same hierarchy level as your "MPC Documents" folder.
   
* Example Folder Structure:
* "Oscillators" ➔ "Wavetables" ➔ "Analog_Acid"
* (The "Analog_Acid" folder will contain your converted "Analog_Acid.wav" and its "format.json" file).
* Once loaded, open a DrumKit or a Keygroup on your MPC, press EDIT, select SAMPLES/OSCS then set the source to OSC, and you will find your new converted Wavetable/Wavetables under "User Wavetables".
* You're good to go!

### ⚠️ Legal Disclaimer:
This utility is an independent, third-party tool. This application and its creator are NOT affiliated with, endorsed by, sponsored by, or associated with Xfer Records or Akai Professional (inMusic Brands, Inc.) in any way. 

NO FACTORY CONTENT INCLUDED:
This app does not distribute, contain, or replicate any factory wavetables, presets, or copyrighted audio material. This is strictly a local audio-processing script designed to transform files already legally owned by the user. You are responsible for ensuring you have the legal right to modify the audio files you process with this software.
