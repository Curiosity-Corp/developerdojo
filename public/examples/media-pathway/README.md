# Media pathway files

The worked example for the media pathway (/katas/media-pathway): from a recording to a measured, normalised
programme loudness. Everything under `generated/` is computed by `tools/media_pathway.py`. The site's CI reruns the
script on every pipeline (job `media_pathway`) and fails if any file differs from the published copy, so these
results are not typed by hand.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/artemis-ii-launch-pad-camera-site-4.wav` | NASA's Artemis II launch recording from Pad Camera Site 4, byte for byte | US government work, public domain (see below) |
| `tools/media_pathway.py` | The script: the loudness meter, its checks against the EBU Tech 3341 test signals, the recording inspection, loudness and true peak, the R 128 normalisation and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads the recording for a maintainer, checks the SHA-1 Commons publishes and prints the SHA-256. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | Each Tech 3341 test signal, the published reading with its tolerance and the script's reading | MIT, Developer Dojo |
| `generated/inspection.json` | The WAV header, and each channel's sample peak, RMS level, DC offset and full-scale samples (MED-001) | MIT, Developer Dojo |
| `generated/loudness.json` | Integrated loudness, the gate, the highest momentary and short-term loudness and the true peak (MED-002) | MIT, Developer Dojo |
| `generated/loudness-series.csv` | Momentary and short-term loudness every 100 ms | MIT, Developer Dojo |
| `generated/normalisation.json` | The gain to the R 128 target, the loudness remeasured after it, the true peak after it and the gain the true-peak limit allows (MED-003) | MIT, Developer Dojo |
| `generated/randori/cards.json` | The three Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of the input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **Recommendation ITU-R BS.1770-5** (11/2023), Algorithms to measure audio programme loudness and true-peak audio
  level, `https://www.itu.int/rec/R-REC-BS.1770`, downloaded free of charge and read on 2026-11-25. The script uses
  its K-weighting coefficients (Tables 1 and 2), its channel weights (Table 3), equations 1 to 7 and the 48-tap
  interpolating filter of Annex 2, each named in the code. The rest of the text is not copied here.
- **EBU Tech 3341** (V4, November 2023), Loudness metering: 'EBU Mode' metering to supplement EBU R 128 loudness
  normalisation, `https://tech.ebu.ch/docs/tech/tech3341.pdf`, read on 2026-11-25. The script uses its momentary
  (0.4 s) and short-term (3 s) windows and synthesizes the minimum-requirements test signals of its Table 1 that are
  defined by their tones (cases 1 to 6, 9, 10, 12 and 13) and the true-peak signals 15 to 19.
- **EBU R 128** (V5, November 2023), Loudness normalisation and permitted maximum level of audio signals,
  `https://tech.ebu.ch/docs/r/r128.pdf`, read on 2026-11-25: target -23.0 LUFS, +/-0.5 LU for programmes that are
  not live, maximum true peak -1 dBTP.
- **The recording.** NASA Kennedy Space Center, Artemis II Live Launch Coverage, Pad Camera Site 4 (NASA ID
  KSC-20260401-AU-LMM01-0001), 1 April 2026, from Wikimedia Commons, downloaded on 2026-11-25: 6,343,708 bytes,
  SHA-1 `b05c096ee0279ce700741f0852dea19f80038b4e` (the value Commons publishes), SHA-256
  `18b1c6c1dae385f4f9e69b36377d41399ec50c50ce532dfbf1041962e838410d`. Stereo, 48 kHz, 16-bit PCM, 32.966 s. The
  file holds only the format and the samples, with no metadata chunks.
- **Terms.** The recording is a work of the US government and in the public domain in the US (17 U.S.C. 105).
  NASA asks that its name, insignia and imagery not be used to imply endorsement; nothing here does.

## Method

- **Inspection.** The WAV header gives channels, sample rate, bit depth and frames; the script refuses anything but
  16-bit PCM at 48 kHz, the rate the BS.1770-5 coefficients are published for. Levels are in dBFS with 32768 as full
  scale; the DC offset is the mean sample in percent of full scale.
- **Loudness.** Each channel goes through the two K-weighting biquads in series (transposed direct form II, in
  floating point). The channels' mean squares are weighted by Table 3 and summed; loudness is -0.691 + 10 log10 of
  that sum. Integrated loudness uses 400 ms blocks every 100 ms (incomplete blocks at the end are not used), the
  -70 LKFS absolute gate and the relative gate 10 LU below the absolute-gated loudness. Momentary and short-term
  loudness are ungated 0.4 s and 3 s windows; their highest values are taken over every sample position, as a
  file-based meter must for test cases 10 and 13.
- **True peak.** Annex 2: 4x over-sampling through the four phases of its interpolating filter, then the largest
  absolute value, in dBTP. In floating point the 12.04 dB attenuation and its compensation cancel, so they are left
  out. The true-peak test tones are 1 s long with a linear 10 ms fade-in and fade-out; Tech 3341 asks for a taper
  without fixing its shape.
- **Normalisation.** The gain is the target minus the integrated loudness. The script applies it to the samples and
  measures again, adds it to the true peak, and works out the largest gain the -1 dBTP limit allows.
- **Randori cards.** A: the same gates on the plain mean square, with no K-weighting. B: only the absolute gate.
  C: the left channel alone, as a mono file would be measured.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/media_pathway.py . my-output
    diff -r my-output generated

Run it from this folder; it takes under a minute on a laptop. The script removes and recreates the output folder
you name, so give it a new one. It first checks its meter against the Tech 3341 test signals and exits with an
error, writing nothing, if any reading falls outside its tolerance. `diff` prints nothing when your results match
the published ones. Another Python version changes only the `python` field in `manifest.json`.

## Limits

- This is practice on NASA's public recording, not a broadcast compliance check. Nothing here says that any real
  programme, meter or delivery meets EBU R 128 or a broadcaster's or platform's specification, and no broadcast
  audio engineer, delivery quality-control specialist or mastering engineer has reviewed it.
- Tech 3341 cases 7 and 8 need the EBU's authentic programme files, 11 and 14 are for live meters, and 20 to 23
  need an anti-aliasing filter Tech 3341 does not specify; none of them is run. Loudness range (EBU Tech 3342) is
  not covered.
- Only 48 kHz and up to five channels (L, R, C, Ls, Rs). Other sample rates need K-weighting coefficients designed
  for them, and the advanced sound systems of BS.1770-5 are not covered.
- The pathway plans a gain and never limits or compresses the recording.
- No learner has run these katas yet.
