необходимо создать .env файл и добавить в него строку, а так же вместо username, password и dbname подставить значения 
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"


типы полей:
status - имеет несколько допустимых значений: 'New', 'Work', 'Resolved', 'Close'.
id - number
message - string
description - string
title - string
date - string
startDate - string
endDate - string


обработка роутов

	Создать обращение - POST /create в body необходимо передать json с 2 обязательными полями: title - тема обращения ,description - текст обращения и 1 не обязательным status

	Взять обращение в работу - PUT /:id/take-in-work необходимо передать id 

	Завершить обработку обращения и Отмена обращения - POST /status-change в body необходимо передать json с 2 обязательными полями: id ,status и 1 не обязательным message

	Получить список обращений с возможность фильтрации по конкретной дате и по диапазону дат - GET /get-date-reports необходимо передать в url date в формате 2025(год)-05(месяц)-01(день)  ?startDate=2025-05-01&endDate=2025-05-31 или date=2025-05-15 для сортировки по конкретному числу

	endpoint который отменит все обращения, которые находятся в статусе "в работе" - PUT /close-all-reports