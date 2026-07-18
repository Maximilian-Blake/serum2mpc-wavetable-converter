# serum2mpc-wavetable-converter 🎹
A fast, secure and client-side utility to convert Serum & Serum 2 wavetables into standard MPC compatible formats (strictly interpolating to 256 frames). 

<img width="1024" height="576" alt="Serum2Wavetable_BowedMetal ML _pos1_MPC" src="https://github.com/user-attachments/assets/fc44dbc9-7155-43e2-b321-5c33f298cca4" />
<img width="597" height="712" alt="Serum2Wavetable_BowedMetal ML _pos1" src="https://github.com/user-attachments/assets/5490e881-a89e-459f-ae06-d7762655e7d8" />
<img width="711" height="534" alt="WavetableConverterSerum-Serum2MPC_00" src="https://github.com/user-attachments/assets/da84d9ce-b2d2-4854-926b-ee75b4708427" />
<img width="709" height="593" alt="WavetableConverterSerum-Serum2MPC_01" src="https://github.com/user-attachments/assets/488a5caf-3138-47f1-858d-38fed4524d9f" />
<img width="707" height="589" alt="WavetableConverterSerum-Serum2MPC_02" src="https://github.com/user-attachments/assets/b112a786-75e3-4cf8-9325-511e4177f5d8" />
<img width="709" height="536" alt="WavetableConverterSerum-Serum2MPC_03" src="https://github.com/user-attachments/assets/dd0ae283-aab0-49fb-804f-76398adc9f20" />
<img width="709" height="532" alt="WavetableConverterSerum-Serum2MPC_04" src="https://github.com/user-attachments/assets/5be84287-c469-4fb2-81a5-2c1909e8768d" />
<img width="709" height="536" alt="WavetableConverterSerum-Serum2MPC_05" src="https://github.com/user-attachments/assets/53fa5f6a-8072-4f26-bb80-3144d1f7cc8d" />

### 🚀 What's New in v1.1

**Bulk Export Improvements**
The bulk export engine has been rewritten to perfectly match the MPC's native file architecture, saving you from cluttered directories.

*   **Single "format.json" Architecture:** The engine now generates only *one* master "format.json" file per export batch, drastically reducing clutter and saving disk space. The MPC reads this single root file and applies it to every wavetable inside the folder.

*   **Automated Directory Structure:**  Your new wavetables drop right into the root of a new created "Serum" folder ready to be copy&paste inside the standalone MPC "Oscillators" ➔ "Wavetables" folders.

*   **Smart Prefix Naming:** Bulk exported ".wav" files now automatically inherit their original parent folder's name as a prefix (e.g., "Analog_Acid.wav"), ensuring no naming collisions when compiling a massive master library.

<img width="1024" height="576" alt="v1 1_00" src="https://github.com/user-attachments/assets/1a05b1c0-b540-4364-8fed-af0f73aff16b" />
<img width="1024" height="576" alt="v1 1_01" src="https://github.com/user-attachments/assets/9f5a1861-372a-45fd-a4ee-6d7c5d23f71f" />
<img width="1024" height="576" alt="v1 1_02" src="https://github.com/user-attachments/assets/c4ca0234-0e34-4815-9461-e007447e0531" />
<img width="1024" height="576" alt="v1 1_03" src="https://github.com/user-attachments/assets/ab6c3a69-5af6-4e96-a161-034c2a4d91c6" />

🌐 Launch the Web App Here:
* https://maximilian-blake.github.io/serum2mpc-wavetable-converter

### 🔗 Connect & Support:
* Patreon https://www.patreon.com/cw/MaximilianBlake
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

### 🖥️ Standalone Desktop Apps (Optional)
If you are using the desktop builds, please read the installation and security guidelines below.
<details>
<summary><b>Click to expand: Installation & Security Guide</b></summary>

Mac App:
* On your Mac, choose Apple menu  > System Settings, then click Privacy & Security  in the sidebar. (You may need to scroll down.)
* Open Privacy & Security settings
* Go to Security, then click Open.
* Click Open Anyway.
* This button is available for about an hour after you try to open the app.
* Enter your login password, then click OK.
* The app for Mac has scored a 1/70 . You can view the live, verified security report here:
* https://www.virustotal.com/gui/file/c2ab68ec480927e54113509082462278537682edf0a81e0edbdf7b4cf57dd664?nocache=1
* "Yes, Microsoft's AI accidentally flagged this Mac app as a Windows app!" 

Windows App:
* When you double-click the .exe, a blue "Windows protected your PC" popup might appear.
* Click the "More info" text link just beneath the warning.
* A new button will appear at the bottom that says "Run anyway". Click it!
* You only have to do this once.
* The app for Windows has scored a perfect 0/70 100% Clean. You can view the live, verified security report here:
* https://www.virustotal.com/gui/file/dd9bee08c824602879250faab63586316691b1c2cfe8c25f9f64a3dc6b6c81fd/details
</details>
