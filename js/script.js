const clientId = "test";
const secretKey = "just_f0r_tests";
let stopsData = [];
let routesData = [];
let routeStopsData = [];
let map;
const itemsPerPage = 10;
let userPosition = null;
let stopMarkers = []; 

// Инициализация карты и геопозиции
$(document).ready(function() {
    map = L.map('map').setView([53.2001, 50.15], 12); // Центр Самары
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userPosition = [position.coords.latitude, position.coords.longitude];
                map.setView(userPosition, 14);
                L.marker(userPosition).addTo(map).bindPopup("Вы здесь").openPopup();
            },
            () => console.log("Геопозиция не доступна")
        );
    }
    //console.log(1)
    loadStops();
    loadRoutes();
    loadRouteStopsCorrespondence();
    loadFavorites();
});

function generateAuthKey(params) {
    //console.log(params)
    return CryptoJS.SHA1(params + secretKey).toString();
}

function showNotification(message, type = 'success') {
    $("#notificationText").text(message);
    $("#notification").removeClass('d-none alert-success alert-danger')
        .addClass(`alert-${type}`).fadeIn();
    setTimeout(() => $("#notification").fadeOut(), 3000);
}

function loadStops() {
    $.ajax({
        url: "https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml",
        method: "GET",
        dataType: "xml",
        success: function(data) {
            stopsData = [];
            stopMarkers = [];
            $(data).find("stop").each(function() {
                const stop = {
                    ksId: $(this).find("KS_ID").text(),
                    title: $(this).find("title").text(),
                    adjacentStreet: $(this).find("adjacentStreet").text(),
                    latitude: parseFloat($(this).find("latitude").text()),
                    longitude: parseFloat($(this).find("longitude").text())
                };
                stopsData.push(stop);
                const marker = L.marker([stop.latitude, stop.longitude])
                    .bindPopup(`<b>${stop.title}</b><br><button onclick="getStopForecast('${stop.ksId}')">Прогноз</button>`);
                stopMarkers.push(marker); 
            });
            if (userPosition) sortStopsByDistance();
            displayStops(stopsData, 1);
        },
        error: function(error) {
            $("#stopList").html("<p>Ошибка загрузки остановок</p>");
        }
    });
}

function toggleStopsOnMap() {
    const isChecked = $("#showStopsOnMap").is(":checked");
    if (isChecked) {
        stopMarkers.forEach(marker => marker.addTo(map));
    } else {
        stopMarkers.forEach(marker => map.removeLayer(marker));
    }
}

function sortStopsByDistance() {
    stopsData.sort((a, b) => {
        const distA = getDistance(userPosition[0], userPosition[1], a.latitude, a.longitude);
        const distB = getDistance(userPosition[0], userPosition[1], b.latitude, b.longitude);
        return distA - distB;
    });
}

// Расчет расстояния между точками (в метрах)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


function displayStops(stops, page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedStops = stops.slice(start, end);

    let html = '<table class="table table-striped"><thead><tr><th>ID</th><th>Название</th><th>Улица</th><th>Действия</th></tr></thead><tbody>';
    paginatedStops.forEach(stop => {
        const isFavorite = isInFavorites(stop.ksId);
        const favIcon = isFavorite ? '✖' : '✔';
        const favClass = isFavorite ? 'remove' : 'add';
        html += `<tr>
            <td>${stop.ksId}</td>
            <td>${stop.title}</td>
            <td>${stop.adjacentStreet}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="getStopForecast('${stop.ksId}')">Прогноз</button>
                <span class="favorite-btn ${favClass}" onclick="toggleFavorite('${stop.ksId}', '${stop.title}')">${favIcon}</span>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    $("#stopList").html(html);

    updatePagination(stops.length, page, '#stopPagination', displayStops, stops);
}

$("#searchStops").click(function() {
    const query = $("#stopSearch").val().toLowerCase();
    const filteredStops = stopsData.filter(stop => stop.title.toLowerCase().includes(query));
    displayStops(filteredStops, 1);
    if (filteredStops.length > 0) {
        map.setView([filteredStops[0].latitude, filteredStops[0].longitude], 12);
    }
});

function getStopForecast(ksId) {
    const count = "5";
    const authKey = generateAuthKey(ksId + count);
    const url = `https://tosamara.ru/api/v2/json?method=getFirstArrivalToStop&KS_ID=${ksId}&COUNT=${count}&os=web&clientId=${clientId}&authKey=${authKey}`;

    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function(data) {
            let html = '<h5>Прогноз для остановки</h5><table class="table table-striped"><thead><tr><th>Тип</th><th>Номер</th><th>Время (мин)</th></tr></thead><tbody>';
            if (data.transport) {
                data.transport.forEach(t => {
                    сonsole.log(t)
                    html += `<tr><td>${t.type}</td><td>${t.number}</td><td>${t.time === 'Ошибка' ? 'Время неизвестно' : t.time}</td></tr>`;
                });
            } else {
                html += '<tr><td colspan="3">Нет данных</td></tr>';
            }
            html += "</tbody></table>";
            $("#stopForecast").html(html);
        },
        error: function(error) {
            $("#stopForecast").html("<p>Транспорта нету</p>");
        }
    });
}

