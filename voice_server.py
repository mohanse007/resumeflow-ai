"""
ResumeFlow.AI - Local Open-Source Voice Cloning Server
======================================================
This is a lightweight Python server that hosts an open-source voice cloning model.
It accepts a short voice recording from the browser, extracts its vocal features,
and synthesizes the pitch script in your cloned voice.

Requirements:
    pip install flask flask-cors

For actual voice cloning (requires PyTorch and a GPU is highly recommended):
    pip install TTS

Run the server:
    python voice_server.py
"""

import os
import sys
import tempfile
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS so your browser website (localhost:5173 / 5174) can communicate with it
CORS(app)

# Attempt to import TTS (Coqui) for real voice cloning
HAS_TTS = False
tts_model = None

try:
    print("Initializing local open-source voice models...")
    from TTS.api import TTS
    # Load the multi-lingual XTTS v2 model (supports zero-shot voice cloning)
    print("Loading Coqui XTTS v2 model (this may take a minute on first run)...")
    tts_model = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2", gpu=False)
    HAS_TTS = True
    print("🎉 Coqui XTTS v2 model loaded successfully! Ready for voice cloning.")
except Exception as e:
    print("\n⚠️ WARNING: Could not load Coqui TTS model.")
    print(f"Error detail: {e}")
    print("--------------------------------------------------------------------------------")
    print("The server will run in 'Lightweight Fallback Mode'.")
    print("To enable actual voice cloning, make sure PyTorch and TTS are installed: pip install PyTorch TTS")
    print("--------------------------------------------------------------------------------\n")
    
    # Auto-install gtts if missing
    try:
        import gtts
    except ImportError:
        print("gTTS package is missing. Installing gtts for high-quality fallback text-to-speech...")
        import subprocess
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "gtts"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print("🎉 gTTS successfully installed!")
        except Exception as install_err:
            print(f"Could not auto-install gtts: {install_err}")

@app.route('/tts', methods=['POST'])
def text_to_speech():
    try:
        # 1. Parse text script and audio file from request
        if 'text' not in request.form:
            return jsonify({"error": "No text script provided in form data."}), 400
        
        if 'file' not in request.files:
            return jsonify({"error": "No voice sample file (.webm/.wav) provided in form data."}), 400

        script_text = request.form['text']
        voice_file = request.files['file']

        print(f"Received speech request: '{script_text[:40]}...'")
        print(f"Voice sample name: {voice_file.filename}")

        # Create a temporary directory to process files
        temp_dir = tempfile.gettempdir()
        sample_path = os.path.join(temp_dir, "input_voice_sample.wav")
        output_path = os.path.join(temp_dir, "cloned_voice_output.wav")

        # Clean up old files if they exist
        for path in [sample_path, output_path]:
            if os.path.exists(path):
                os.remove(path)

        # Save the uploaded voice sample
        voice_file.save(sample_path)

        # 2. Run Voice Cloning
        if HAS_TTS and tts_model is not None:
            print("Processing voice cloning using XTTS v2...")
            # Run local cloning inference
            # language="en" for English, speaker_wav=sample_path (your recording)
            tts_model.tts_to_file(
                text=script_text,
                speaker_wav=sample_path,
                language="en",
                file_path=output_path
            )
            print("🎉 Voice cloning inference completed!")
        else:
            print("Processing voice request in Fallback Mode (Simulated Clone)...")
            # In fallback mode, we use a simple system speech synthesis or return a modulated version.
            # Here, we will try to use the gTTS library if installed, or just play a customized voice.
            try:
                from gtts import gTTS
                tts = gTTS(text=script_text, lang='en', tld='co.uk')
                tts.save(output_path)
            except ImportError:
                # If gtts is not installed, we copy the user's recorded input voice sample as output
                # so the server doesn't break and they hear their own recorded sample back.
                import shutil
                shutil.copyfile(sample_path, output_path)
                print("gTTS not installed. Copying raw input sample to output.")

        # 3. Stream the generated cloned audio WAV back to the browser
        if os.path.exists(output_path):
            resp = send_file(
                output_path,
                mimetype="audio/wav",
                as_attachment=True,
                download_name="cloned_voice.wav"
            )
            # Add custom header to inform frontend of the synthesis engine used
            resp.headers["X-Voice-Engine"] = "Coqui-XTTS" if HAS_TTS else "Simulated"
            return resp
        else:
            return jsonify({"error": "Failed to generate cloned voice file."}), 500

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "engine": "Coqui XTTS v2" if HAS_TTS else "Simulated Fallback",
        "voice_cloning_ready": HAS_TTS
    })

if __name__ == '__main__':
    # Start the server on port 5000
    app.run(host='0.0.0.0', port=5000, debug=False)
