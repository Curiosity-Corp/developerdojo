# Media pathway results

Computed by `tools/media_pathway.py` with the method of Recommendation ITU-R BS.1770-5, the EBU Mode meter of
EBU Tech 3341 and the target of EBU R 128. This is practice on NASA's own launch recording, not a broadcast
compliance check of any real programme.

- Reference checks: 59 of 59 EBU Tech 3341 test responses reproduced within their published tolerances
  (loudness cases 1 to 6, 9, 10, 12 and 13; true-peak cases 15 to 19).
- The recording: 2 channels, 48000 Hz, 16-bit, 32.966 s; left sample peak -10.99 dBFS, 0 samples at full scale.
- Loudness: integrated -27.92 LUFS (193 of 326 blocks used), highest momentary -23.14, highest short-term -23.85 LUFS; true peak -10.98 dBTP.
- R 128: a gain of 4.92 dB reaches -23.02 LUFS with the true peak at -6.06 dBTP (within the -1 dBTP limit).
- Randori cards: A integrated_LUFS -27.87, changeFromBS1770_LU 0.05; B integrated_LUFS -30.06, changeFromBS1770_LU -2.14; C integrated_LUFS -30.93, changeFromBS1770_LU -3.01, gainToTarget_dB 7.93, truePeakAfterThatGain_dBTP -3.05.
