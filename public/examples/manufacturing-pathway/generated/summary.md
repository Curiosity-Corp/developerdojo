# Manufacturing pathway results

Computed by `tools/manufacturing_pathway.py` with the methods of the NIST/SEMATECH e-Handbook of Statistical
Methods, chapter 6. This is practice on the handbook's own case study, not an engineering review of any real
process, part or quality system.

- Reference checks: 60 of 60 published handbook values reproduced (the lithography case study's summary,
  analysis of variance and variance components; the X-bar and R chart factors for n = 2 to 10; c4; the individuals
  chart example; the capability example and the table of rejects).
- The record: 450 line widths, 30 cassettes x 3 wafers x 5 sites, nothing missing; the center site has the lowest mean.
- X-bar and s chart, wafer as subgroup (n = 5): centre 2.5323, limits 1.9507 to 3.1139 um;
  27 of 90 wafer means fall outside them.
- Individuals chart on the 30 cassette means: limits 1.1417 to 3.9229 um; 1 outside.
- Variance components: cassette 54.0 %, wafer 10.2 %, site 35.8 % of 0.48999 um^2.
  A capability index on the within-wafer sigma would be 1.61 times too large for single sites.
- Randori cards: A 19 outside (-8); B 14 outside (-13); C 25 outside (-2).
