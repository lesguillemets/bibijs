function makeCites(){
  // returns a SET of cites, by the key.
  var used = new Set();
  // something like .map(getRefName)
  for (let cite of document.getElementsByTagName('citebib')){
    var refName = cite.getAttribute('ref');
    used.add( refName );
  }
  return used;
}

function makeAux(bib, used){
  // returns a LIST of keys, sorted by the title,
  // of the cites used
  return(
    Object.keys(bib).filter(
      function(c){ return used.has(c); }
    ).sort(function(a,b) {
    // FIXME : compare `on` title.toLower
      var aTitle = bib[a]['title'].toLowerCase();
      var bTitle = bib[b]['title'].toLowerCase();
      if (aTitle > bTitle){ return 1; }
      if (aTitle < bTitle){ return -1; }
      if (aTitle === bTitle){ return 0; }
    })
  );
}

function showCite(entry){
  // returns a DOM
  // definitely need a better implementation
  var elm = document.createElement('div');
  var title = document.createElement('em');
  title.textContent = entry.title + '. ';
  var author = document.createElement('author');
  author.textContent = entry.author + '. ';

  elm.appendChild(title);
  elm.appendChild(author);
  return elm;
}

function printBibliography(bib, aux, elm){
  var list = document.createElement('ol');
  list.className += 'bib';
  for (let title of aux){
    var l = document.createElement('li');
    l.className += 'bibitem';
    l.appendChild(showCite(bib[title]));
    l.id = 'cite-' + title;
    list.appendChild(l);
  }
  elm.appendChild(list);
}

function secondRun(aux){
  for (let cite of document.getElementsByTagName('citebib')){
    var refName = cite.getAttribute('ref');
    var refNumber = aux.indexOf(refName);
    // print as such
    // I know this can easily be compromised
    var sup = document.createElement('sup');
    sup.clasName += 'cite';
    var a = document.createElement('a');
    a.setAttribute('href', '#cite-' + refName);
    a.textContent = '[' + (refNumber + 1) + ']';
    sup.appendChild(a);
    cite.appendChild(sup);
  }
}

function main(){
  var bib = getBibs();
  var usedRefnames = makeCites();
  var aux = makeAux(bib, usedRefnames);
  printBibliography(bib, aux,
                    document.getElementById('references'));
  secondRun(aux);
}

window.addEventListener('load', main);
