# SAST-övning: få din första kodanalysrapport

**Vad du ska göra:** du får en liten JavaScript-app som innehåller säkerhetsproblem. Du lägger den på GitHub och slår på ett SAST-verktyg som heter **CodeQL**. Verktyget läser din kod och skapar en rapport över säkerhetsproblem.

**Var finns verktyget?** CodeQL är en del av GitHub. Du installerar inget på din dator. När du slår på det i ditt repo (steg 5) startar GitHub en analys av din kod på sina egna servrar, varje gång du pushar kod. Resultatet visas i en rapport på GitHub.

Tid: ca 45 minuter. Du lämnar inte in något. Målet är att du får fram rapporten och förstår hur den läses.

> Appen är **medvetet osäker**. Kör den bara lokalt och lägg aldrig upp den som en riktig tjänst.

## Det här behöver du
- Ett GitHub-konto. Logga in på github.com innan du börjar.
- Git installerat på datorn.

## Steg 1: Packa upp koden (2 min)
Ladda ner `sast-ovning.zip` och packa upp den. Du får en mapp som heter `sast-ovning`. Öppna ett terminalfönster i den mappen.

## Steg 2: Skapa ett repo på GitHub (3 min)
1. Gå till https://github.com/new
2. Skriv `sast-ovning` som repository name.
3. Välj **Public**. Det måste vara Public, annars är CodeQL inte gratis.
4. Lämna alla andra rutor tomma (ingen README, ingen .gitignore).
5. Klicka **Create repository**.

## Steg 3: Skicka upp koden till GitHub (5 min)
Kör kommandona ett i taget i terminalen. Byt ut `DITT-ANVÄNDARNAMN` mot ditt GitHub-användarnamn.

```
git init
git add .
git commit -m "Första version"
git branch -M main
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/sast-ovning.git
git push -u origin main
```

Ladda om sidan för ditt repo på github.com. Du ska nu se filerna `src`, `package.json` och `README.md`.

## Steg 4: Gissa först (5 min)
Öppna `src/server.js` i din editor. Skriv ner 2–3 saker som du tror är osäkra. Tänk på föreläsningen: indata, SQL och hemligheter. Du jämför med rapporten i steg 6.

## Steg 5: Slå på CodeQL (10 min)
Allt i det här steget görs på github.com, i ditt repo.

1. Klicka på fliken **Settings** (högst upp i repot, längst till höger).
2. Klicka på **Advanced Security** i menyn till vänster.
3. Scrolla ner till raden **CodeQL analysis** och klicka på **Set up**. Välj **Default** i menyn som öppnas.
4. En ruta visar att språket **JavaScript / TypeScript** hittats. Klicka på **Enable CodeQL**.
5. Klicka på fliken **Actions**. Där ser du en körning som heter **CodeQL**. Den tar 2–5 minuter första gången. Vänta tills den har en grön bock.

## Steg 6: Läs rapporten (10 min)
1. Klicka på fliken **Security** i ditt repo.
2. Klicka på **Code scanning** i menyn till vänster. Du ser en lista med fynd.
3. Klicka på ett fynd. Titta på:
   - regelnamnet, till exempel *SQL injection*, och allvarlighetsgraden
   - fil och radnummer
   - **Show paths**: vägen från indata (källa) till det farliga anropet (sänka)
4. Jämför med dina gissningar från steg 4. Vad hittade du som verktyget missade, och vad hittade verktyget som du missade?

**Klart:** du har en CodeQL-rapport med fynd på skärmen.

## Extra: åtgärda ett fynd (10 min)
1. Öppna `src/server.js` och ändra koden för ett fynd. Exempel: i `/search`, använd en parameteriserad fråga med `?` i stället för att klistra ihop texten.
2. Kör `git add .`, `git commit -m "Åtgärdar fynd"` och `git push`.
3. Vänta på att CodeQL i fliken Actions blir grön. Fyndet ska nu vara stängt i Security → Code scanning.

## Fastnar du?
- **Fliken Security eller Advanced Security syns inte:** kontrollera att repot är Public (Settings → General, längst ner under *Danger Zone*).
- **Menyn heter något annat än i instruktionen:** GitHub ändrar ibland namn. Fråga läraren.
- **Inga fynd efter 10 minuter:** öppna fliken Actions. Är körningen röd, klicka på den och läs felet. Går den fortfarande, vänta.
- **`git push` nekas:** kontrollera att användarnamnet i adressen är rätt och att du är inloggad på GitHub.
- **`remote origin already exists`:** kör `git remote remove origin` och sedan `git remote add ...` igen.
