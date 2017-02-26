Tabele kursów CHF Raiffeisen/Polbank
====================================

Skrypty do generowania tabel historycznych kursów CHF w Raiffeisen/Polbank

```bash
npm -s start -- 2007-01-01 2008-01-01 | sort | uniq > 2007.csv
```

Tabele kursów są generowane przez scrape'wanie stron Raiffeisen/Polbank.

Strony są cache'owane w katalogu `.cache`
