var muestra = [];
var lambda;
var n;
var p;
var tam;
var media1;
var varianza1;
var media2;
var varianza2;

function verBinomial() {
  tam = document.getElementById('tam').value;
  if (tam === "") return false;
  n = document.getElementById('n').value;
  if (n === "") return false;
  p = document.getElementById('p').value;
  if (p === "") return false;
  console.log('TAM: ' + tam);
  console.log('N: ' + n);
  console.log('P: ' + p);
  muestra = calcularBinomial(tam, n, p);
  console.log(muestra);
  insertarGraficoFrecuencias(muestra);
  varianza1 = varianza(muestra, "varianza1");
  media1 = media(muestra, "media1");
  var tcl = calcularTCL(muestra, varianza1, media1);
  insertarGraficoTCL(tcl);
  varianza2 = varianza(tcl, "varianza2");
  media2 = media(tcl, "media2");
  var prob = document.getElementById("prob");
  prob.classList.remove("d-none");
  return true;
}

function calcularBinomial(tam, n, p) {
  var array = [];
  for (var j = 0; j < tam; j++) {
    var x = 0;
    for (var i = 0; i < n; i++) {
      if (Math.random() < p)
        x++;
    }
    array.push(x);
  }
  array.sort((a, b) => a - b);
  return array;
}

function verPoisson() {
  n = document.getElementById('n').value;
  if (n === "") return false;
  lambda = document.getElementById('lambda').value;
  if (lambda === "") return false;
  muestra = calcularPoisson(n, lambda);
  insertarGraficoFrecuencias(muestra);
  varianza1 = varianza(muestra, "varianza1");
  media1 = media(muestra, "media1");
  var tcl = calcularTCL(muestra, varianza1, media1);
  insertarGraficoTCL(tcl);
  varianza2 = varianza(tcl, "varianza2");
  media2 = media(tcl, "media2");
  var prob = document.getElementById("prob");
  prob.classList.remove("d-none");
  return true;
}

function calcularPoisson(n, lambda) {
  var muestra = [];
  for (i = 0; i <= n; i++) {
    muestra.push(calcularValorPoisson(lambda));
  }
  muestra.sort((a, b) => a - b);
  return muestra;
}

