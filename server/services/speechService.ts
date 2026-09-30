/**
 * JanSetu AI - Speech-to-Text Service Layer
 * Supports voice complaints via Gemini 3.5 Transcribe and provides
 * demo fallbacks with verified vernacular transcripts.
 */

import { transcribeAudioWithGemini, isGeminiConfigured } from '../ai/gemini.js';

export interface TranscriptionResult {
  text: string;
  language?: string;
  confidence: number;
  source: 'gemini-3.5-transcribe' | 'demo-transcript-fallback';
}

export class SpeechService {
  /**
   * Transcribe citizen voice audio input
   */
  public async transcribeAudio(
    audioBase64?: string,
    mimeType = 'audio/webm',
    demoPreset?: string
  ): Promise<TranscriptionResult> {
    if (demoPreset) {
      return this.getDemoPreset(demoPreset);
    }

    if (audioBase64 && isGeminiConfigured()) {
      try {
        const result = await transcribeAudioWithGemini(audioBase64, mimeType);
        return {
          text: result.text,
          confidence: result.confidence,
          source: 'gemini-3.5-transcribe',
        };
      } catch (err) {
        console.warn('[JanSetu AI] Gemini audio transcription failed, falling back to demo preset:', err);
      }
    }

    // Default demo voice complaint (Telugu medical scenario from hackathon specification)
    return {
      text: 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.',
      language: 'Telugu',
      confidence: 0.96,
      source: 'demo-transcript-fallback',
    };
  }

  /**
   * Verified vernacular preset transcripts for hackathon demonstration
   */
  public getDemoPreset(presetName: string): TranscriptionResult {
    switch (presetName.toLowerCase()) {
      case 'telugu-hospital':
        return {
          text: 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.',
          language: 'Telugu',
          confidence: 0.97,
          source: 'demo-transcript-fallback',
        };
      case 'hindi-hospital':
        return {
          text: 'हमारे गांव में प्राथमिक स्वास्थ्य केंद्र नहीं है। इलाज के लिए 25 किलोमीटर दूर जाना पड़ता है।',
          language: 'Hindi',
          confidence: 0.95,
          source: 'demo-transcript-fallback',
        };
      case 'english-hospital':
        return {
          text: 'Our village does not have a proper hospital. We have to travel 20 km for treatment.',
          language: 'English',
          confidence: 0.98,
          source: 'demo-transcript-fallback',
        };
      case 'telugu-water':
        return {
          text: 'గ్రామంలో తాగే నీటి సమస్య చాలా తీవ్రంగా ఉంది. బోరు బావులు ఎండిపోయాయి.',
          language: 'Telugu',
          confidence: 0.94,
          source: 'demo-transcript-fallback',
        };
      case 'hindi-power':
        return {
          text: 'खेती के लिए केवल 3 घंटे बिजली मिलती है, वो भी रात में ट्रांसफार्मर जल जाता है।',
          language: 'Hindi',
          confidence: 0.93,
          source: 'demo-transcript-fallback',
        };
      case 'english-roads':
        return {
          text: 'Main approach road washed away during monsoon, buses cannot reach the village school.',
          language: 'English',
          confidence: 0.96,
          source: 'demo-transcript-fallback',
        };
      default:
        return {
          text: 'మా గ్రామంలో సరైన ఆసుపత్రి లేదు. చికిత్స కోసం 20 కిలోమీటర్లు ప్రయాణించాలి.',
          language: 'Telugu',
          confidence: 0.95,
          source: 'demo-transcript-fallback',
        };
    }
  }
}

export const speechService = new SpeechService();
