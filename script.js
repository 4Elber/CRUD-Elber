var firebaseConfig = {
    apiKey: "AIzaSyAdRvyeKc9PJAPWTITwa7-as3JWvcwVKRA",
    authDomain: "project-3dc9c.firebaseapp.com",
    databaseURL: "https://project-3dc9c-default-rtdb.firebaseio.com",
    projectId: "project-3dc9c",
    storageBucket: "project-3dc9c.appspot.com",
    messagingSenderId: "275720009048",
    appId: "1:275720009048:web:9469d893d4c2f5ce07212d"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    var nome = document.getElementById('nome').value;
    var funcao = document.getElementById('funcao').value;
    var salario = document.getElementById('salario').value;
    var newRegistroKey = firebase.database().ref().child('registros').push().key;
    var updates = {};
    updates['/registros/' + newRegistroKey] = { nome: nome, funcao: funcao, salario: salario };
    firebase.database().ref().update(updates);
    document.getElementById('nome').value = '';
    document.getElementById('funcao').value = '';
    document.getElementById('salario').value = '';
    renderRegistros();
});

function renderRegistros() {
    var registrosRef = firebase.database().ref('registros/');
    registrosRef.on('value', function(snapshot) {
        var registros = snapshot.val();
        var registrosDiv = document.getElementById('registros');
        registrosDiv.innerHTML = '';
        Object.keys(registros).forEach(function(key) {
            var registro = registros[key];
            var registroDiv = document.createElement('div');
            registroDiv.innerHTML = `
                <h2>${registro.nome}</h2>
                <p>${registro.funcao}</p>
                <p>${registro.salario}</p>
                <button onclick="editRegistro('${key}')">Editar</button>
                <button onclick="deleteRegistro('${key}')">Excluir</button>
            `;
            registrosDiv.appendChild(registroDiv);
        });
    });
}

function editRegistro(key) {
    var registroRef = firebase.database().ref('registros/' + key);
    registroRef.once('value', function(snapshot) {
        var registro = snapshot.val();
        document.getElementById('nome').value = registro.nome;
        document.getElementById('funcao').value = registro.funcao;
        document.getElementById('salario').value = registro.salario;
        document.getElementById('form').onsubmit = function(e) {
            e.preventDefault();
            registro.nome = document.getElementById('nome').value;
            registro.funcao = document.getElementById('funcao').value;
            registro.salario = document.getElementById('salario').value;
            var updates = {};
            updates['/registros/' + key] = registro;
            firebase.database().ref().update(updates);
            document.getElementById('form').onsubmit = submitForm;
        }
    });
}

function deleteRegistro(key) {
    var registroRef = firebase.database().ref('registros/' + key);
    registroRef.remove();
}

function submitForm(e) {
    e.preventDefault();
    var nome = document.getElementById('nome').value;
    var funcao = document.getElementById('funcao').value;
    var salario = document.getElementById('salario').value;
    var newRegistroKey = firebase.database().ref().child('registros').push().key;
    var updates = {};
    updates['/registros/' + newRegistroKey] = { nome: nome, funcao: funcao, salario: salario };
    firebase.database().ref().update(updates);
    document.getElementById('nome').value = '';
    document.getElementById('funcao').value = '';
    document.getElementById('salario').value = '';
    renderRegistros();
}

window.addEventListener('hashchange', function() {
    var pageId = window.location.hash.split('#')[1];
    navigate(pageId);
});


function navigate(pageId) {
    var pages = document.getElementsByClassName('page-content');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(pageId).style.display = 'block';
}

navigate('home');
