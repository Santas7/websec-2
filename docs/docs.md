# Классификаторы и API общественного транспорта Самары

## Классификатор остановок

Каждый остановочный павильон в Самаре и пригородах имеет уникальный классификаторный номер и текстовое описание на русском и английском языках. Данные хранятся в документе формата XML по адресу [tosamara.ru/api/v2/classifiers/stops.xml](http://tosamara.ru/api/v2/classifiers/stops.xml) и имеют следующую структуру:

```xml
<stops>
  <stop>
    <KS_ID>1</KS_ID>
    <title>пос. Управленческий</title>
    <adjacentStreet>на ул. Сергея Лазо</adjacentStreet>
    <direction>в сторону города</direction>
    <titleEn>p.g.t.Upravlencheskij</titleEn>
    <adjacentStreetEn>on Sergeya Lazo st.</adjacentStreetEn>
    <directionEn>towards the city</directionEn>
  </stop>
  ...
</stops>
```

### Описание полей:
- `<stop>` — нода остановки;
- `KS_ID` — классификаторный номер остановки;
- `title` — собственное название;
- `adjacentStreet` — улица, на которой расположена остановка;
- `direction` — преимущественное направление движения;
- `titleEn` — собственное название на английском языке;
- `adjacentStreetEn` — улица на английском;
- `directionEn` — преимущественное направление движения на английском.

---

## Классификатор остановок с координатами

Расширенная версия классификатора остановок, включающая географические координаты и перечисления проходящих маршрутов. Используется в «Прибывалках». Хранится в документе формата XML по адресу [tosamara.ru/api/v2/classifiers/stopsFullDB.xml](http://tosamara.ru/api/v2/classifiers/stopsFullDB.xml) и имеет следующую структуру:

```xml
<stops>
  <stop>
    <KS_ID>1</KS_ID>
    <title>пос. Управленческий</title>
    <adjacentStreet>на ул. Сергея Лазо</adjacentStreet>
    <direction>в сторону города</direction>
    <titleEn>p.g.t.Upravlencheskij</titleEn>
    <adjacentStreetEn>on Sergeya Lazo st.</adjacentStreetEn>
    <directionEn>towards the city</directionEn>
    <cluster/>
    <busesMunicipal>1, 45, 50, 51, 78, 79</busesMunicipal>
    <busesCommercial>1, 1к, 50, 210, 221, 232</busesCommercial>
    <busesPrigorod>113, 389, 392, 392а, 406, 447</busesPrigorod>
    <busesSeason>132, 170, 175к</busesSeason>
    <busesSpecial>4к</busesSpecial>
    <busesIntercity>110</busesIntercity>
    <trams/>
    <trolleybuses/>
    <metros/>
    <electricTrains/>
    <riverTransports/>
    <infotabloExists>нет</infotabloExists>
    <latitude>53.3464155735113</latitude>
    <longitude>50.2179908006275</longitude>
  </stop>
  ...
</stops>
```

### Описание полей:
- `<stop>` — нода остановки;
- `KS_ID` — классификаторный номер остановки;
- `title` — собственное название;
- `adjacentStreet` — улица, на которой расположена остановка;
- `direction` — преимущественное направление движения;
- `titleEn` — собственное название на английском языке;
- `adjacentStreetEn` — улица на английском;
- `directionEn` — преимущественное направление движения на английском;
- `cluster` — номер остановочного кластера, редко заполнен;
- `busesMunicipal` — перечисление маршрутов муниципальных автобусов;
- `busesCommercial` — перечисление маршрутов коммерческих автобусов;
- `busesPrigorod` — перечисление маршрутов пригородных автобусов;
- `busesSeason` — перечисление маршрутов сезонных (дачных) автобусов;
- `busesSpecial` — перечисление маршрутов специальных автобусов;
- `busesIntercity` — перечисление маршрутов междугородных автобусов;
- `trams` — перечисление маршрутов трамваев;
- `trolleybuses` — перечисление маршрутов троллейбусов;
- `metros` — перечисление линий метрополитена (в Самаре одна линия);
- `electricTrains` — перечисление маршрутов электропоездов;
- `riverTransports` — перечисление маршрутов речных переправ;
- `infotabloExists` — признак наличия информационного табло;
- `latitude` — географическая северная широта, в градусах;
- `longitude` — географическая восточная долгота, в градусах.

---

## Классификатор маршрутов

Содержит все маршруты городского транспорта: автобусы, трамваи, троллейбусы, метрополитен. Включает муниципальные, коммерческие, пригородные, сезонные (дачные) и специальные маршруты. Каждое направление маршрута имеет уникальный классификаторный номер и описание на русском и английском языках. Хранится в документе формата XML по адресу [tosamara.ru/api/v2/classifiers/routes.xml](http://tosamara.ru/api/v2/classifiers/routes.xml):

```xml
<routes>
  <route>
    <KR_ID>1</KR_ID>
    <number>1</number>
    <direction>Железнодорожный вокзал</direction>
    <directionEn>Railway Station</directionEn>
    <transportTypeID>1</transportTypeID>
    <transportType>Автобус</transportType>
    <affiliationID>1</affiliationID>
    <affiliation>Городской муниципальный маршрут</affiliation>
    <realtimeForecast>1</realtimeForecast>
  </route>
  ...
</routes>
```

### Описание полей:
- `<route>` — нода маршрута;
- `KR_ID` — классификаторный номер маршрута;
- `number` — номер маршрута (на табличках);
- `direction` — направление движения, обычно конечная остановка;
- `directionEn` — направление на английском языке;
- `transportType` — вид транспорта: автобус, трамвай, троллейбус, метрополитен, электропоезд, речной транспорт;
- `transportTypeID` — числовой код вида транспорта:  
  - 1 — автобус,  
  - 2 — метрополитен,  
  - 3 — трамвай,  
  - 4 — троллейбус,  
  - 5 — электропоезд,  
  - 6 — речной транспорт;
- `affiliation` — принадлежность маршрута: муниципальный, коммерческий, пригородный, сезонный, специальный, междугородный;
- `affiliationID` — числовой код принадлежности:  
  - 1 — муниципальный,  
  - 2 — коммерческий,  
  - 3 — пригородный,  
  - 4 — сезонный (дачный),  
  - 5 — специальный,  
  - 6 — междугородный (шаттлы включаются в "специальный автобус");
- `realtimeForecast` — признак прогноза по мониторингу в реальном времени.

---

## Структура маршрутов

Справочник задает связь маршрутов и остановок, перечисляя последовательность остановок в порядке их прохождения. Хранится в документе формата XML по адресу [tosamara.ru/api/v2/classifiers/routesAndStopsCorrespondence.xml](http://tosamara.ru/api/v2/classifiers/routesAndStopsCorrespondence.xml):

```xml
<routes>
  <route>
    <KR_ID>1</KR_ID>
    <number>1</number>
    <direction>Железнодорожный вокзал</direction>
    <transportType>
      <id>1</id>
      <title>Автобус</title>
    </transportType>
    <performing>1</performing>
    <realtimeForecast>1</realtimeForecast>
    <stop>
      <KS_ID>280</KS_ID>
      <title>Автостанция "Красная Глинка"</title>
      <adjacentStreet>на ул. Батайской</adjacentStreet>
      <direction>в сторону лыжной базы</direction>
      <scheduleTime>0</scheduleTime>
    </stop>
    ...
    <geometry>
      50.169012,53.38527 50.168017,53.384986 ...
    </geometry>
  </route>
  ...
</routes>
```

### Описание полей:
- `<route>` — нода маршрута;
- `KR_ID` — классификаторный номер маршрута;
- `number` — номер маршрута (на табличках);
- `direction` — направление движения, обычно конечная остановка;
- `transportType/id` — числовой код вида транспорта (см. выше);
- `transportType/title` — вид транспорта;
- `performing` — признак выполнения маршрута: 1 — да, 0 — нет;
- `realtimeForecast` — признак прогноза по мониторингу в реальном времени;
- `geometry` — геометрическая форма маршрута в формате «долгота,широта ...» (WGS 84);
- `<stop>` — нода остановки;
- `KS_ID` — классификаторный номер остановки;
- `title` — собственное название;
- `adjacentStreet` — улица;
- `direction` — направление движения;
- `scheduleTime` — плановое время прибытия от начала рейса (часто не заполнено).

**Уточнение от 1 октября 2015:** Ранее поля `transportType/id` и `title` заполнялись некорректно: `id` содержал текст, а `title` был пустым. Исправьте приложения, если они используют старую структуру.

---

## Остановки на карте

Справочник связывает остановки с объектами на карте муниципального геопортала Самары. Хранится в документе формата XML по адресу [tosamara.ru/api/v2/classifiers/GeoportalStopsCorrespondence.xml](http://tosamara.ru/api/v2/classifiers/GeoportalStopsCorrespondence.xml):

```xml
<stops>
  <layerName>TR_1_823</layerName>
  <stop>
    <KS_ID>1348</KS_ID>
    <geoportalId>1936819</geoportalId>
    <staticDescription>
      <![CDATA[
        Остановка на ул. Ново-Вокзальной, в сторону Московского шоссе...
      ]]>
    </staticDescription>
  </stop>
  ...
</stops>
```

### Описание полей:
- `layerName` — идентификатор геопортального слоя с остановками;
- `<stop>` — нода остановки;
- `KS_ID` — классификаторный номер остановки;
- `geoportalId` — идентификатор геопортального объекта остановки;
- `staticDescription` — постоянная часть описания объекта.

---

## Маршруты на карте

Справочник связывает маршруты с объектами на карте муниципального геопортала Самары. Хранится в документе формата XML по адресу [tosamara.ru/api/v2/classifiers/GeoportalRoutesCorrespondence.xml](http://tosamara.ru/api/v2/classifiers/GeoportalRoutesCorrespondence.xml):

```xml
<routes>
  <route>
    <KR_ID>1</KR_ID>
    <geoportalId>1936957</geoportalId>
    <layerName>TR_30_3518</layerName>
  </route>
  ...
</routes>
```

### Описание полей:
- `<route>` — нода маршрута;
- `KR_ID` — классификаторный номер маршрута;
- `geoportalId` — идентификатор геопортального объекта маршрута;
- `layerName` — идентификатор геопортального слоя с маршрутом.

---

## Методы API

Программный интерфейс принимает HTTP-запросы типов GET и POST:  
- XML: [tosamara.ru/api/v2/xml](http://tosamara.ru/api/v2/xml);  
- JSON: [tosamara.ru/api/v2/json](http://tosamara.ru/api/v2/json).  

### POST-запросы
Тип контента: `application/x-www-form-urlencoded`. Поля:  
- `clientId` — идентификатор клиента (при регистрации);  
- `authKey` — сигнатура;  
- `os` — операционная система;  
- `message` — смысловое обращение (формат ниже).  

**Сигнатура:** SHA1(`message` + `secret_key`), где `secret_key` — ключ разработчика.

### GET-запросы
Сигнатура рассчитывается аналогично, но на основе параметров:  
- `getFirstArrivalToStop`: SHA1(`KS_ID` + `COUNT` + `secret_key`);  
- `getRouteArrivalToStop`: SHA1(`KR_ID` + `KS_ID` + `secret_key`);  
- и т.д. (см. полный список в исходном тексте).  

**Примечания:**  
- Разделитель дробной части — точка.  
- Необязательные поля при отсутствии считаются пустыми (`""`).  

---

### `getFirstArrivalToStop()`
Прогноз прибытия транспорта на остановку. Поддерживает запрос на несколько остановок.

#### Параметры:
- `KS_ID` — номер остановки;  
- `COUNT` — количество ближайших маршрутов (необязательно).  

#### Пример POST XML:
```xml
<request>
  <method>getFirstArrivalToStop</method>
  <parameters>
    <KS_ID>9</KS_ID>
    <COUNT>10</COUNT>
  </parameters>
</request>
```

#### Пример JSON:
```json
{
  "method": "getFirstArrivalToStop",
  "KS_ID": 9,
  "COUNT": 10
}
```

#### Пример GET:
```
?method=getFirstArrivalToStop&KS_ID=9&COUNT=10&os=android&clientid=appName%2F1.0&authkey=...
```

#### Ответ XML:
```xml
<arrival>
  <transport>
    <type>Автобус</type>
    <number>1</number>
    <KR_ID>1</KR_ID>
    <time>30</time>
    <timeInSeconds>1820</timeInSeconds>
    <hullNo>31676</hullNo>
    ...
  </transport>
</arrival>
```

#### Поля ответа:
- `type` — тип транспорта;  
- `number` — номер маршрута;  
- `time` — время до прибытия (мин);  
- `timeInSeconds` — время в секундах;  
- `hullNo` — идентификатор транспорта;  
- и др.

---
