window.onscroll = function() {
    if (window.scrollY < 265) {
        $("#go-up").css({
            "display": "none"
        });
    }
    else {
        $("#go-up").css({
            "display": "block"
        });
    }
}

function updateUrl() {
    var searchText = document.getElementById("search-text").value;

    if (searchText != "") {
        ga('send', 'event', 'Основные метрики', 'Поиск', searchText);
    }

    if (window.history.replaceState !== undefined) {
        window.history.replaceState(searchText, (searchText != "" ? "#КПІгугл: " + searchText : "#КПІгугл"), (searchText != "" ? window.location.pathname + "?search=" + searchText : window.location.pathname));
    }
}

function closeInfo() {
    var subHeader = "<h4><span class='about' onclick=\"showInfo()\">Сайт</span> створено для пошуку волонтерів, готових розповісти " +
        "<a onclick=\"ga('send', 'event', 'Основные метрики', 'Заголовок', 'Нажатие на абитуриента');\"" +
        "href=\"https://vk.com/hochu_v_kpi\" target=\"_blank\">абітурієнту</a> усе про навчання в університеті</h4>";

    $("#about").html(subHeader);
    localStorage.setItem("info", "closed");
}

function showInfo() {
    $.get("about.html", function(data) {
        $("#about").html(data);
        localStorage.removeItem("info");
    });
}

window.onload = function() {
    if (localStorage.getItem("info") == "closed") {
        closeInfo();
    }
    else {
        showInfo();
    }
}

function getParam(key) {

    var qs = document.location.search.split("+").join(" ");

    var params = {};
    var tokens;
    var re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params[key] == undefined ? "" : params[key];
}


var facsInfo;
var people;

$.getJSON("data/facs.json", function(data) {
    facsInfo = data;
    $.getJSON("data/people.json", function(data) {
        people = data;
        var key = getParam("search");
        $("#search-text").val(key);
        search(key);
    });
});

