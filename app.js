// Navigation Views
const mainView = document.getElementById('mainView');
const singleView = document.getElementById('singleView');
const bulkView = document.getElementById('bulkView');
const globalStatus = document.getElementById('globalStatus');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const disclaimerModal = document.getElementById('disclaimerModal');
const creditsModal = document.getElementById('creditsModal');
const btnDisclaimer = document.getElementById('btnDisclaimer');
const btnCredits = document.getElementById('btnCredits');
const closeDisclaimerBtn = document.getElementById('closeDisclaimerBtn');
const closeCreditsBtn = document.getElementById('closeCreditsBtn');

// Buttons & Inputs
const btnGoSingle = document.getElementById('btnGoSingle');
const btnGoBulk = document.getElementById('btnGoBulk');

// Single
const singleInput = document.getElementById('singleInput');
const singleFileStatus = document.getElementById('singleFileStatus');
const convertSingleBtn = document.getElementById('convertSingleBtn');
const singleFolderName = document.getElementById('singleFolderName');

// Bulk
const folderInput = document.getElementById('folderInput');
const bulkFileStatus = document.getElementById('bulkFileStatus');
const convertBulkBtn = document.getElementById('convertBulkBtn');

// Variables
let singleSelectedFile = null;
let bulkSelectedFiles = [];

// ==========================================
// AUDIO PROCESSING ENGINE
// ==========================================

