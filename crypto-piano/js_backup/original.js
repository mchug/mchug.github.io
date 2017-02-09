// Если ты это читаешь, то наверняка думаешь что великий хакер, да?)
var btnEncrypt = document.getElementById("btn-mode-encrypt");
var btnDecrypt = document.getElementById("btn-mode-decrypt");
var btnDoit = document.getElementById("btn-doit");
var btnClear = document.getElementById("btn-clear-key");

var formInput = document.getElementById("input");
var formOutput = document.getElementById("output");
var formKey = document.getElementById("key");

// Ну и посмотрим как оно тебе поможет)
var params = {
    "iv": "QQ09nGcUUxSVk0mgNkbzmA",
    "v": 1,
    "iter": 1000,
    "ks": 128,
    "ts": 64,
    "mode": "ccm",
    "adata": "",
    "cipher": "aes",
    "salt": "4Z5sJha5Q2Y"
};


var currentMode = null;

function encryptionMode() {
    var key = formKey.value;
    var input = formInput.value;
    var output = sjcl.encrypt(key, input, params);
    formOutput.value = JSON.parse(output).ct;
}

function decryptionMode() {
    var key = formKey.value;
    var input = formInput.value;
    var inputJson = {
        iv: params.iv,
        v: params.v,
        iter: params.iter,
        ks: params.ks,
        ts: params.ts,
        mode: params.mode,
        adata: params.adata,
        cipher: params.cipher,
        salt: params.salt,
        ct: input
    };
    try {
        var output = sjcl.decrypt(key, JSON.stringify(inputJson));
        formOutput.value = output;
    }
    catch (ex) {
        if (!/^[=(<;:]+$/.test(formOutput.value)) {
            formOutput.value = "";
        }
        var sadfaces = ["=(", "=<", ";(", ";<", ":(", ":<"];
        formOutput.value += sadfaces[Math.floor(Math.random() * sadfaces.length)];
    }

}

function doit() {
    currentMode();
}

function clearKey() {
    formKey.value = "";
}

function recordKey(note, octave) {
    formKey.value += note + octave;
    doit();
}

btnEncrypt.onclick = function() {
    btnEncrypt.className = "btn btn-xs btn-success";
    btnDecrypt.className = "btn btn-xs btn-default";
    currentMode = encryptionMode;
};

btnDecrypt.onclick = function() {
    btnEncrypt.className = "btn btn-xs btn-default";
    btnDecrypt.className = "btn btn-xs btn-success";
    currentMode = decryptionMode;
};

btnDoit.onclick = doit;
btnClear.onclick = clearKey;

btnEncrypt.click();

document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        clearKey();
    }
}

var a = new AudioSynthView();
a.draw();
a.addListener(recordKey);