function calcularValorPoisson(lambda) {
  var L = Math.exp(-lambda);
  var p = 1.0;
  var k = 0;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

function calcularTCL(muestra, varianza, media) {
  var tcl = [];
  for (var i = 0; i < muestra.length; i++) {
    tcl.push((muestra[i] - media) / Math.sqrt(varianza));
  }
  return tcl;
}

function insertarGraficoTCL(tcl) {
  var muestraN = foo(tcl.sort((a, b) => a - b));
  console.log('Muestra N[0]: ' + muestraN[0]);
  console.log('Muestra N[1]: ' + muestraN[1]);
  var header = document.getElementById("h1_tcl");
  header.classList.remove("d-none");
  var histograma = {
    x: tcl,
    type: 'histogram'
  };
  var normal = {
    x: muestraN[0],
    y: muestraN[1],
    type: 'line'
  };
  var layout = { showlegend: false };
  var data = [histograma, normal];
  Plotly.newPlot('tcl', data, layout);
}

function insertarGraficoFrecuencias(muestra) {
  var trace = {
    x: muestra,
    type: 'histogram',
  };

  var data = [trace];
  Plotly.newPlot('frecuencias', data);
}

function probIntervalo(valor, tipo) {
  var a = document.getElementById('a').value;
  if (a === "") return false;
  console.log(parseInt(a));
  var b = document.getElementById('b').value;
  if (b === "") return false;
  console.log(parseInt(b));
  if (b < a) {
    document.getElementById('error').innerHTML = "Intervalo incorrecto";
    return true;
  }
  var pIntervalo = calcularProbIntervalMuestra(parseInt(a), parseInt(b), valor);
  var pReal = calcularProbIntervaloReal(parseInt(a), parseInt(b), valor, tipo);
  var error = calcularError(pIntervalo, pReal);
  return true;
}

function calcularProbIntervalMuestra(a, b, valor) {
  var frecuencias = foo(muestra);
  switch (valor) {
    case 1:
      // intervalo (a,b)
      var prob = calcularProbMuestra(a + 1, b - 1, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 2:
      // intervalo [a,b)
      var prob = calcularProbMuestra(a, b - 1, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 3:
      // intervalo (a,b]
      var prob = calcularProbMuestra(a + 1, b, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 4:
      // intervalo [a,b]
      var prob = calcularProbMuestra(a, b, frecuencias);
      document.getElementById('probmuestra').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
  }
}

function calcularProbIntervaloReal(a, b, valor, tipo) {
  var prob;
  switch (valor) {
    case 1:
      // intervalo (a,b)      
      if (tipo == 1) prob = calcularProbRealPoisson(a + 1, b - 1);
      else prob = calcularProbRealBinomial(a + 1, b - 1, frecuencias);
      document.getElementById('probreal').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 2:
      // intervalo [a,b)
      if (tipo == 1) prob = calcularProbRealPoisson(a, b - 1);
      else prob = calcularProbRealBinomial(a, b - 1);
      document.getElementById('probreal').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 3:
      // intervalo (a,b]
      if (tipo == 1) prob = calcularProbRealPoisson(a + 1, b);
      else prob = calcularProbRealBinomial(a + 1, b);
      document.getElementById('probreal').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
    case 4:
      // intervalo [a,b]
      if (tipo == 1) prob = calcularProbRealPoisson(a, b);
      else prob = calcularProbRealBinomial(a, b);
      document.getElementById('probreal').innerHTML = "Probabilidad en la muestra: " + prob.toFixed(4) * 100 + "%";
      return prob;
  }
}

function calcularProbRealBinomial(a, b) {
  var probabilidad = 0;
  for (var i = a; i <= b; i++) {
    var combinatorio = numCombinatorio(n, i);
    var binomial = combinatorio * Math.pow(p, i) * Math.pow((1 - p), (n - i));
    console.log('Binomial ' + i + ' :' + binomial);
    probabilidad += binomial;
    console.log('Probabilidad Real ' + i + ':' + probabilidad);
  }
  console.log('Probabilidad Final:' + probabilidad);
  return probabilidad;
}

function calcularProbRealPoisson(a, b) {
  var probabilidad = 0;
  for (var i = a; i <= b; i++) {
    var poisson = ((Math.pow(Math.E, -i) * Math.pow(i, lambda))) / fact(lambda);
    console.log('Poisson ' + i + ' :' + poisson);
    probabilidad += poisson;
    console.log('Probabilidad Real ' + i + ':' + probabilidad);
  }
  console.log('Probabilidad Final:' + probabilidad);
  return probabilidad;
}

function calcularError(pIntervalo, pReal) {
  document.getElementById('error').innerHTML = "Error cometido: " + (Math.abs(pIntervalo - pReal).toFixed(4) * 100) + "%";
}

function calcularProbMuestra(a, b, frecuencias) {
  var probabilidad = 0;
  var frec0 = frecuencias[0];
  var frec1 = frecuencias[1];
  console.log('A: ' + a);
  console.log('B: ' + b);

  for (var j = 0; j < frec0.length; j++) {
    console.log('Indice ' + j);
    if (frec0[j] >= a && frec0[j] <= b) {
      console.log('Frecuencia: ' + j + ' ' + frec1[j]);
      probabilidad += frec1[j];
    }
  }

  return probabilidad / muestra.length;
}

function media(array, id) {
  var avg = arr.mean(array);
  if (id === 'media2') document.getElementById(id).innerHTML = "x&#x0304; = " + Math.abs(avg.toFixed(2));
  else document.getElementById(id).innerHTML = "x&#x0304; = " + avg.toFixed(2);
  return avg;
}

function varianza(array, id) {
  var varianza = arr.variance(array);
  document.getElementById(id).innerHTML = "S<sup>2</sup>= " + varianza.toFixed(2);
  return varianza;
}

function foo(array) {
  var a = [], b = [], prev;

  for (var i = 0; i < array.length; i++) {
    if (array[i] !== prev) {
      a.push(array[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = array[i];
  }
  console.log(a);
  console.log(b);
  return [a, b];
}

function numCombinatorio(n, k) {
  var coeff = 1;
  for (var x = n - k + 1; x <= n; x++) coeff *= x;
  for (x = 1; x <= k; x++) coeff /= x;
  return coeff;
}

function fact(num) {
  var total = 1;
  for (i = 1; i <= num; i++) {
    total = total * i;
  }
  return total;
}