function parseWav(buffer) {
    const view = new DataView(buffer);
    const riff = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
    if (riff !== 'RIFF') throw new Error('Not a valid WAV file');

    let offset = 12; 
    let format, channels, sampleRate, bitsPerSample, dataBuffer;

    // Traverse WAV chunks
    while (offset < view.byteLength) {
        if (offset + 8 > view.byteLength) break;
        const chunkId = String.fromCharCode(...new Uint8Array(buffer, offset, 4));
        const chunkSize = view.getUint32(offset + 4, true);

        if (chunkId === 'fmt ') {
            format = view.getUint16(offset + 8, true);
            channels = view.getUint16(offset + 10, true);
            sampleRate = view.getUint32(offset + 12, true);
            bitsPerSample = view.getUint16(offset + 22, true);
        } else if (chunkId === 'data') {
            dataBuffer = buffer.slice(offset + 8, offset + 8 + chunkSize);
        }
        
        offset += 8 + chunkSize + (chunkSize % 2);
    }

    if (!dataBuffer) throw new Error('No data chunk found');

    // Decode PCM Data to Float32
    const samples = dataBuffer.byteLength / (bitsPerSample / 8);
    const floatData = new Float32Array(samples);
    const dataView = new DataView(dataBuffer);

    for (let i = 0; i < samples; i++) {
        if (bitsPerSample === 16) {
            floatData[i] = dataView.getInt16(i * 2, true) / 32768.0;
        } else if (bitsPerSample === 24) {
            let val = dataView.getUint8(i * 3) | (dataView.getUint8(i * 3 + 1) << 8) | (dataView.getInt8(i * 3 + 2) << 16);
            floatData[i] = val / 8388608.0;
        } else if (bitsPerSample === 32 && format === 1) { // 32bit Int
            floatData[i] = dataView.getInt32(i * 4, true) / 2147483648.0;
        } else if (bitsPerSample === 32 && format === 3) { // 32bit Float
            floatData[i] = dataView.getFloat32(i * 4, true);
        } else {
            throw new Error(`Unsupported bit depth: ${bitsPerSample}`);
        }
    }

    // Mono downmix if stereo
    if (channels > 1) {
        const frames = floatData.length / channels;
        const monoData = new Float32Array(frames);
        for (let i = 0; i < frames; i++) {
            let sum = 0;
            for (let c = 0; c < channels; c++) {
                sum += floatData[i * channels + c];
            }
            monoData[i] = sum / channels;
        }
        return { data: monoData, sampleRate };
    }

    return { data: floatData, sampleRate };
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function createWavBuffer(audioData, sampleRate) {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = audioData.length * (bitsPerSample / 8);
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // fmt chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write 16bit PCM samples
    let offset = 44;
    for (let i = 0; i < audioData.length; i++) {
        let s = Math.max(-1, Math.min(1, audioData[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        offset += 2;
    }

    return buffer;
}

function processAudioData(arrayBuffer) {
    const { data, sampleRate } = parseWav(arrayBuffer);
    const frameSize = 2048;
    const cycles = Math.floor(data.length / frameSize);

    if (cycles < 1) throw new Error("File does not contain valid wavetable frames.");

    const targetCycles = 256;
    const newFrames = new Float32Array(targetCycles * frameSize);

    // INTERPOLATION ENGINE (Morph to 256)
    if (cycles === targetCycles) {
        newFrames.set(data.subarray(0, targetCycles * frameSize));
    } else {
        for (let i = 0; i < targetCycles; i++) {
            const pos = cycles > 1 ? i * (cycles - 1) / 255.0 : 0;
            const idx1 = Math.floor(pos);
            const idx2 = Math.min(Math.ceil(pos), cycles - 1);
            const frac = pos - idx1;

            const offset1 = idx1 * frameSize;
            const offset2 = idx2 * frameSize;
            const destOffset = i * frameSize;

            if (idx1 === idx2) {
                for (let j = 0; j < frameSize; j++) {
                    newFrames[destOffset + j] = data[offset1 + j];
                }
            } else {
                for (let j = 0; j < frameSize; j++) {
                    newFrames[destOffset + j] = data[offset1 + j] * (1.0 - frac) + data[offset2 + j] * frac;
                }
            }
        }
    }

    return createWavBuffer(newFrames, sampleRate);
}

// ==========================================
// UI & APP LOGIC
// ==========================================

function openModal(modalElement) {
    modalOverlay.classList.remove('hidden');
    disclaimerModal.classList.add('hidden');
    creditsModal.classList.add('hidden');
    modalElement.classList.remove('hidden');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
    disclaimerModal.classList.add('hidden');
    creditsModal.classList.add('hidden');
}

btnDisclaimer.addEventListener('click', () => openModal(disclaimerModal));
btnCredits.addEventListener('click', () => openModal(creditsModal));
closeDisclaimerBtn.addEventListener('click', closeModal);
closeCreditsBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
});

function showView(viewId) {
    mainView.classList.add('hidden');
    singleView.classList.add('hidden');
    bulkView.classList.add('hidden');
    
    document.getElementById(viewId).classList.remove('hidden');
    
    if (viewId === 'mainView') {
        globalStatus.innerText = "READY";
    } else {
        globalStatus.innerText = "READY (Click to return to Menu)";
    }
    globalStatus.style.color = "#888888";
}

btnGoSingle.addEventListener('click', () => showView('singleView'));
btnGoBulk.addEventListener('click', () => showView('bulkView'));

globalStatus.addEventListener('click', () => {
    if (globalStatus.innerText.includes("Menu")) showView('mainView');
});


// SINGLE EXPORT LOGIC
singleInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.wav')) {
        singleSelectedFile = file;
        singleFileStatus.innerText = `Selected: ${file.name}`;
        singleFileStatus.style.color = "white";
        convertSingleBtn.disabled = false;
    } else {
        singleSelectedFile = null;
        singleFileStatus.innerText = "No valid .wav file selected.";
        singleFileStatus.style.color = "#888";
        convertSingleBtn.disabled = true;
    }
});