function loadRoutes() {
    $.ajax({
        url: "https://tosamara.ru/api/v2/classifiers/routes.xml",
        method: "GET",
        dataType: "xml",
        success: function(data) {
            routesData = [];
            $(data).find("route").each(function() {
                routesData.push({
                    krId: $(this).find("KR_ID").text(),
                    number: $(this).find("number").text(),
                    direction: $(this).find("direction").text()
                });
            });
            displayRoutes(routesData, 1);
        },
        error: function(error) {
            $("#routeList").html("<p>Ошибка загрузки маршрутов</p>");
        }
    });
}

function loadRouteStopsCorrespondence() {
    $.ajax({
        url: "https://tosamara.ru/api/v2/classifiers/routesAndStopsCorrespondence.xml",
        method: "GET",
        dataType: "xml",
        success: function(data) {
            routeStopsData = [];
            $(data).find("route").each(function() {
                const krId = $(this).find("KR_ID").text();
                const stops = [];
                $(this).find("stop").each(function() {
                    stops.push({
                        ksId: $(this).find("KS_ID").text(),
                        title: $(this).find("title").text()
                    });
                });
                routeStopsData.push({ krId, stops });
            });
        },
        error: function(error) {
            console.error("Ошибка загрузки структуры маршрутов:", error);
        }
    });
}

function displayRoutes(routes, page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedRoutes = routes.slice(start, end);

    let html = '<table class="table table-striped"><thead><tr><th>Номер</th><th>Направление</th><th>Действия</th></tr></thead><tbody>';
    paginatedRoutes.forEach(route => {
        html += `<tr>
            <td>${route.number}</td>
            <td>${route.direction}</td>
            <td><button class="btn btn-sm btn-primary" onclick="getRouteForecast('${route.krId}')">Прогноз</button></td>
        </tr>`;
    });
    html += "</tbody></table>";
    $("#routeList").html(html);

    updatePagination(routes.length, page, '#routePagination', displayRoutes, routes);
}

$("#searchRoutes").click(function() {
    const query = $("#routeSearch").val().toLowerCase();
    const filteredRoutes = routesData.filter(route => route.number.toLowerCase().includes(query));
    displayRoutes(filteredRoutes, 1);
});

function getRouteForecast(krId) {
    const route = routeStopsData.find(r => r.krId === krId);
    if (!route || !route.stops.length) {
        $("#routeForecast").html("<p>Данные о маршруте недоступны</p>");
        return;
    }

    let html = `<h5>Прогноз для маршрута ${routesData.find(r => r.krId === krId)?.number}</h5>`;
    html += '<table class="table table-striped route-forecast"><thead><tr><th>Остановка</th><th>Время (мин)</th></tr></thead><tbody>';

    const stopsToCheck = route.stops.slice(0, 5);
    let completedRequests = 0;

    stopsToCheck.forEach(stop => {
        const authKey = generateAuthKey(krId + stop.ksId);
        const url = `https://tosamara.ru/api/v2/json?method=getRouteArrivalToStop&KR_ID=${krId}&KS_ID=${stop.ksId}&os=web&clientId=${clientId}&authKey=${authKey}`;

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function(data) {
                const time = data.arrivalTime ? data.arrivalTime : "Нет данных";
                html += `<tr><td>${stop.title}</td><td>${time}</td></tr>`;
                completedRequests++;
                if (completedRequests === stopsToCheck.length) {
                    html += "</tbody></table>";
                    $("#routeForecast").html(html);
                }
            },
            error: function() {
                html += `<tr><td>${stop.title}</td><td>Время неизвестно</td></tr>`;
                completedRequests++;
                if (completedRequests === stopsToCheck.length) {
                    html += "</tbody></table>";
                    $("#routeForecast").html(html);
                }
            }
        });
    });
}

function updatePagination(totalItems, currentPage, paginationId, callback, data) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let html = '';
    if (totalPages > 1) {
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="updatePage(${currentPage - 1}, '${paginationId}', '${callback.name}', this); return false;">«</a>
        </li>`;
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        for (let i = startPage; i <= endPage; i++) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="updatePage(${i}, '${paginationId}', '${callback.name}', this); return false;">${i}</a>
            </li>`;
        }
        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="updatePage(${currentPage + 1}, '${paginationId}', '${callback.name}', this); return false;">»</a>
        </li>`;
    }
    $(paginationId).html(html);
}

function updatePage(page, paginationId, callbackName, element) {
    if ($(element).parent().hasClass('disabled')) return;
    if (callbackName === 'displayStops') {
        displayStops(stopsData, page);
    } else if (callbackName === 'displayRoutes') {
        displayRoutes(routesData, page);
    }
}

function toggleFavorite(ksId, title) {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const index = favorites.findIndex(f => f.ksId === ksId);
    if (index === -1) {
        favorites.push({ ksId, title });
        showNotification(`Остановка "${title}" добавлена в избранное`, 'success');
    } else {
        favorites.splice(index, 1);
        showNotification(`Остановка "${title}" удалена из избранного`, 'danger');
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
    displayStops(stopsData, 1);
}

function isInFavorites(ksId) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.some(f => f.ksId === ksId);
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let html = '<table class="table table-striped"><thead><tr><th>Название</th><th>Действия</th></tr></thead><tbody>';
    favorites.forEach(fav => {
        html += `<tr>
            <td>${fav.title}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="getStopForecast('${fav.ksId}')">Прогноз</button>
                <span class="favorite-btn remove" onclick="toggleFavorite('${fav.ksId}', '${fav.title}')">✖</span>
            </td>
        </tr>`;
    });
    html += "</tbody></table>";
    $("#favoriteList").html(html);
}