var dict = {
    "IFF": {
        "short-name-ua": "ІФФ",
        "full-name-ua": "Інженерно-Фізичний Факультет",
        "short-name-ru": "ИФФ",
        "full-name-ru": "Инженерно-Физический Факультет"
    },
    "MMI": {
        "short-name-ua": "ММІ",
        "full-name-ua": "Механіко-Машинобудівний Інститут",
        "short-name-ru": "ММИ",
        "full-name-ru": "Механико-Машиностроительный институт"
    },
    "IHF": {
        "short-name-ua": "ІХФ",
        "full-name-ua": "Інженерно-Хімічний Факультет",
        "short-name-ru": "ИХФ",
        "full-name-ru": "Инженерно-Xимический факультет"
    },
    "HTF": {
        "short-name-ua": "ХТФ",
        "full-name-ua": "Хіміко-Технологічний Факультет",
        "short-name-ru": "ХТФ",
        "full-name-ru": "Химико-Технологический Факультет"
    },
    "FBT": {
        "short-name-ua": "ФБТ",
        "full-name-ua": "Факультет Біотехнології Та Біотехніки",
        "short-name-ru": "ФБТ",
        "full-name-ru": "Факультет Биотехнологии и Биотехники"
    },
    "TEF": {
        "short-name-ua": "ТЕФ",
        "full-name-ua": "Теплоенергетичний Факультет",
        "short-name-ru": "ТЭФ",
        "full-name-ru": "Теплоэнергетический факультет"
    },
    "FEA": {
        "short-name-ua": "ФЕА",
        "full-name-ua": "Факультет Електроенерготехніки Та Автоматики",
        "short-name-ru": "ФЭА",
        "full-name-ru": "Факультет Электроэнерготехники и Автоматики"
    },
    "IEE": {
        "short-name-ua": "ІЕЕ",
        "full-name-ua": "Інститут Енергозбереження Та Енергоменеджменту",
        "short-name-ru": "ИЕЕ",
        "full-name-ru": "Институт Енергосбережения и Енергоменеджмента"
    },
    "FPM": {
        "short-name-ua": "ФПМ",
        "full-name-ua": "Факультет Прикладної Математики",
        "short-name-ru": "ФПМ",
        "full-name-ru": "Факультет Прикладной Математики"
    },
    "IPSA": {
        "short-name-ua": "ІПСА",
        "full-name-ua": "Інститут Прикладного Системного Аналізу",
        "short-name-ru": "ИПСА",
        "full-name-ru": "Институт Прикладного Системного Анализа"
    },
    "FIOT": {
        "short-name-ua": "ФІОТ",
        "full-name-ua": "Факультет Інформатики Та Обчислюваної Техніки",
        "short-name-ru": "ФИВТ",
        "full-name-ru": "Факультет Информатики и Вычислительной Техники"
    },
    "FBMI": {
        "short-name-ua": "ФБМІ",
        "full-name-ua": "Факультет Біомедичної Інженерії",
        "short-name-ru": "ФБМИ",
        "full-name-ru": "Факультет Биомедицинской Инженерии"
    },
    "RTF": {
        "short-name-ua": "РТФ",
        "full-name-ua": "Радіотехнічний Факультет",
        "short-name-ru": "РТФ",
        "full-name-ru": "Радиотехнический Факультет"
    },
    "ZF": {
        "short-name-ua": "ЗФ",
        "full-name-ua": "Зварювальний Факультет",
        "short-name-ru": "СФ",
        "full-name-ru": "Сварочный Факультет"
    },
    "FAKS": {
        "short-name-ua": "ФАКС",
        "full-name-ua": "Факультет Авіаційних І Космічних Систем",
        "short-name-ru": "ФАКС",
        "full-name-ru": "Факультет Авиационных и Космических Систем"
    },
    "ITS": {
        "short-name-ua": "ІТС",
        "full-name-ua": "Інститут Телекомунікаційних Систем",
        "short-name-ru": "ИТС",
        "full-name-ru": "Институт Телекоммуникационных Систем"
    },
    "FEL": {
        "short-name-ua": "ФЕЛ",
        "full-name-ua": "Факультет Електроніки",
        "short-name-ru": "ФЭЛ",
        "full-name-ru": "Факультет Электроники"
    },
    "VPI": {
        "short-name-ua": "ВПІ",
        "full-name-ua": "Видавничо-Поліграфічний Інститут",
        "short-name-ru": "ИПИ",
        "full-name-ru": "Издательско-Полиграфический Институт"
    },
    "FMM": {
        "short-name-ua": "ФММ",
        "full-name-ua": "Факультет Менеджменту Та Маркетингу",
        "short-name-ru": "ФММ",
        "full-name-ru": "Факультет Менеджмента и Маркетинга"
    },
    "PBF": {
        "short-name-ua": "ПБФ",
        "full-name-ua": "Приладобудівний Факультет",
        "short-name-ru": "ПСФ",
        "full-name-ru": "Приборостроительный Факультет"
    },
    "FTI": {
        "short-name-ua": "ФТІ",
        "full-name-ua": "Фізико-Технічний Інститут",
        "short-name-ru": "ФТИ",
        "full-name-ru": "Физико-Технический Институт"
    },
    "FL": {
        "short-name-ua": "ФЛ",
        "full-name-ua": "Факультет Лінгвістики",
        "short-name-ru": "ФЛ",
        "full-name-ru": "Факультет Лингвистики"
    },
    "FMF": {
        "short-name-ua": "ФМФ",
        "full-name-ua": "Фізико-Математичний Факультет",
        "short-name-ru": "ФМФ",
        "full-name-ru": "Физико-Математический Факультет"
    },
    "FSP": {
        "short-name-ua": "ФСП",
        "full-name-ua": "Факультет Соціології І Права",
        "short-name-ru": "ФСП",
        "full-name-ru": "Факультет Социологии и Права"
    }
};

