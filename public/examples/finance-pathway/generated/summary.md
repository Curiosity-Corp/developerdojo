# Finance pathway results

Computed by `tools/finance_pathway.py` with the actuarial method of Regulation Z, Appendix J. This is practice
on the regulation's own examples, not a compliance review of any real loan or disclosure.

- Reference checks: 20 of 20 published Appendix J values reproduced (the (b)(9) iteration, and the
  unit-periods and annual percentage rates of the (c)(1) and (c)(3) examples).
- Example (c)(1)(i): amount financed $5000.00, finance charge $520.00,
  total of payments $5520.00, annual percentage rate 9.69 %.
  Amortized at that rate with interest rounded to the cent, the balance after the last payment is $0.02.
- Tolerance read from 12 CFR 1026.22(a)(2): 0.125 percentage point for a regular transaction.
- Ignoring the odd days before the first payment moves the rate beyond that tolerance in 5 of 7 examples (c1-ii, c1-iii, c1-iv, c1-v, c3-ii).
- Randori cards: A -0.74 points; B 1.01 points; C 0.81 points.
