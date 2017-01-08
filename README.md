Цель
====

Сделать back-end приложение на Node.js, которое предоставляет REST API по протоколу HTTP 1.1, представляющий функциональность пользовательских комментариев с древовидной структурой.

####Требования

-   В качестве СУБД использовать MongoDB.
-   Оформить проект и его структуру так, как вы делали бы это на большом highload проекте.
-   Покрыть тестами \>90% кода[^calcTest] интеграционными тестами[^wiki] (2).
-   Проект должен быть оформлен так, чтобы он начал работать после этого:
    
><code>npm i\
>npm test\
>\# тут должно быть много тестов и желательно, чтобы они завершились успехом.\
>rm -rf node\_modules\
>npm i --prod\
>npm start</code>

При условии, что MongoDB и Node.js уже установлены

- Версии Node.js и MongoDB должны соответствовать официальным стабильным версиям на момент выполнения тестового задания.
- Для REST API можно использовать любые модули из npm.

####Описание задания

1.  Должен быть реализован REST API.
2.  Сделать методы по регистрации и авторизации через логин с паролем.
3.  Методы для создания и получения списка комментариев.
4.  Метод, который рассчитывает максимальный уровень вложенности в дереве комментариев. Уровень комментария в модели хранить нельзя[^not], метод должен рассчитывать его.
5.  Метод, который будет возвращать массив пользователей с количеством их комментариев и этот массив должен быть отсортирован по убыванию количества комментариев (пользователь с наибольшим количеством комментариев должен быть всегда сверху). Желательно реализовать одним запросом к БД.

####Пожелания

- В файле package.json установить требование к Node.js в соответствии с [https://docs.npmjs.com/files/package.json](https://www.google.com/url?q=https://docs.npmjs.com/files/package.json&sa=D&ust=1483824476246000&usg=AFQjCNE5m9OvJ9UE2NnH6m6SXEWwEf4NvQ), так мы узнаем о требовании к версии Node.js. А требования к версии MongoDB можно будет сообщить отдельно в письме.

####Пожелания к использованию модулей:

-   [https://www.npmjs.com/package/jsonwebtoken](https://www.google.com/url?q=https://www.npmjs.com/package/jsonwebtoken&sa=D&ust=1483824476247000&usg=AFQjCNE26FadOhLP6X4KIl2UfUwmtwhV6Q)
-   [https://www.npmjs.com/package/gulp](https://www.google.com/url?q=https://www.npmjs.com/package/gulp&sa=D&ust=1483824476248000&usg=AFQjCNFIGPL1l-M8IdX5Yq--efrJnt6CgQ)
-   [https://www.npmjs.com/package/chai](https://www.google.com/url?q=https://www.npmjs.com/package/chai&sa=D&ust=1483824476248000&usg=AFQjCNGpUekD4KlVxMI8q3huqldfWN-C0g)
-   [https://www.npmjs.com/package/passport](https://www.google.com/url?q=https://www.npmjs.com/package/passport&sa=D&ust=1483824476248000&usg=AFQjCNH1iXVWDrHCBYcl6gEsGgEC76pzvA)
-   [https://www.npmjs.com/package/mongoose](https://www.google.com/url?q=https://www.npmjs.com/package/mongoose&sa=D&ust=1483824476249000&usg=AFQjCNHI9i8hUXL8PrLnQ_UHZOX81oJnIw)

Их использование не обязательно, можно использовать другие, аналогичные модули. Если вам не жалко времени, можно вообще всё самому сделать без использования модулей. Например, для того чтобы писать и запускать тесты не обязательно использовать gulp и chai, достаточно нативного assert и правильно оформленного scripts.test и package.json.

####Примечание

Структуру хранения комментариев в БД можно выбрать любую, но нужно будет обосновать своё решение, указать на плюсы и минусы вашего решения.

Алгоритм подсчёта 4 и 5 методов backend-а так же можно реализовать разными способами. При обсуждении вашего решения хотелось бы узнать чем вы руководствовались выбираяалгоритм расчёта.

Желательно ознакомиться с информацией:
- http://jstherightway.org/
- [https://github.com/rwaldron/idiomatic.js](https://www.google.com/url?q=https://github.com/rwaldron/idiomatic.js&sa=D&ust=1483824476252000&usg=AFQjCNEarIIp-SmLzzMbCVvPOqU80IMXGg)

[^calcTest]: подсчёт покрытия тестами можно сделать при помощи [https://www.npmjs.com/package/istanbul](https://www.google.com/url?q=https://www.npmjs.com/package/istanbul&sa=D&ust=1483824476253000&usg=AFQjCNFTU-lmQVi1RtOseHEUfViHaNDSZg). В подсчёте покрытия не нужно учитывать сами файлы с тестами и внешние
модули. Будет плюсом, если покрытие тестами будет значительно больше 90%.

[^wiki]: можно почитать на википедии, но в общем смысле - это тест, который делает запрос к REST API имитируя действия пользователя.

[^not]: нельзя хранить число и всё из чего это число можно легко восстановить (массив, дерево комментариев и т.п.). Подойдите к решению этой задачи с фантазией.