function getRawFaculty(id) {
    return dict[id]["short-name-ua"] + " " +
        dict[id]["full-name-ua"] + " " +
        dict[id]["short-name-ru"] + " " +
        dict[id]["full-name-ru"];
}

function getShortName(id) {
    return dict[id]["short-name-ua"];
}

function getWay(code, defVal) {
    for (var i = 0; i < facsInfo.length; i++) {
        for (var j = 0; j < facsInfo[i].ways.length; j++) {
            if (facsInfo[i].ways[j].code === code) {
                return facsInfo[i].ways[j].name;
            }
        }
    }
    
    return defVal;
}

function display(searchResult) {

    if (searchResult.length == 0) {
        var sadMsg = "<h4>Жодного результату =(</h4>" +
            "</br><p>Можливо пошук повидить себе не так як ти очікуєш. Для того щоб побачити довідку напиши слово \"гайд\" у поле запиту і натисни кнопку пошуку.</p>" +
            "<p>Бажаю успіхів ;)</p>";
        $(".mainTable").html(sadMsg);
        return;
    }

    var out = "<table class=\"table table-hover\">" +
        "<thead>" +
        "<tr>" +
        "<th id=\"col-num\" onclick=\"sortBy(this,'num');\">#<span class=\"glyphicon glyphicon-sort\"></span></th>" +
        "<th id=\"col-way\" onclick=\"sortBy(this,'way');\">Спеціальність<span class=\"glyphicon glyphicon-sort\"></span></th>" +
        "<th id=\"col-faculty\" onclick=\"sortBy(this,'faculty');\">Факультет<span class=\"glyphicon glyphicon-sort\"></span></th>" +
        "<th id=\"col-name\" onclick=\"sortBy(this,'name');\">Ім'я<span class=\"glyphicon glyphicon-sort\"></span></th>" +
        "<th id=\"col-course\" onclick=\"sortBy(this,'course');\">Курс<span class=\"glyphicon glyphicon-sort\"></span></th>" +
        "<th id=\"col-hostel\" onclick=\"sortBy(this,'hostel');\">Гуртожиток<span class=\"glyphicon glyphicon-sort\"></span></th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    searchResult.forEach(function(item) {
        out += "<tr onclick=\"showMore(this)\">" +
            "<td class=\"num\">" + ($.inArray(item, people) + 1) + "</td>" +
            "<td class=\"way\">" + "<span class='label way-code'>" + item.code + "</span>" + getWay(item.code, item.way) + "</td>" +
            "<td class=\"faculty\">" + getShortName(item.faculty) + "<span class='glyphicon glyphicon-info-sign'></span></td>" +
            "<td class=\"name\"><a href=\"http://" + item.page + "\" target=\"_blank\">" + item.name + "</a></td>" +
            "<td class=\"course\">" + (item.noob ? "Молодший курс" : "Старший курс") + "</td>" +
            "<td class=\"hostel\">" + (item.hostel == false ? "<span class='glyphicon glyphicon-unchecked'></span>" : "<span class='glyphicon glyphicon-check'></span>") + "</td>" +
            "</tr>";
    });

    out += "</tbody></table>";

    $(".mainTable").html(out);
    $(".mainTable").find("a").click(function(e) {
        e.stopPropagation();
        var num = $(this).parent().parent().find(".num").text();
        var name = $(this).text();
        var link = $(this).attr("href").substring(7);
        ga('send', 'event', 'Основные метрики', 'Переход на страницу', num + " " + name + " " + link);
    });
}

var specialKeys = ["гайд", "про бали зно", "авторы", "хелоу"];

function displaySpecial(key) {

    var map = {
        "гайд": "help.html",
        "про бали зно": "zno.html",
        "авторы": "authors.html",
        "хелоу": "about.html"
    };


    ga('send', 'event', 'Основные метрики', 'Гайд', 'Открыли помощь');


    $.get(map[key], function(data) {
        $(".mainTable").html(data);
    });
}