convertSingleBtn.addEventListener('click', async () => {
    if (!singleSelectedFile) return;

    convertSingleBtn.disabled = true;
    convertSingleBtn.innerText = "PROCESSING...";
    globalStatus.innerText = "PROCESSING...";
    globalStatus.style.color = "white";

    try {
        const zip = new JSZip();
        const arrayBuffer = await singleSelectedFile.arrayBuffer();
        
        // Execute Audio Processing
        const processedAudioBuffer = processAudioData(arrayBuffer);
        
        const manualFolderName = singleFolderName.value.trim();
        const parentFolderName = manualFolderName !== "" ? manualFolderName + "" : "";
        const baseName = singleSelectedFile.name.replace(/\.wav$/i, '');
        const newBaseName = `${parentFolderName}${baseName}`;
        
        const folder = zip.folder(newBaseName);
        folder.file(`${newBaseName}.wav`, processedAudioBuffer); 
        
        const formatJson = JSON.stringify({
            "formatInfo": { "numSamplesPerSingleCycle": 2048, "numSingleCycles": 256 }
        }, null, 4);
        folder.file("format.json", formatJson);

        globalStatus.innerText = "ZIPPING...";
        const zipBlob = await zip.generateAsync({ type: "blob" });
        
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(zipBlob);
        downloadLink.download = `${newBaseName}_MPC.zip`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        globalStatus.innerText = "SUCCESS! (Click to return to Menu)";
        globalStatus.style.color = "lightgreen";
    } catch (err) {
        console.error(err);
        globalStatus.innerText = "ERROR! (Check Console)";
        globalStatus.style.color = "red";
        alert("Failed to process file: " + err.message);
    } finally {
        convertSingleBtn.innerText = "GENERATE MPC WAVETABLE";
        convertSingleBtn.disabled = false;
    }
});


// BULK EXPORT LOGIC
folderInput.addEventListener('change', (event) => {
    bulkSelectedFiles = Array.from(event.target.files).filter(f => f.name.toLowerCase().endsWith('.wav'));
    
    if (bulkSelectedFiles.length > 0) {
        bulkFileStatus.innerText = `Selected ${bulkSelectedFiles.length} .wav file(s) from folder.`;
        bulkFileStatus.style.color = "white";
        convertBulkBtn.disabled = false;
    } else {
        bulkFileStatus.innerText = "No valid .wav files found.";
        bulkFileStatus.style.color = "#888";
        convertBulkBtn.disabled = true;
    }
});

convertBulkBtn.addEventListener('click', async () => {
    if (bulkSelectedFiles.length === 0) return;

    convertBulkBtn.disabled = true;
    convertBulkBtn.innerText = "PROCESSING...";
    globalStatus.innerText = "PROCESSING...";
    globalStatus.style.color = "white";

    try {
        const zip = new JSZip();
        let successCount = 0;

        // Create the exact required folder structure
        const targetFolder = zip.folder("Serum");

        // Create the single format.json file for the entire batch
        const formatJson = JSON.stringify({
            "formatInfo": { "numSamplesPerSingleCycle": 2048, "numSingleCycles": 256 }
        }, null, 4);
        targetFolder.file("format.json", formatJson);

        for (let i = 0; i < bulkSelectedFiles.length; i++) {
            const file = bulkSelectedFiles[i];
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                
                // Execute Audio Processing
                const processedAudioBuffer = processAudioData(arrayBuffer);
                
                const pathSegments = file.webkitRelativePath ? file.webkitRelativePath.split('/') : [];
                const parentFolderName = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : "Export";
                
                const baseName = file.name.replace(/\.wav$/i, '');
                const newBaseName = `${parentFolderName}_${baseName}`;
                
                // Add the .wav file directly into the root of the Serum folder
                targetFolder.file(`${newBaseName}.wav`, processedAudioBuffer); 
                
                successCount++;
            } catch (err) {
                console.warn(`Skipping corrupted/invalid file ${file.name}:`, err.message);
                continue;
            }
        }

        if (successCount === 0) throw new Error("No valid wavetables could be processed.");

        globalStatus.innerText = "ZIPPING...";
        const zipBlob = await zip.generateAsync({ type: "blob" });
        
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(zipBlob);
        downloadLink.download = "MPC_Wavetables_Bulk_Export.zip";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        globalStatus.innerText = `SUCCESS: ${successCount} FILES! (Click to Menu)`;
        globalStatus.style.color = "lightgreen";
    } catch (err) {
        console.error(err);
        globalStatus.innerText = "ERROR! (Check Console)";
        globalStatus.style.color = "red";
        alert("Bulk export failed: " + err.message);
    } finally {
        convertBulkBtn.innerText = "GENERATE MPC WAVETABLES";
        convertBulkBtn.disabled = false;
    }
});
