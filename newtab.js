//Booléen pour le choix du type de l'heure
let bool = "fr";

//Load de l'image sur l'ordinateur et mise en background
let inputImage = document.getElementById("inputImage");
document.getElementById("uploadImage").onclick = function(){
    var reader = new FileReader();
    reader.addEventListener('load', function () {
        //stock la base 64 de l'image
        var img = reader.result;
        //change le background par l'url de l'image en base64
        document.body.style.backgroundImage = 'url(' + img + ')';
    });
    if (inputImage.files[0] == null) {
        alert("Erreur : vous n'avez pas sélectionné d'image !");
    } else {
        reader.readAsDataURL(inputImage.files[0]);
    }
};

//Fonction horloage pour afficher la date et l'heure du jour
function horloge(type)
{
    let date = new Date();
    let seconde = date.getSeconds();
    let heure = date.getHours();
    let minutes = date.getMinutes();

    //BONJOUR/BON APRÈS-MIDI/BONSOIR
    if (heure > 0 && heure < 12) {
        document.getElementById("bonjour").innerText = "Bonjour Adrien,";
    } else if (heure > 12 && heure < 18) {
        document.getElementById("bonjour").innerText = "Bon après-midi Adrien,";
    } else if (heure >= 18 && heure <= 23) {
        document.getElementById("bonjour").innerText = "Bonsoir Adrien,";
    }

    //RAJOUTER LES 0
    if (seconde < 10) {
        seconde = "0" + seconde;
    } if (heure < 10) {
        heure = "0" + heure;
    } if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //tableau pour les jours et mois
    let tab_jour=["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    var tab_mois=["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    document.getElementById("date").textContent = tab_jour[date.getDay()] + " " + date.getDay() + " " + tab_mois[date.getMonth()] + " " + date.getFullYear();

    //Type FR
    if (type === "fr") {
        let heurFinal = heure+":"+ minutes+":"+ seconde;
        document.getElementById("heure").textContent = heurFinal;

    }
    //Type INTER
    if (type === "inter") {
        let heurFinal = "";
        if (heure > 12) {
            heurFinal = heure % 12 +":"+ minutes+":"+ seconde + " PM";
        } else {
            heurFinal = heure % 12+":"+ minutes+":"+ seconde + " AM";
        }
        document.getElementById("heure").textContent = heurFinal;
    }
}

//Bouton pour swap l'heure FR / INTER
document.getElementById("heure").onclick = function(){
    console.log(bool);
    if (bool === "fr") {
        horloge("inter");
        bool = "inter";
    }
    else if (bool === "inter") {
        horloge("fr");
        bool = "fr";
    }
};

//Fonction get pour récupérer la response de l'API
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//Afficher une citation
function citation() {
    let APIcitation = httpGet("https://api.whatdoestrumpthink.com/api/v1/quotes/random");
    const citation = JSON.parse(APIcitation);
    document.getElementById("citationIci").innerText = "“" + citation.message + "“";
}

//Clique sur le bouton voir une citation random
document.getElementById("citationButton").onclick = function() {
    citation();
};

//Affichage de la météo dans le tableau
document.getElementById("buttonMeteo").onclick = function () {
    let queryLoc = document.getElementById("localisation").value;
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+queryLoc+"&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric";
    let resultMeteo = httpGet(url);
    const meteo = JSON.parse(resultMeteo);
    document.getElementById("ville").innerText = queryLoc;
    document.getElementById("temp").innerText = meteo.main.temp + " °c";
    document.getElementById("humid").innerText = meteo.main.humidity + " %";
    document.getElementById("wind").innerText = meteo.wind.speed + " km/h";
    document.getElementById("clouds").innerText = meteo.clouds.all + " %";
    document.getElementById("tableMeteo").style.visibility = "visible";
};

//ajouter texte dans les memos
document.getElementById("focusButton").onclick = function() {

    let div = document.getElementById('memo');
    let texte = document.getElementById('focus');
    if (texte.value === "") {
        alert("Vous devez entrer du texte !")
    } else {
        document.getElementById("memo").style.visibility = "visible";
        div.style.height = div.offsetHeight + 24 +"px";
        var li = document.createElement('li');
        li.innerHTML = "🗑" + texte.value;
        document.getElementById('liste').appendChild(li);
        texte.value = "";

        var liste=document.getElementById("liste").getElementsByTagName("li");

        for(li in liste){
            liste[li].onclick=function(){
                this.parentNode.removeChild(this);
                div.style.height = div.offsetHeight - 24 +"px";
            }
        }

    }

};
//reset memo
document.getElementById("resetButton").onclick = function() {
    var ul = document.getElementById('liste');
    if (ul) {
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    let div = document.getElementById('memo');
    div.style.height = "75px";
    div.style.visibility = "hidden";
};


//Citation dès le départ
citation();
//Horloge par défaut en FR
horloge(bool);
//Time interval de 1 seconde pour l'horloge
setInterval(function(){
    horloge(bool)
}, 1000);