var timeout;

function delayedSearch(time) {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        search(document.getElementById("search-text").value);
    }, time);
}

var result;

function search(text) {

    updateUrl();

    if (text.length == 0) {
        display(people);
    }

    if ($.inArray(text.toLowerCase(), specialKeys) != -1) {
        displaySpecial(text.toLowerCase());
        return;
    }

    result = [];

    text = text.replace(/[’ʼ`′‘]/g, "'").toLowerCase().split(",");

    mainLoop:
        for (var i in people) {

            var person = people[i];

            var personRaw = person.name + " ";

            personRaw += getRawFaculty(person.faculty) + " ";
            personRaw += person.department + " ";
            personRaw += person.way + " ";
            personRaw += person.code + " ";
            personRaw += (person.noob ? "нубасик нубасики" : "дед старожил шарит тему");
            personRaw += (person.hostel === false ? "Київ киевский Киев" : "гуртожиток общага общежитие");

            personRaw = personRaw.toLowerCase();

            innerLoop:
                for (var k = 0; k < text.length; k++) {
                    var keys = text[k].trim().split(/[\s\t]+/);

                    for (var j = 0; j < keys.length; j++) {
                        var word = keys[j].toLowerCase();

                        if (personRaw.indexOf(word) == -1) {
                            continue innerLoop;
                        }
                    }

                    if ($.inArray(person, result) == -1) {
                        result.push(person);
                        continue mainLoop;
                    }
                }
        }

    display(result);
}

function showMore(row) {

    $(row).toggleClass("clicked");
    if ($(row).next().hasClass("moreInfo")) {
        $(row).next().remove();
        return;
    }

    var faculty = $(row).find(".faculty").text();

    ga('send', 'event', 'Основные метрики', 'Доп. информация про факультет', faculty);

    for (var i in facsInfo) {
        if (facsInfo[i]["short-name"] == faculty) {
            faculty = facsInfo[i];
            break;
        }
    }

    var info = "<tr class=\"moreInfo\">" +
        "<td colspan=\"7\">" +
        "<div class=\"row\">" +
        "<div class=\"col-xs-6 faculty\">" +
        "<h1>" + faculty["short-name"] + "</h1>" +
        "<h4>" + faculty["full-name"] + "</h4>" +
        "</div>" +
        "<div class=\"col-xs-6 departments\">" +
        "<div class=\"row block-title\">" +
        "<b>Кафедри</b>" +
        "</div>";

    faculty.departments.forEach(function(item) {
        info += "<p><b>" + item["short-name"] + "</b> " + item["full-name"] + "</p>";
    });

    info += "</div></div><div class=\"row block-title\"><b>Напрями</b><a href='?search=про бали зно' class='why-scores'>Чому бали у відсотках?</a></div>";

    for (var i = 0; i < faculty.ways.length; i += 3) {

        info += "<div class=\"row ways\">";

        for (var j = 0; j < 3 && i + j < faculty.ways.length; j++) {

            var item = faculty.ways[i + j];

            info += "<div class=\"col-xs-4 way\">" +
                "<div class=\"row text-center detail-name\"><b>" + item["code"] + "</b> " + item["name"] + "</div>" +
                "<div class=\"row scores\">" +
                "<span class=\"progress-label-r\">" + item["score-15"] + "</span>" +
                "<span class=\"progress-label-l\">2015</span>" +
                "<div class=\"progress progress-striped\">" +
                "<div class=\"progress-bar\" style=\"width: " + item["score-15"] + "\"></div>" +
                "</div>" +
                "<span class=\"progress-label-r\">" + item["score-14"] + "</span>" +
                "<span class=\"progress-label-l\">2014</span>" +
                "<div class=\"progress progress-striped\">" +
                "<div class=\"progress-bar progress-bar-success\" style=\"width: " + item["score-14"] + "\"></div>" +
                "</div>" +
                "<span class=\"progress-label-r\">" + item["score-13"] + "</span>" +
                "<span class=\"progress-label-l\">2013</span>" +
                "<div class=\"progress progress-striped\">" +
                "<div class=\"progress-bar progress-bar-warning\" style=\"width: " + item["score-13"] + "\"></div>" +
                "</div>" +
                "</div>" +
                "</div>";
        }

        info += "</div>";
    }

    info += "</td></tr>";

    $(row).after(info);
}

function ukrCompare(a, b) {
    var alphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ";

    a = a.toUpperCase();
    b = b.toUpperCase();

    var len = Math.max(a.length, b.length);

    for (var i = 0; i < len; i++) {

        // a = ukr , b = non-urk --> a > b
        if (alphabet.indexOf(a[i]) == -1 && alphabet.indexOf(b[i]) != -1) {
            return -1;
        }

        // b = ukr , a = non-urk --> a < b
        if (alphabet.indexOf(a[i]) != -1 && alphabet.indexOf(b[i]) == -1) {
            return 1;
        }

        // a = non-urk , b = non-urk --> default compare
        if (alphabet.indexOf(a[i]) == -1 && alphabet.indexOf(b[i]) == -1) {
            if (a[i] > b[i]) {
                return 1;
            }

            if (a[i] < b[i]) {
                return -1;
            }
            continue;
        }

        // a = urk , b = urk --> ukr compare
        if (alphabet.indexOf(a[i]) > alphabet.indexOf(b[i])) {
            return 1;
        }

        if (alphabet.indexOf(a[i]) < alphabet.indexOf(b[i])) {
            return -1;
        }
    }

    return 0;
}

function sortBy(col, field) {

    var id = $(col).attr("id");

    if (field == "num") {
        if ($(".sorted").length == 0) {
            col = $(".mainTable").find("#" + id).addClass("sorted");
        }
    }

    if ($(col).hasClass("sorted")) {

        var byWhat = {
            "num": "По номеру",
            "name": "По имени",
            "faculty": "По факультету",
            "department": "По кафедре",
            "way": "По направлению",
            "course": "По курсу",
            "hostel": "По общежитию"
        };


        ga('send', 'event', 'Основные метрики', 'Сортировка', byWhat[field]);
        result.reverse();
        display(result);
        col = $(".mainTable").find("#" + id).addClass("sorted");
    }
    else {

        var sortFunc;

        switch (field) {
            case 'name':

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По имени');

                sortFunc = function(a, b) {
                    return ukrCompare(a["name"], b["name"]);
                };
                break;

            case 'faculty':

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По факультету');

                sortFunc = function(a, b) {
                    return ukrCompare(a["faculty"], b["faculty"]);
                };
                break;

            case 'department':

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По кафедре');

                sortFunc = function(a, b) {
                    return ukrCompare(a["department"], b["department"]);
                };
                break;

            case 'way':

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По направлению');

                sortFunc = function(a, b) {
                    return ukrCompare(a["way"], b["way"]);
                };
                break;

            case 'course':

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По курсу');

                sortFunc = function(a, b) {

                    var getNum = function(a) {
                        switch (a) {
                            case "Молодший курс":
                                return 0;
                            case "Старший курс":
                                return 1;
                            default:
                                return 2;
                        }
                    }

                    var a = getNum(a.course);
                    var b = getNum(b.course);

                    return a - b;
                };
                break;

            case 'hostel':

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По общежитию');

                sortFunc = function(a, b) {

                    var a = a.hostel == false ? "1" : "0";
                    var b = b.hostel == false ? "1" : "0";

                    return a - b;
                };
                break;

            default:

                ga('send', 'event', 'Основные метрики', 'Сортировка', 'По номеру');

                sortFunc = function(a, b) {
                    return $.inArray(a, people) - $.inArray(b, people);
                };
        }


        result.sort(sortFunc);
        display(result);
        col = $(".mainTable").find("#" + id).addClass("sorted");
    }

}