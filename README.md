Tabele kursów CHF Raiffeisen/Polbank
====================================

Skrypty do generowania tabel historycznych kursów CHF w Raiffeisen/Polbank

```bash
npm -s run bank -- 2007-01-01 2008-01-01 | sort | uniq > 2007.csv

# or

npm -s run bank -- 2017 | sort | uniq # scrapes from 2017-01-01 up to yesterday

```

Tabele kursów są generowane przez scrape'wanie stron Raiffeisen/Polbank.

Wszystkie odpowiedzi (responses) http są cache'owane w katalogu `.cache`.

Aktualizacja wszystkich kursów
------------------------------

```bash
npm run update-rates
```

Libor 3M
--------

```bash
npm run -s libor -- 2007-01-01 2017-03-31 > data/libor-3m-chf.csv
```

Kursy NBP
---------

```bash
npm run -s nbp -- 2017 > data/nbp-2017.csv
```


Zaktualizowanie strony:

```bash
npm run build
npm run deploy
```
