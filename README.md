Tabele kursów CHF Raiffeisen/Polbank
====================================

Skrypty do generowania tabel historycznych kursów CHF w Raiffeisen/Polbank

```bash
npm -s start -- 2007-01-01 2008-01-01 | sort | uniq > 2007.csv

# or

npm -s start -- 2017 # scrapes from 2017-01-01 up to yesterday

```

Tabele kursów są generowane przez scrape'wanie stron Raiffeisen/Polbank.

Strony Raiffeisen/Polbank są cache'owane w katalogu `.cache`

Zaktualizowanie strony:

```bash
npm run build
npm run deploy
```
