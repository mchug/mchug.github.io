var trans = trans || {};
(function(t) {

    t.loadStore = function() {

        var load = function(key) {

            var defaults = {
                "input": "PROGRAM LAB1;\n" +
                    "CONST A=5;\n" +
                    "      B=7;\n" +
                    "\n" +
                    "(* test ---\n" +
                    "     --- test2 *)\n" +
                    "\n" +
                    "BEGIN\n" +
                    "    CASE 2 + B OF\n" +
                    "        B - 5 : / CASE A - B OF ENDCASE; \\\n" +
                    "    ENDCASE;\n" +
                    "END.",
                "syntax-rules": "1. <signal-program> --> <program>\n" +
                    "2. <program> --> PROGRAM <procedure-identifier> ; <block>.\n" +
                    "3. <block> --> <declarations> BEGIN <statements-list> END\n" +
                    "4. <declarations> --> <constant-declarations>\n" +
                    "5. <constant-declarations> --> CONST <constant-declarations-list> | <empty>\n" +
                    "6. <constant-declarations-list> --> <constant-declaration> <constant-declarations-list> | <empty>\n" +
                    "7. <constant-declaration> --> <constant-identifier>=<constant>;\n" +
                    "8. <statements-list> --> <statement> <statements-list> | <empty>\n" +
                    "9. <statement> --> CASE <expression> OF <alternatives-list> ENDCASE ;\n" +
                    "10. <alternatives-list> --> <alternative> <alternatives-list> | <empty>\n" +
                    "11. <alternative> --> <expression> : / <statements-list> \\\n" +
                    "12. <expression> --> <summand> <summands-list> | - <summand> <summands-list>\n" +
                    "13. <summands-list> --> <add-instruction> <summand> <summands-list> | <empty>\n" +
                    "14. <add-instruction> --> + | -\n" +
                    "15. <summand> --> <variable-identifier> | <unsigned-integer>\n" +
                    "16. <constant-identifier> --> <identifier>\n" +
                    "17. <variable-identifier> --> <identifier>\n" +
                    "18. <procedure-identifier> --> <identifier>\n" +
                    "19. <identifier> --> <letter><string>\n" +
                    "20. <string> --> <letter><string> | <digit><string> | <empty>\n" +
                    "21. <constant> --> <unsigned-integer>\n" +
                    "22. <unsigned-integer> --> <digit><digits-string>\n" +
                    "23. <digits-string> --> <digit><digits-string> | <empty>\n" +
                    "24. <digit> --> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9\n" +
                    "25. <letter> --> A | B | C | ... | Z",
                "trans-rules": "\n;---CONST\n<% array(\"constant-declaration\").forEach(function (item) {\n    if ($(item).text() != \"\") {\n         println(\";---\"+$(item).find(\"constant-identifier\").text()+\" = \"+$(item).find(\"constant\").text()+\";\");\n         println($(item).find(\"constant-identifier\").text()+\"    EQU    \"+$(item).find(\"constant\").text());\n     }\n}); %>\n\n;---PROGRAM <% text(\"procedure-identifier\") %>;\norg 100h\n<% text(\"procedure-identifier\") %>:\n;---BEGIN\n<% var counter = 0; %>\n<% var statments = array(\"statement\").filter(function(item) { if($(item).text() != \"\") return item; }); %>\n<% statments.forEach(function(item,i) {\n    if ($(item).text() != \"\") {\n        if (i != 0) print(\"case\"+ (counter-1) +\": \");\n        println(\"mov ax, \"+$(item).find(\"expression:first\").text());\n        var alts = $(item).find(\"alternative\")\n        .toArray().filter(function(item) { if($(item).text() != \"\") return item; });\n        alts.forEach(function(alt){\n                      if (counter < statments.length - 1) {\n                          println(\"cmp ax, \"+$(alt).find(\"expression:first\").text());\n                          println(\"je case\"+counter++);\n                      }\n        });\n        if (i < statments.length -1) {\n        println(\"jmp endCase\"+counter);\n        }\n        if (i != 0) println(\"endCase\"+ counter+\": \");\n        println();\n    }     \n}); %>\n;---END.\nmov ax,4C00h\nint 21h",
                "keywords": "400 PROGRAM BEGIN END CONST CASE OF ENDCASE",
                "identifiers": "1000",
                "delimiters": "0 + - . / \\ : ; =",
                "consts": "500",
                "primitives": "<identifier>=Identifiers <unsigned-integer>=Consts",
                "whitespaces": "\\s \\t \\n",
                "comments": "TODO: implement this... open=(*<or>/* close=*)<or>*/ line=//",
                "unique": "<constant-identifier> <procedure-identifier>",
                "exists": "<variable-identifier>"
            };

            var data = window.localStorage.getItem(key);

            if (data == null) {
                data = defaults[key];
                window.localStorage.setItem(key, data);
            }

            return data;
        };

        $(".persist").toArray().forEach(function(item) {
            $(item).val(load(item.id));
        });
    };

    $(document).ready(function() {
        t.loadStore();

        $("#saveToFile").on("click", function() {
            var text = $("#out").text();
            var filename = "translator.txt";
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);
            pom.style.display = 'none';
            document.body.appendChild(pom);
            pom.click();
            document.body.removeChild(pom);
        });

        var saver = function() {
            window.localStorage.setItem(this.id, $(this).val());
        };

        $(".persist").on("input", saver);
        
        $("#btn-toggle-settings").on("click", function() {
            $(".settings").toggle();
        });
    });

    t.console = {
        "out": $("#out")
    };

    t.console.clear = function() {
        t.console.out.text("");
    };

    t.console.makePretty = function(obj) {
        if (typeof(obj) == "object") {
            obj = JSON.stringify(obj);
        }
        else if (typeof(obj) == "undefined") {
            obj = "";
        }

        return obj;
    };

    t.console.print = function(text) {
        text = t.console.makePretty(text);
        t.console.out.append($('<div>').text(text).html()).scrollTop(t.console.out.prop("scrollHeight"));
    };

    t.console.println = function(text) {
        text = t.console.makePretty(text);
        t.console.print(text + "\n");
    };

    t.console.error = function(text) {
        text = t.console.makePretty(text);
        t.console.out.append("<span class='text-danger'>" + $('<div>').text(text).html() + "</span>").scrollTop(t.console.out.prop("scrollHeight"));
        t.console.println();
    };

    t.sys_keyWords = {
        "startIndex": 0,
        "data": []
    };

    t.sys_delimiters = {
        "startIndex": 0,
        "data": []
    };

    t.sys_identifiers = {
        "startIndex": 0,
        "data": []
    };

    t.sys_consts = {
        "startIndex": 0,
        "data": []
    };

    t.sys_whitespaces = {
        "data": [" ", "\t", "\n"]
    };

    t.sys_comments = {};

    t.sys_primitives = {};

    t.sys_tables = {
        "Consts": t.sys_consts,
        "Identifiers": t.sys_identifiers,
        "Keywords": t.sys_keyWords,
        "Delimiters": t.sys_delimiters,
        "Primitives": t.sys_primitives,
        "Whitespaces": t.sys_whitespaces,
        "Comments": t.sys_comments
    };


    t.sys_getIndex = function(table, obj) {
        if (table.data.indexOf(obj) == -1) {
            return -1;
        }
        return (table.startIndex + table.data.indexOf(obj));
    };

    t.sys_exists = function(table, obj) {
        return table.data.indexOf(obj) != -1;
    };

    t.sys_toToken = function(str) {
        if (t.sys_exists(t.sys_delimiters, str)) {
            return t.sys_getIndex(t.sys_delimiters, str);
        }

        if (t.sys_exists(t.sys_keyWords, str)) {
            return t.sys_getIndex(t.sys_keyWords, str);
        }

        return -1;
    };

    t.sys_fromToken = function(token) {
        if (t.sys_consts.data[token - t.sys_consts.startIndex] != undefined) {
            return t.sys_consts.data[token - t.sys_consts.startIndex];
        }

        if (t.sys_delimiters.data[token - t.sys_delimiters.startIndex] != undefined) {
            return t.sys_delimiters.data[token - t.sys_delimiters.startIndex];
        }

        if (t.sys_identifiers.data[token - t.sys_identifiers.startIndex] != undefined) {
            return t.sys_identifiers.data[token - t.sys_identifiers.startIndex];
        }

        if (t.sys_keyWords.data[token - t.sys_keyWords.startIndex] != undefined) {
            return t.sys_keyWords.data[token - t.sys_keyWords.startIndex];
        }

        return null;
    };

    t.sys_isPrimitive = function(name) {
        return t.sys_primitives.hasOwnProperty(name) || t.sys_primitives.hasOwnProperty(t.findRule(name).right);
    }

    t.sys_testPrimitive = function(name, lexeme) {
        var tables = t.sys_primitives[name] || t.sys_primitives[t.findRule(name).right];
        var lexeme = t.sys_fromToken(lexeme);

        for (var i = 0; i < tables.length; i++) {
            if (t.sys_exists(t.sys_tables[tables[i]], lexeme)) {
                return true;
            }
        }

        return false;
    }

    t.initTables = function() {

        var fillTable = function(table) {
            var tmp = $("#" + table.toLowerCase()).val().split(/[\s\t]+/g);
            t.sys_tables[table].startIndex = parseInt(tmp[0]);
            t.sys_tables[table].data = tmp.slice(1);
        };

        fillTable("Consts");
        fillTable("Identifiers");
        fillTable("Keywords");
        fillTable("Delimiters");

        var tmp = $("#primitives").val().split(/\s/g);

        tmp.forEach(function(item) {
            var rule = item.split("=");
            t.sys_primitives[rule[0]] = rule[1].split(",");
        });

        tmp = $("#whitespaces").val().split(/\s/g);

        tmp.forEach(function(item, i, arr) {
            var dict = {
                "\\s": " ",
                "\\t": "\t",
                "\\n": "\n",
                "\\r": "\r",
                "\\v": "\v",
                "\\b": "\b",
                "\\f": "\f",
                "\\0": "\0"
            };
            arr[i] = dict[item];
        });

        t.sys_whitespaces.data = tmp;

        // tmp = $("#comments").val().split(/\s/g);

        // tmp.forEach(function(item, i, arr) {
        //     var rule = item.split("=");
        //     t.sys_comments[rule[0]] = rule[1].split("<or>");
        // });

        t.console.println("========================== INIT TABLES =======================");
        t.console.print("Keywords: ");
        t.console.println(t.sys_keyWords);
        t.console.print("Delimiters: ");
        t.console.println(t.sys_delimiters);
        t.console.print("Identifiers: ");
        t.console.println(t.sys_identifiers);
        t.console.print("Consts: ");
        t.console.println(t.sys_consts);
        t.console.print("Primitives: ");
        t.console.println(t.sys_primitives);
        t.console.print("Whitespaces: ");
        t.console.println(t.sys_whitespaces);
        // t.console.print("Comments: ");
        // t.console.println(t.sys_comments);
        t.console.println();
    };

    t.rules = [];

    t.initRules = function() {

        t.rules = [];

        t.console.println("========================== INIT RULES =======================");

        var str = $("#syntax-rules").val();
        str = str.split(/\n/g);
        var num = 1;
        str.forEach(function(item) {

            t.console.print(item);

            try {
                item = item.split("-->");
                if (item.length == 2) {
                    var left = item[0].replace(/\d+\./, "").trim();
                    var right = item[1].replace(/></g, "> <")
                        .replace(/([^\s])(<)/g, "$1 $2")
                        .replace(/(>)([^\s])/g, "$1 $2")
                        .replace(/\|/g, " | ")
                        .replace(/[\s\t]+/g, " ").trim();

                    right = right.split(/ \| /);

                    if (typeof(right) == "object") {
                        for (var i = 0; i < right.length; i++) {
                            if (right[i] == "...") {
                                for (var j = right[i - 1].charCodeAt(0); j < right[i + 1].charCodeAt(0); j++) {
                                    right.splice(i++, 0, String.fromCharCode(j));
                                }
                                right.splice(i, 1);
                            }
                        }
                    }

                    t.rules.push({
                        "num": num++,
                        "left": left,
                        "right": right
                    });

                    t.console.println(" - OK");
                    t.console.println(t.rules[t.rules.length - 1]);
                }
            }
            catch (ex) {
                t.console.println(" - ERROR");
                t.console.error(ex);
            }
        });
    };

    t.findRule = function(name) {
        for (var i in t.rules) {
            var item = t.rules[i];

            if (item.left == name) {
                return item;
            }
        }
        return null;
    };

    t.testRuleStr = function(name, str) {
        var rule = t.findRule(name);
        if (rule == null) {
            return false;
        }

        if (name == "<letter>" || name == "<digit>") {
            for (var i in rule.right) {
                if (rule.right[i] == str) {
                    return true;
                }
            }
        }

        return false;
    };

    t.isRecursive = function(name) {
        var rule = t.findRule(name);
        if (rule == null) {
            return null;
        }

        if (typeof(rule.right) == "object") {

            for (var i = 0; i < rule.right.length; i++) {
                if (rule.right[i].indexOf(rule.right) != -1) {
                    return true;
                }
            }
            return false;
        }
        else {
            return rule.right.indexOf(rule.left) != -1;
        }
    };

    t.isCanBeEmpty = function(name) {
        var rule = t.findRule(name);
        if (rule == null) {
            return false;
        }

        if (typeof(rule.right) == "object") {

            for (var i = 0; i < rule.right.length; i++) {
                if (rule.right[i].indexOf("<empty>") != -1) {
                    return true;
                }
            }
            return false;
        }
        else {
            return rule.right.indexOf("<empty>") != -1;
        }
    }

    t.console.treePrint = function(text, deepness) {
        while (deepness > 0) {
            t.console.print("   |")
            deepness--;
        }
        t.console.println(text);
    };
    t.console.treePrintXML = function(text) {
        t.syntaxXML += text;
    };

    t.syntaxXML = "";

    t.testRulesTokens = function(name, deepness, caller) {

        //hack to break while(true)
        if (deepness > 100) {
            return false;
        }

        var rule = t.findRule(name);
        if (rule == null) {
            t.console.println("Rule not exist: " + name);
            return null;
        }

        t.console.treePrint(rule.num + "." + rule.left + " caller: " + caller, deepness);
        t.console.treePrintXML(name);

        if (t.sys_isPrimitive(name)) {

            if (t.sys_testPrimitive(name, t.lexResult[0])) {

                t.console.treePrint(t.sys_fromToken(t.lexResult[0]), deepness + 1);

                t.console.treePrintXML(t.sys_fromToken(t.lexResult[0]));
                t.console.treePrintXML("</" + name.substr(1));

                t.lexResult.shift();
                return true;
            }
            t.console.treePrintXML("</" + name.substr(1));
            return false;
        }

        var variants = rule.right;

        outerLoop:
            for (var i = 0; i < variants.length; i++) {

                if (t.errorFlag) {
                    break;
                }

                var variant = variants[i].split(/[\s\t]+/g);

                for (var j = 0; j < variant.length; j++) {
                    var rulePart = variant[j];

                    if (t.errorFlag) {
                        break outerLoop;
                    }

                    if (t.findRule(rulePart) == null) {
                        if (t.sys_toToken(rulePart) == t.lexResult[0]) {
                            t.console.treePrint(t.sys_fromToken(t.lexResult[0]), deepness + 1);

                            t.console.treePrintXML("<atom name=\"" + rulePart + "\">");
                            t.console.treePrintXML(t.sys_fromToken(t.lexResult[0]));
                            t.console.treePrintXML("</atom>");
                            t.lexResult.shift();
                        }
                        else if (rulePart == "<empty>") {

                            t.console.treePrint("<empty>", deepness + 1);
                            t.console.treePrintXML("</" + rule.left.substr(1));
                            return true;
                        }
                        else {
                            if (i == variants.length - 1) {
                                if (!(t.isCanBeEmpty(caller) && j == 0)) {
                                    t.console.error("SYNTAX ERROR: expected " + rulePart + " but find " + t.sys_fromToken(t.lexResult[0]));
                                    t.errorFlag = true;
                                }
                                t.console.treePrintXML("</" + rule.left.substr(1));
                                return false;
                            }
                            else {
                                continue outerLoop;
                            }
                        }
                    }
                    else {
                        if (!t.testRulesTokens(rulePart, deepness + 1, (t.isCanBeEmpty(name) ? name : (t.isCanBeEmpty(caller) ? caller : name)))) {
                            if (i == variants.length - 1) {
                                if (!(t.isCanBeEmpty(caller) && j == 0)) {
                                    t.console.error("SYNTAX ERROR: expected " + name + " but find " + t.sys_fromToken(t.lexResult[0]));
                                    t.errorFlag = true;
                                }
                                t.console.treePrintXML("</" + rule.left.substr(1));
                                return false;
                            }
                            else {
                                continue outerLoop;
                            }
                        }
                    }
                }

                t.console.treePrintXML("</" + rule.left.substr(1));

                return true;
            }

        return false;
    };

    t.lexResult = [];

    t.runLexAnalyzer = function() {

        t.lexResult = [];

        t.console.println("========================== LEXICAL ANALYZE =======================");

        var input = $("#input").val();
        var i = -1;
        var lineNum = 1;
        while (true) {
            i++;

            if (i >= input.length) {
                break;
            }

            //IDENTIFIER
            if (t.testRuleStr("<letter>", input[i])) {
                var buffer = input[i];
                while (true) {
                    i++;
                    if (t.testRuleStr("<letter>", input[i]) || t.testRuleStr("<digit>", input[i])) {
                        buffer += input[i];
                        continue;
                    }

                    if (t.sys_exists(t.sys_keyWords, buffer)) {
                        t.lexResult.push(t.sys_getIndex(t.sys_keyWords, buffer));
                        break;
                    }

                    if (!t.sys_exists(t.sys_identifiers, buffer)) {
                        t.sys_identifiers.data.push(buffer);
                    }

                    t.lexResult.push(t.sys_getIndex(t.sys_identifiers, buffer));
                    break;
                }
            }

            //CONSTS
            if (t.testRuleStr("<digit>", input[i])) {
                var buffer = input[i];
                while (t.testRuleStr("<digit>", input[i + 1])) {
                    buffer += input[i];
                    i++;
                }
                if (!t.sys_exists(t.sys_consts, buffer)) {
                    t.sys_consts.data.push(buffer);
                }
                t.lexResult.push(t.sys_getIndex(t.sys_consts, buffer));
                continue;
            }

            if (t.sys_exists(t.sys_whitespaces, input[i])) {
                if (input[i] == "\n") {
                    lineNum++;
                }
                continue;
            }

            if (input[i] + input[i + 1] == "(*") {

                i += 2;
                while (!(input[i] == "*" && input[i + 1] == ")")) {
                    i++;
                    if (i > input.length) {
                        t.console.error("LEXICAL ERROR: comment not closed " + (input[i] == undefined ? "EOF" : input[i]) + " at line " + lineNum);
                        t.errorFlag = true;
                        break;
                    }
                }
                i++;
                continue;
            }

            if (t.sys_exists(t.sys_delimiters, input[i])) {
                t.lexResult.push(t.sys_getIndex(t.sys_delimiters, input[i]));
                continue;
            }

            t.console.error("LEXICAL ERROR: invalid symbol " + (input[i] == undefined ? "EOF" : input[i]) + " at line " + lineNum);
            t.errorFlag = true;
        }

        t.console.print("Keywords: ");
        t.console.println(t.sys_keyWords);
        t.console.print("Delimiters: ");
        t.console.println(t.sys_delimiters);
        t.console.print("Identifiers: ");
        t.console.println(t.sys_identifiers);
        t.console.print("Consts: ");
        t.console.println(t.sys_consts);

        t.console.println("LexResult: " + t.lexResult);
    };

    t.generateCode = function(input, xml) {

        var println = function(text) {
            t.console.println(text);
        };

        var print = function(text) {
            t.console.print(text);
        };

        var text = function(query) {
            if (query.indexOf("[") != -1) {
                query = query.replace("[", "[name=");
            }

            return $(sourceTree).find(query).text();
        };

        var find = function(query) {
            if (query.indexOf("[") != -1) {
                query = query.replace("[", "[name=");
            }

            return $(sourceTree).find(query);
        };

        var array = function(query) {
            if (query.indexOf("[") != -1) {
                query = query.replace("[", "[name=");
            }

            return $(sourceTree).find(query).toArray();
        };

        var sourceTree = typeof(xml) == "string" ? $.parseXML(xml) : xml;

        var mustBeUniq = $("#unique").val().split(" ");

        mustBeUniq.forEach(function(item) {

        });

        var mustExists = $("#exists").val().split(" ");

        var i = -1;
        while (true) {
            i++;

            if (i >= input.length) {
                break;
            }

            if (input[i] + input[i + 1] == "<%") {

                i += 2;
                var buffer = "";
                while (!(input[i] + input[i + 1] == "%>")) {
                    buffer += input[i];

                    if (i > input.length) {
                        t.console.error("ERROR: scriplet not closed " + (input[i] == undefined ? "EOF" : input[i]) + " at line " + i);
                        break;
                    }
                    i++;
                }
                try {
                    t.console.print(eval(buffer));
                }
                catch (ex) {
                    console.log(ex);
                    t.console.error("Invalid scriplet!");
                    t.console.error(ex.toString());
                }
                i++;
                continue;
            }

            t.console.print(input[i]);
        }
    };

    t.translate = function() {
        t.syntaxXML = "";
        t.errorFlag = false;
        t.console.clear();
        t.initTables();
        t.console.println();
        t.initRules();
        t.console.println();
        t.runLexAnalyzer();
        t.console.println();
        if (!t.errorFlag) {
            t.console.println("=========================== SYNTAX ANALYZE =======================");
            t.testRulesTokens(t.rules[0].left, 0, "trasm.js");
            if (!t.errorFlag) {
                t.console.println("All ok.");
                t.console.println("Syntax XML: " + t.syntaxXML);
                t.console.println("========================== CODE GENERATION =======================");
                t.generateCode($("#trans-rules").val(), t.syntaxXML, true);
            }
            else {
                t.console.println("Can't translate");
            }
        }
    };

})(trans);