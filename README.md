# PhishGuard MVP

**PhishGuard** е изпитен MVP проект: интелигентна многоагентна система за разпознаване на фишинг съобщения и онлайн измами, базирана на OWL онтология и ACL комуникация между агенти.

## Какво покрива проектът

- Web графична част с React/Vite.
- Backend API с Node.js/Express.
- OWL онтология в `server/ontology/phishguard.owl`.
- Манипулация на онтологията през API и UI.
- Поне 2 типа агенти — реализирани са 5.
- ACL комуникация между агентите във FIPA-style JSON формат.
- База данни SQLite за анализи, история и ACL съобщения.
- Документация в `docs/PhishGuard_Documentation.md` и `docs/PhishGuard_Documentation.docx`.

## Архитектура накратко

```text
React Web App
   ↓ HTTP
Express Backend API
   ↓
CoordinatorAgent
   ↓ ACL messages
MessageAnalysisAgent
LinkAnalysisAgent
RiskAssessmentAgent
RecommendationAgent
   ↓
OWL Ontology + SQLite Database
```

## Инсталация

Изисквания:

- Node.js 20+ препоръчително.
- npm.

Стъпки:

```bash
npm install
npm run dev
```

След стартиране:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check: http://localhost:4000/api/health

## Как се демонстрира

1. Отвори web приложението.
2. Постави примерен phishing SMS/email.
3. Натисни **Анализирай съобщението**.
4. Покажи:
   - рисково ниво;
   - открити признаци;
   - препоръки;
   - ACL комуникацията между агентите;
   - записаната история;
   - страницата за управление на онтологията.

Примерно съобщение за тест:

```text
Вашата банкова сметка ще бъде блокирана. Спешно потвърдете паролата и данните си тук: http://secure-bank-login.example.com
```

## Важни директории

```text
client/                 React/Vite графична част
server/                 Express API + агенти + база + онтология
server/src/agents/      Многоагентна система
server/src/services/    Услуги за онтология и база
server/ontology/        OWL файл
server/data/            SQLite DB и JSON модел на онтологията
docs/                   Изпитна документация
```

## Бележка

Това е защитна cybersecurity система. Тя не създава фишинг съобщения, а анализира вече получени съобщения и дава препоръки за предпазване.
