var items = document.querySelectorAll("#projectContainer"),
    tab = [],
    divIndex;


for (var i = 0; i < items.length; i++) {
    tab.push(items[i].innerHTML);
}

// get li index using tab array on li click event
for (var i = 0; i < items.length; i++) {

    items[i].onclick = function() {

        divIndex = tab.indexOf(this.innerHTML);
        console.log(this.innerHTML + " INDEX = deleted " + divIndex);
    };

}

/*function removeLI() {

    items[divIndex].parentNode.removeChild(items[divIndex]);

}*/